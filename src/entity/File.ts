import { ContentType } from '@/entity/ContentType'
import { Language } from '@/entity/Language'

export interface File {
    name: string
    id: string
    type: ContentType
    lang: Language
    content?: string | null
}
