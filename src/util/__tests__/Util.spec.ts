import { describe, expect, it } from 'vitest'
import { decode, encode, extractDataFromParameters } from '../Util'
import { Language } from '../../entity/Language'
import { SpringBootVersion } from '../../entity/SpringBootVersion'
import type { SpringProject } from '../../entity/SpringProject'
import type { VueJsProject } from '../../entity/VueJsProject'
import { ProjectType } from '../../entity/ProjectType'

const defaultSpringProject = {
    language: Language.Java,
    springBootVersion: SpringBootVersion['3_3_5'] as SpringBootVersion,
    group: 'com.example',
    name: 'demo',
    artifact: 'demo',
    packageName: 'demo',
    description: 'This application needs some description to be filled out.',
    javaVersion: 17
} as SpringProject

const defaultVueJsProject = {
    language: Language.Typescript,
    name: 'demo',
    artifact: 'demo',
    nodeVersion: 20,
    includeUnitTest: true,
    includePinia: false,
    indentSize: 2,
    description: 'This application needs some description to be filled out.',
    includeRouter: false,
    integrationTest: 'playwright',
    includeEslint: true,
    includePrettier: true
} as VueJsProject

describe('Functions in util works correctly', () => {
    it.concurrent('encode/decode works correctly for ascii characters', () => {
        expect(decode(encode('some-input'))).toBe('some-input')
    })

    it.concurrent('encode/decode works correctly for blanks', () => {
        expect(decode(encode('      '))).toBe('      ')
    })

    it.concurrent('encode/decode works correctly for unicode characters', () => {
        expect(decode(encode('a Ā 𐀀 文 🦄'))).toBe('a Ā 𐀀 文 🦄')
    })

    it.concurrent('can decode parameters correctly', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"kotlin","name":"demoo","springBootVersion":"3.1.5","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":21},"packages":["native","devtools","lombok","configuration-processor","pebble"]}'
        )
        expect(extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.projectType).toBe(
            ProjectType.Spring
        )
    })

    it.concurrent('can validate parameters if bad JSON is given', () => {
        const input = encode('Bad Data, true')
        expect(extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)).toBe(null)
    })

    it.concurrent('can validate project type in parameters correctly for Spring Project', () => {
        const input = encode(
            '{"projectType":false,"metaData":{"language":"kotlin","name":"demoo","springBootVersion":"3.1.5","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":21},"packages":["native","devtools","lombok","configuration-processor","pebble"]}'
        )
        expect(extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)).toBe(null)
    })

    it.concurrent('can validate language and packages in parameters correctly for Spring Project', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"potlin","name":"demoo","springBootVersion":"3.1.5","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":21},"packages":["bogus"]}'
        )
        expect(extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.metaData.language).toBe(
            Language.Java
        )
    })

    it.concurrent('can validate Spring Boot version in parameters correctly for Spring Project', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"potlin","name":"demoo","springBootVersion":"4.1.5","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":21},"packages":["native","devtools","lombok","configuration-processor","pebble"]}'
        )
        expect(
            (extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.metaData as SpringProject)
                .springBootVersion
        ).toBe(SpringBootVersion['3_3_5'])
    })

    it.concurrent('can validate JDK version in parameters correctly for Spring Project', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"potlin","name":"demoo","springBootVersion":"3.1.5","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":51},"packages":["native","devtools","lombok","configuration-processor","pebble"]}'
        )
        expect(
            (extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.metaData as SpringProject)
                .javaVersion
        ).toBe(17)
    })

    it.concurrent('can validate parameters correctly for package name for Spring Project', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"potlin","name":"demoo","springBootVersion":"3.1.5","group":"com.playpen","artifact":"demoo","packageName":false,"description":"","javaVersion":21},"packages":["native","devtools","lombok","configuration-processor","pebble"]}'
        )
        expect(
            (extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.metaData as SpringProject)
                .packageName
        ).toBe('com.playpen.demoo')
    })

    it.concurrent('can validate parameters correctly for group name for Spring Project', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"potlin","name":"demoo","springBootVersion":"3.1.5","group":false,"artifact":"demoo","packageName":false,"description":"","javaVersion":21},"packages":["native","devtools","lombok","configuration-processor","pebble"]}'
        )
        expect(
            (extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.metaData as SpringProject)
                .packageName
        ).toBe('com.example.demoo')
    })

    it.concurrent('can validate parameters correctly for name for Spring Project', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"potlin","name":false,"springBootVersion":"3.1.5","group":"com.playpen","artifact":"demoo","packageName":false,"description":"","javaVersion":21},"packages":["native","devtools","lombok","configuration-processor","pebble"]}'
        )
        expect(
            (extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.metaData as SpringProject)
                .packageName
        ).toBe('com.playpen.demoo')
    })

    it.concurrent('can validate artifact name in parameters correctly for Spring Project', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"kotlin","name":"demoo","springBootVersion":"3.1.5","group":"com.playpen","artifact":234,"packageName":"com.playpen.demoo","description":"","javaVersion":21},"packages":["native","devtools","lombok","configuration-processor","pebble"]}'
        )
        expect(
            (extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.metaData as SpringProject)
                .artifact
        ).toBe('demo')
    })

    it.concurrent('can validate packages in parameters', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"kotlin","name":"demoo","springBootVersion":"3.1.5","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":21},"packages":false}'
        )
        expect(extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.packages).toStrictEqual([])
    })

    it.concurrent('can validate packages in parameters if it is missing completely', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"kotlin","springBootVersion":"3.1.5","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":21}}'
        )
        expect(extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.packages).toStrictEqual([])
    })

    it.concurrent('can validate packages in parameters if it have invalid types', () => {
        const input = encode(
            '{"projectType":"spring","metaData":{"language":"kotlin","name":"demoo","springBootVersion":"3.1.5","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":21},"packages":["test",false,23]}'
        )
        expect(extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)?.packages).toStrictEqual([
            'test'
        ])
    })

    it.concurrent('can validate project type', () => {
        const input = encode(
            '{"projectType":"null","metaData":{"language":"ts","name":"demo","artifact":"demo","nodeVersion":20,"includePinia":true,"includeRouter":true,"includeUnitTest":true,"description":"","indentSize":4,"integrationTest":"playwright","includeEslint":true,"includePrettier":true},"packages":[]}'
        )

        expect(extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)).toBe(null)
    })

    it.concurrent('can extract parameter for VueJS project', () => {
        const input = encode(
            '{"projectType":"vuejs","metaData":{"language":"ts","name":"demo","artifact":"demo","nodeVersion":20,"includePinia":true,"includeRouter":false,"includeUnitTest":true,"description":"","indentSize":4,"integrationTest":"playwright","includeEslint":true,"includePrettier":true},"packages":[]}'
        )
        const result = extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)
        const project = (result?.metaData ?? null) === null ? null : (result?.metaData as VueJsProject)
        expect(project !== null).toBe(true)
        expect(project?.language).toBe(Language.Typescript)
        expect(project?.nodeVersion).toBe(20)
        expect(project?.includePinia).toBe(true)
        expect(project?.includeRouter).toBe(false)
        expect(project?.includeUnitTest).toBe(true)
        expect(project?.integrationTest).toBe('playwright')
        expect(project?.indentSize).toBe(4)
        expect(project?.includeEslint).toBe(true)
    })

    it.concurrent('can validate language parameter for VueJS project', () => {
        const input = encode(
            '{"projectType":"vuejs","metaData":{"language":"taco","name":"demo","artifact":"demo","nodeVersion":20,"includePinia":true,"includeRouter":false,"includeUnitTest":true,"description":"","indentSize":4,"integrationTest":"playwright","includeEslint":true,"includePrettier":true},"packages":[]}'
        )
        const result = extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)
        const project = (result?.metaData ?? null) === null ? null : (result?.metaData as VueJsProject)
        expect(project?.language).toBe(Language.Typescript)
    })

    it.concurrent('can validate language parameter if missing for VueJS project', () => {
        const input = encode(
            '{"projectType":"vuejs","metaData":{"language":false,"name":"demo","artifact":"demo","nodeVersion":20,"includePinia":true,"includeRouter":false,"includeUnitTest":true,"description":"","indentSize":4,"integrationTest":"playwright","includeEslint":true,"includePrettier":true},"packages":[]}'
        )
        const result = extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)
        const project = (result?.metaData ?? null) === null ? null : (result?.metaData as VueJsProject)
        expect(project?.language).toBe(Language.Typescript)
    })

    it.concurrent('can validate language parameter if missing for VueJS project variation #2', () => {
        const input = encode(
            '{"projectType":"vuejs","metaData":{"includePinia":true,"includeRouter":false,"includeUnitTest":true,"indentSize":4,"integrationTest":"playwright","includeEslint":true,"includePrettier":true},"packages":[]}'
        )
        const result = extractDataFromParameters(input, defaultSpringProject, defaultVueJsProject)
        const project = (result?.metaData ?? null) === null ? null : (result?.metaData as VueJsProject)
        expect(project?.name).toBe('demo')
        expect(project?.indentSize).toBe(4)
    })
})
