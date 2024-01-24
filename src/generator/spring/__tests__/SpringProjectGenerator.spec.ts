import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { getContent } from '../SpringProjectGenerator'
import { SpringBootVersion } from '@/entity/SpringBootVersion'
import type { SpringProject } from '@/entity/SpringProject'
import type { File } from '@/entity/File'
import type { Package } from '@/entity/Dependency'
import { Language } from '../../../entity/Language'
import spring3_1_8 from '../../../stores/spring-3_1_8'
import spring3_2_2 from '../../../stores/spring-3_2_2'

const spring3_1_6Packages: Package[] = spring3_1_8.flatMap((it) => {
    return it.packages.map((pack) => {
        return pack
    })
})

const spring3_2_2Packages: Package[] = spring3_2_2.flatMap((it) => {
    return it.packages.map((pack) => {
        return pack
    })
})

function getOutput(fileName: string) {
    return fs.readFileSync(
        path.join('src', 'generator', 'spring', '__tests__', 'outputs', fileName + '.output'),
        'utf-8'
    )
}

function getMetadata(
    language: Language.Kotlin | Language.Java = Language.Java,
    springBootVersion: SpringBootVersion = SpringBootVersion['3_1_8'],
    jdkVersion: 17 | 21 = 17
): SpringProject {
    return {
        language: language,
        springBootVersion: springBootVersion,
        group: 'com.test',
        artifact: 'demo',
        packageName: 'demo',
        name: 'demo',
        buildTool: 'gradle',
        description: 'demo',
        javaVersion: jdkVersion
    }
}

function getGradleContent(
    dependencies: Package[],
    language: Language.Kotlin | Language.Java = Language.Java,
    springBootVersion: SpringBootVersion = SpringBootVersion['3_1_8'],
    jdkVersion: 17 | 21 = 17
): string {
    return (
        getContent({
            metadata: getMetadata(language, springBootVersion, jdkVersion),
            dependencies: dependencies
        }).tree[0] as File
    ).content!!
}

function getDependencies(input: string[], springBootVersion: SpringBootVersion = SpringBootVersion['3_1_8']) {
    if (springBootVersion === SpringBootVersion['3_1_8']) {
        return spring3_1_6Packages.filter((it) => input.includes(it.id))
    }

    return spring3_2_2Packages.filter((it) => input.includes(it.id))
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
                getDependencies(['native', 'devtools', 'lombok', 'configuration-processor', 'docker-compose-setup']),
                Language.Kotlin
            )
        ).toBe(getOutput('all-developer-tools-selected-with-kotlin'))
    })

    it('Can generate build.gradle with Developer tools selected for Kotlin for Spring Boot 3.2', () => {
        expect(
            getGradleContent(
                getDependencies([
                    'native',
                    'devtools',
                    'graphql-code-generation',
                    'lombok',
                    'configuration-processor',
                    'docker-compose-setup'
                ]),
                Language.Kotlin,
                SpringBootVersion['3_2_2']
            )
        ).toBe(getOutput('all-developer-tools-selected-with-kotlin-for-spring-3-2'))
    })

    it('Can generate build.gradle with Distributed tracing and Wavefront for Spring Boot 3.2', () => {
        expect(
            getGradleContent(
                getDependencies(['wavefront', 'distributed-tracing']),
                Language.Java,
                SpringBootVersion['3_2_2'],
                21
            )
        ).toBe(getOutput('distributed-tracing-with-wavefront-with-java-spring_3_2_JDK_21'))
    })
})
