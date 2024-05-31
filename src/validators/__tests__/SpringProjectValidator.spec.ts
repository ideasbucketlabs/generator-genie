/* eslint-disable vue/max-len */
import { describe, expect, it } from 'vitest'
import { isValid } from '../SpringProjectValidator'

describe('Can validate Spring project', () => {
    it.concurrent('it can validate build tool for Spring Project', () => {
        const input =
            '{"language":"kotlin","name":"demoo","description":"test","springBootVersion":"3.2.6","buildTool": 3,"group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ buildTool: 'Invalid build tool selection.' })
    })

    it.concurrent('it can validate description name for Spring Project', () => {
        const input =
            '{"language":"kotlin","name":"demoo","springBootVersion":"3.2.6","buildTool": "gradle","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ description: 'Description cannot be null or blank.' })
    })

    it.concurrent('it can validate description data type for Spring Project #1', () => {
        const input =
            '{"language":"kotlin","name":"demoo","description":false, "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","description":"","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ description: 'Description cannot be null or blank.' })
    })

    it.concurrent('it can validate description data type for Spring Project #2', () => {
        const input =
            '{"language":"kotlin","name":"demoo","description":234234, "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ description: 'Description cannot be null or blank.' })
    })

    it.concurrent('it can validate language type for Spring Project #1', () => {
        const input =
            '{"language":"potlin","name":"demoo","description":"test", "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ language: 'Language should be either Kotlin or Java.' })
    })

    it.concurrent('it can validate language type for Spring Project #2', () => {
        const input =
            '{"language":false,"name":"demoo","description":"test", "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ language: 'Language should be either Kotlin or Java.' })
    })

    it.concurrent('it can validate language type for Spring Project #3', () => {
        const input =
            '{"name":"demoo","description":"test", "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ language: 'Language should be either Kotlin or Java.' })
    })

    it.concurrent('it can validate name for Spring Project #1', () => {
        const input =
            '{"name":"","language":"kotlin","description":"test", "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            name: 'Name cannot be null or blank and must be at least 2 characters.'
        })
    })

    it.concurrent('it can validate name for Spring Project #2', () => {
        const input =
            '{"name":false,"language":"kotlin","description":"test", "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            name: 'Name cannot be null or blank.'
        })
    })

    it.concurrent('it can validate name for Spring Project #3', () => {
        const input =
            '{"language":"kotlin","description":"test", "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            name: 'Name cannot be null or blank and must be at least 2 characters.'
        })
    })

    it.concurrent('it can validate name for length for Spring Project #4', () => {
        const input =
            '{"name":"t","language":"kotlin","description":"test", "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            name: 'Name cannot be null or blank and must be at least 2 characters.'
        })
    })

    it.concurrent('it can validate name for length for Spring Project #5', () => {
        const input =
            '{"name":"9tt","language":"kotlin","description":"test", "buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            name: 'Name must be all alpha numeric and must begin with alpha character.'
        })
    })

    it.concurrent('it can validate Spring Boot version for Spring Project #1', () => {
        const input =
            '{"name":"test","language":"kotlin","description":"test", "buildTool": "gradle","springBootVersion":334,"group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            springBootVersion: 'Spring Boot version is invalid.'
        })
    })

    it.concurrent('it can validate Spring Boot version for Spring Project #2', () => {
        const input =
            '{"name":"test","language":"kotlin","description":"test", "buildTool": "gradle","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            springBootVersion: 'Spring Boot version is invalid.'
        })
    })

    it.concurrent('it can validate Spring Boot version for Spring Project #3', () => {
        const input =
            '{"name":"test","language":"kotlin","description":"test", "buildTool": "gradle","springBootVersion":false, "group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            springBootVersion: 'Spring Boot version is invalid.'
        })
    })

    it.concurrent('it can validate Java version for Spring Project #1', () => {
        const input =
            '{"language":"kotlin","description":"test","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":41}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ javaVersion: 'Invalid Java version.' })
    })

    it.concurrent('it can validate Java version for Spring Project #2', () => {
        const input =
            '{"language":"kotlin","description":"test","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo","javaVersion":false}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ javaVersion: 'Invalid Java version.' })
    })

    it.concurrent('it can validate Java version for Spring Project #3', () => {
        const input =
            '{"language":"kotlin","description":"test","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo"}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ javaVersion: 'Invalid Java version.' })
    })

    it.concurrent('it can validate Java version for Spring Project #4', () => {
        const input =
            '{"language":"kotlin","description":"test","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"demoo","packageName":"com.playpen.demoo"}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ javaVersion: 'Invalid Java version.' })
    })

    it.concurrent('it can validate Artifact name for Spring Project #1', () => {
        const input =
            '{"language":"kotlin","description":"test","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":"","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ artifact: 'Artifact cannot be null or blank.' })
    })

    it.concurrent('it can validate Artifact name for Spring Project #2', () => {
        const input =
            '{"language":"kotlin","description":"test","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","artifact":false,"packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ artifact: 'Artifact cannot be null or blank.' })
    })

    it.concurrent('it can validate Artifact name for Spring Project #3', () => {
        const input =
            '{"language":"kotlin","description":"test","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ artifact: 'Artifact cannot be null or blank.' })
    })

    it.concurrent('it can validate Artifact name for Spring Project #4', () => {
        const input =
            '{"language":"kotlin","description":"test","artifact":234,"name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ artifact: 'Artifact cannot be null or blank.' })
    })

    it.concurrent('it can validate Artifact name for Spring Project #5', () => {
        const input =
            '{"language":"kotlin","description":"test","artifact":".wefwef","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            artifact: 'Artifact must begin with a letter and end with a letter or number.'
        })
    })

    it.concurrent('it can validate Artifact name for Spring Project #6', () => {
        const input =
            '{"language":"kotlin","description":"test","artifact":"we$$fwef","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"com.playpen","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            artifact: 'Artifact must only contain letters, numbers, periods, hyphens, and underscores.'
        })
    })

    it.concurrent('it can validate Group format Spring Project #1', () => {
        const input =
            '{"language":"kotlin","description":"test","artifact":"wefwef","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":".com.playpen","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            group: 'Group must not begin or end with `.`, cannot have two consecutive `.`, must begin with alpha character and must be alpha numeric.'
        })
    })

    it.concurrent('it can validate Group format Spring Project #2', () => {
        const input =
            '{"language":"kotlin","description":"test","artifact":"wefwef","buildTool": "gradle","name":"demoo","springBootVersion":"3.2.6","group":"com.playpen.","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            group: 'Group must not begin or end with `.`, cannot have two consecutive `.`, must begin with alpha character and must be alpha numeric.'
        })
    })

    it.concurrent('it can validate Group presence in Spring Project #2', () => {
        const input =
            '{"language":"kotlin","description":"test","artifact":"wefwef","name":"demoo","buildTool": "gradle","springBootVersion":"3.2.6","group":"","packageName":"com.playpen.demoo","javaVersion":21}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            group: 'Group cannot be null or blank and must be all lower case.'
        })
    })
})
