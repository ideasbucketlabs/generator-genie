import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { getContent } from '../SpringProjectGenerator'
import { SpringBootVersion } from '@/entity/SpringBootVersion'
import type { SpringProject } from '@/entity/SpringProject'
import type { File } from '@/entity/File'
import type { Package } from '@/entity/Dependency'
import { Language } from '../../../entity/Language'

function getOutput(fileName: string) {
    return fs.readFileSync(
        path.join('src', 'generator', 'spring', '__tests__', 'outputs', fileName + '.output'),
        'utf-8'
    )
}

function getMetadata(language: Language.Kotlin | Language.Java = Language.Java): SpringProject {
    return {
        language: language,
        springBootVersion: SpringBootVersion['3_1_2'],
        group: 'com.test',
        artifact: 'demo',
        packageName: 'demo',
        name: 'demo',
        description: 'demo',
        javaVersion: 17
    }
}

function getGradleContent(dependencies: Package[], language: Language.Kotlin | Language.Java = Language.Java): string {
    return (
        getContent({
            metadata: getMetadata(language),
            dependencies: dependencies
        }).tree[0] as File
    ).content!!
}

describe('Can generate build.gradle properly', () => {
    it('Can generate build.gradle without any selection', () => {
        expect(getGradleContent([])).toBe(getOutput('nothing-selected'))
    })

    it('Can generate build.gradle without any selection for Kotlin', () => {
        expect(getGradleContent([], Language.Kotlin)).toBe(getOutput('nothing-selected-with-kotlin'))
    })

    it('Can generate build.gradle with Developer tools selected for Kotlin', () => {
        expect(
            getGradleContent(
                [
                    {
                        name: 'GraalVM Native Support',
                        id: 'native',
                        description: 'test',
                        plugin: true,
                        groupId: 'org.graalvm.buildtools.native',
                        version: '0.9.23'
                    },
                    {
                        name: 'Spring Boot DevTools',
                        id: 'devtools',
                        description: 'test',
                        groupId: 'org.springframework.boot',
                        artifactId: 'spring-boot-devtools'
                    },
                    {
                        name: 'Lombok',
                        id: 'lombok',
                        description: 'test',
                        groupId: 'org.projectlombok',
                        artifactId: 'lombok'
                    },
                    {
                        name: 'Spring Configuration Processor',
                        id: 'configuration-processor',
                        description: 'test',
                        groupId: 'org.springframework.boot',
                        artifactId: 'spring-boot-configuration-processor'
                    },
                    {
                        name: 'Docker Compose Support',
                        id: 'docker-compose-setup',
                        description: 'test.',
                        groupId: 'org.springframework.boot',
                        artifactId: 'spring-boot-docker-compose'
                    }
                ],
                Language.Kotlin
            )
        ).toBe(getOutput('all-developer-tools-selected-with-kotlin'))
    })
})
