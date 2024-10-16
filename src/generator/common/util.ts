import type { File } from '@/entity/File'
import type { Folder } from '@/entity/ContentTree'
import { ContentType } from '@/entity/ContentType'

export function getEditorConfig(indentSize: number, maxLine = 120): string {
    return `# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
max_line_length = ${maxLine}
indent_style = space
indent_size = ${indentSize}
`
}

export function sortContentTreeItems(items: Array<File | Folder>): Array<File | Folder> {
    const sortByTypeAndName = (a: File | Folder, b: File | Folder): number => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name) // Alphabetically sort if both are the same type
        }
        return a.type === ContentType.Folder ? -1 : 1 // Folders before files
    }

    // Recursive sorting function
    const sortRecursively = (items: Array<File | Folder>): Array<File | Folder> => {
        return items
            .sort(sortByTypeAndName) // Sort current level
            .map((item) => {
                if (item.type === ContentType.Folder && (item as Folder).children) {
                    ;(item as Folder).children = sortRecursively((item as Folder).children as Array<Folder | File>) // Recursively sort folder's children
                }
                return item
            })
    }

    // Start the recursive sort
    return sortRecursively(items)
}
