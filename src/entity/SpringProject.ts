import type { SpringBootVersion } from '@/entity/SpringBootVersion'
import type { Language } from '@/entity/Language'

export interface SpringProject {
    language: Language.Java | Language.Kotlin
    name: string
    springBootVersion: SpringBootVersion
    group: string
    artifact: string
    packageName: string
    description: string
    buildTool: 'maven' | 'gradle'
    javaVersion: 17 | 21
}
