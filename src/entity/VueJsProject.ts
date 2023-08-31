import type { Language } from '@/entity/Language'

export interface VueJsProject {
    language: Language.Typescript | Language.Javascript
    name: string
    description: string
    artifact: string
    nodeVersion: number
    includeUnitTest: boolean
    includePinia: boolean
    includeRouter: boolean
    indentSize: 2 | 4
    includeEslint: boolean
    includePrettier: boolean
    integrationTest: 'none' | 'playwright' | 'cypress' | 'nightwatch'
}
