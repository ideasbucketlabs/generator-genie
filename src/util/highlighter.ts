import { getHighlighter, type Highlighter, setCDN } from 'shiki'
import { Language } from '@/entity/Language'

let shiki: Highlighter | null = null

async function init() {
    setCDN('https://cdn.jsdelivr.net/npm/shiki/')
    shiki = await getHighlighter({
        theme: 'css-variables',
        langs: ['js', 'java', 'kotlin', 'markdown', 'vue', 'vue-html']
    })
}

export default async function highlight(content: string, language: Language): Promise<string> {
    if (shiki === null) {
        await init()
    }
    return shiki?.codeToHtml(content, { lang: language }) ?? ''
}
