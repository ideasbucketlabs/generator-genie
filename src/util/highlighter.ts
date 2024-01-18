import { Language } from '@/entity/Language'
import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-xml-doc'

export default async function highlight(content: string, language: Language): Promise<{ code: string; lines: number }> {
    // PrismJS does not have native VueJS highlight support so map to html.
    const derivedLanguage = language === Language.Vue ? Language.Html : language
    const highlightedContent = Prism.highlight(content, Prism.languages[derivedLanguage], derivedLanguage)

    return { code: highlightedContent, lines: highlightedContent.split(/\n(?!$)/g).length }
}
