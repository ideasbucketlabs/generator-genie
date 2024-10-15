import * as fs from 'fs'
import { glob } from 'glob'
import * as prettier from 'prettier'
import * as path from 'path'
import { Language } from './../entity/Language' // Do not use @ in this file
import { ContentType } from './../entity/ContentType' // Do not use @ in this file

const template = `import type { File } from '@/entity/File'
/* eslint-disable vue/max-len */
const content: File[] = @@output as File[]

export default new Map<string, File>(content.map((it) => [it.name, it]))
`

let counter = 0
function getId(): string {
    counter += 1
    return `static-processor-ui-${counter}`
}
function getModule(filePath: string): string {
    const parts = filePath.split(path.sep)
    return parts.length < 3 ? '' : parts[2]
}

function getFileName(location: string): string {
    const locationParts = location.split(path.sep)
    const extensionParts = locationParts.length > 0 ? locationParts[locationParts.length - 1].split('.') : []
    extensionParts.pop()

    return extensionParts.join('.')
}

const templateMap = new Map<string, unknown[]>()

function determineFileLanguageType(filename: string): Language {
    if (filename.includes('.java')) {
        return Language.Java
    }

    if (filename.includes('.kt')) {
        return Language.Kotlin
    }

    if (filename.includes('.yaml') || filename.includes('.yml')) {
        return Language.Yaml
    }

    return Language.Text
}

glob(path.join('src', 'generator', '**', '*.txt'), {
    ignore: path.join('src', 'generator', '**', 'compiled', '**')
}).then((files: string[]) => {
    files.forEach((file: string) => {
        const module = getModule(file)
        const templates = templateMap.get(module) ?? []

        templates.push({
            name: getFileName(file),
            content: fs.readFileSync(file, 'utf-8').replace(/\t/g, '    '),
            id: getId(),
            type: ContentType.File,
            lang: determineFileLanguageType(file)
        })
        templateMap.set(module, templates)
    })
    glob(path.join('src', 'generator', '**', 'compiled', '*.ts')).then((files) => {
        files.forEach((file) => {
            fs.unlinkSync(file)
        })
        templateMap.forEach((value, key) => {
            const finalTemplate = template.replace('@@output', JSON.stringify(value, null, 4))
            const filePath = path.join('src', 'generator', key, 'template', 'compiled', 'content.ts')
            prettier.resolveConfig('.prettierrc.json').then((value) => {
                prettier
                    .format(finalTemplate, {
                        ...value,
                        filepath: filePath
                    })
                    .then((content) => {
                        fs.writeFileSync(filePath, content)
                    })
            })
        })
    })
})
