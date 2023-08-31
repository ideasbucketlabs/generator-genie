import type { ContentTree, Folder } from '@/entity/ContentTree'
import type { File } from '@/entity/File'
import JsZip from 'jszip'
import FileSaver from 'file-saver'
import { ContentType } from '@/entity/ContentType'

let counter = 0
export function clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
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
            await zipFolder((value as Folder).children ?? [], zipFile.folder(value.name)!!)
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
