import type { File } from '@/entity/File'
import { ContentType } from '@/entity/ContentType'
export interface ContentTree {
    tree: Array<File | Folder>
}

export interface Folder {
    name: string
    type: ContentType
    id: string
    children?: Array<File | Folder>
}
