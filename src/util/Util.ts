import JsZip from 'jszip'
import FileSaver from 'file-saver'
import type { ContentTree, Folder } from '@/entity/ContentTree'
import type { File } from '@/entity/File'
import { ContentType } from '@/entity/ContentType'
import { ProjectType } from '@/entity/ProjectType'
import type { UnwrapRef } from 'vue'
import type { SpringProject } from '@/entity/SpringProject'
import type { VueJsProject } from '@/entity/VueJsProject'
import { isValid as isValidVueJSProject } from '@/validators/VueJsProjectValidator'
import { isValid as isValidSpringProject } from '@/validators/SpringProjectValidator'

let counter = 0
export function clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function emptyFn(input: unknown) {}

function tryParseJSONObject(jsonString: string): boolean | unknown {
    try {
        const parsedJson = JSON.parse(jsonString)
        if (parsedJson && typeof parsedJson === 'object') {
            return parsedJson as {
                projectType: ProjectType
                metaData: VueJsProject | SpringProject
                packages: string[]
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return false
    }

    return false
}

export function getId(): string {
    counter += 1
    return `ui-${counter}`
}

async function zipFolder(files: Array<File | Folder>, zipFile: JsZip) {
    for (const value of files) {
        if (value.type === ContentType.File) {
            const file = value as File
            const content = file.content ?? null
            if (content !== null && file.lang !== 'binary') {
                zipFile.file(value.name, content)
            } else if (file.lang === 'binary') {
                const fetchResponse = await fetch(value.name)
                const blob = await fetchResponse.blob()
                zipFile.file(value.name, blob)
            }
        } else {
            await zipFolder((value as Folder).children ?? [], zipFile.folder(value.name)!)
        }
    }
}
export async function zipContentTree(contentTree: ContentTree, artifact: string) {
    const zipFile = JsZip()
    await zipFolder(contentTree.tree, zipFile)
    zipFile.generateAsync({ type: 'blob' }).then(function (content) {
        // Force down of the Zip file
        FileSaver.saveAs(content, `${artifact}.zip`)
    })
}

function fallbackCopyTextToClipboard(text: string, errorFn = emptyFn) {
    const range = document.createRange()
    const selection = document.getSelection()
    const mark = document.createElement('span')
    mark.textContent = text
    // avoid screen readers from reading out loud the text
    mark.ariaHidden = 'true'
    // reset user styles for span element
    mark.style.all = 'unset'
    // prevents scrolling to the end of the page
    mark.style.position = 'fixed'
    mark.style.top = '0'
    mark.style.clip = 'rect(0, 0, 0, 0)'
    // used to preserve spaces and line breaks
    mark.style.whiteSpace = 'pre'
    // do not inherit user-select (it may be `none`)
    mark.style.webkitUserSelect = 'text'
    mark.style.userSelect = 'text'

    document.body.appendChild(mark)

    range.selectNodeContents(mark)
    selection?.addRange(range)

    try {
        const successful = document.execCommand('copy')
        if (!successful) {
            errorFn('Could not copy')
        }
    } catch (err) {
        errorFn(err)
    } finally {
        if (selection) {
            if (typeof selection.removeRange == 'function') {
                selection.removeRange(range)
            } else {
                selection.removeAllRanges()
            }
        }

        if (mark) {
            document.body.removeChild(mark)
        }
    }
}

export async function copyToClipboard(text: string, errorFn = emptyFn) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text)
        return
    }
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        errorFn(err)
    }
}

export function encode(input: string): string {
    const binString = String.fromCodePoint(...new TextEncoder().encode(input))
    return btoa(binString)
}

export function decode(input: string): string {
    const binaryString = atob(input)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
}

export function extractDataFromParameters(
    input: string,
    springProject: UnwrapRef<SpringProject>,
    vueJsProject: UnwrapRef<VueJsProject>
): { projectType: ProjectType; metaData: VueJsProject | SpringProject; packages: string[] } | null {
    const parameters = tryParseJSONObject(decode(input)) as {
        projectType: ProjectType
        metaData: VueJsProject | SpringProject
        packages: string[]
    }

    if (!parameters) {
        return null
    }

    if ((parameters.metaData ?? null) === null || (parameters.projectType ?? null) === null) {
        return null
    }

    if (parameters.projectType !== ProjectType.VueJS && parameters.projectType !== ProjectType.Spring) {
        return null
    }

    const packages = (function (input: unknown) {
        if (Array.isArray(input)) {
            return input.filter((it) => typeof it === 'string')
        }
        return []
    })(parameters?.packages ?? [])
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    const final: Record<string, any> = {}
    if (parameters.projectType === ProjectType.VueJS) {
        parameters.metaData.description = 'This application needs some description to be filled out.'
        const errors = isValidVueJSProject(parameters.metaData as VueJsProject)
        const errorKeys = new Set(Object.keys(errors))
        const keys = Object.keys(vueJsProject) as Array<keyof typeof vueJsProject>
        for (const key of keys) {
            if (key in parameters.metaData && !errorKeys.has(key)) {
                final[key] = (parameters.metaData as VueJsProject)[key]
            } else {
                final[key] = vueJsProject[key]
            }
        }
        ;(final as VueJsProject).artifact = final.name + '.zip'
        return {
            projectType: parameters.projectType,
            metaData: final as unknown as VueJsProject,
            packages: packages
        }
    } else if (parameters.projectType === ProjectType.Spring) {
        parameters.metaData.description = 'This application needs some description to be filled out.'
        const errors = isValidSpringProject(parameters.metaData as SpringProject)
        const errorKeys = new Set(Object.keys(errors))
        const keys = Object.keys(springProject) as Array<keyof typeof springProject>
        for (const key of keys) {
            if (key in parameters.metaData && !errorKeys.has(key)) {
                final[key] = (parameters.metaData as SpringProject)[key]
            } else {
                final[key] = springProject[key]
            }
        }
        ;(final as SpringProject).packageName = final.group + '.' + final.artifact
        return {
            projectType: parameters.projectType,
            metaData: final as unknown as SpringProject,
            packages: packages
        }
    }

    return null
}
