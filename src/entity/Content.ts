export interface Content {
    name: string
    extension?: string
    content?: string
    mimeType?: string
    children?: Array<Content>
}
