import { describe, expect, it } from 'vitest'
import { isValid } from '../VueJsProjectValidator'

describe('Can validate VueJS project', () => {
    it.concurrent('can validate name for VueJS Project', () => {
        const input =
            '{"language":"ts","description":"test","name":"","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ name: 'Name cannot be null or blank.' })
    })

    it.concurrent('can validate name data type for VueJS Project', () => {
        const input =
            '{"language":"ts","description":"test","name":false,"artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ name: 'Name cannot be null or blank.' })
    })

    it.concurrent('can validate missing name for VueJS Project', () => {
        const input =
            '{"language":"ts","description":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ name: 'Name cannot be null or blank.' })
    })

    it.concurrent('can validate name format for VueJS Project', () => {
        const input =
            '{"language":"ts","description":"test","name":"Test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            name: 'Name must comply with `package.json` name attribute. No spaces, uppercase and special characters allowed.'
        })
    })

    it.concurrent('can validate description for VueJS Project #1', () => {
        const input =
            '{"language":"ts","description":"","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ description: 'Description cannot be null or blank.' })
    })

    it.concurrent('can validate description for VueJS Project #2', () => {
        const input =
            '{"language":"ts","description":false,"name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ description: 'Description cannot be null or blank.' })
    })

    it.concurrent('can validate description for VueJS Project #3', () => {
        const input =
            '{"language":"ts","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ description: 'Description cannot be null or blank.' })
    })

    it.concurrent('can validate Node version for VueJS Project #1', () => {
        const input =
            '{"language":"ts","description":"test","name":"test","artifact":"demo","nodeVersion":false,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ nodeVersion: 'Invalid Node version' })
    })

    it.concurrent('can validate Node version for VueJS Project #2', () => {
        const input =
            '{"language":"ts","description":"test","name":"test","artifact":"demo","includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ nodeVersion: 'Invalid Node version' })
    })

    it.concurrent('can validate language for VueJS Project #1', () => {
        const input =
            '{"language":"tas","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ language: 'Language must be either ts or js' })
    })

    it.concurrent('can validate language for VueJS Project #2', () => {
        const input =
            '{"language":false,"description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ language: 'Language must be either ts or js' })
    })

    it.concurrent('can validate language for VueJS Project #3', () => {
        const input =
            '{"description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ language: 'Language must be either ts or js' })
    })

    it.concurrent('can validate router for VueJS Project #1', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":"false","includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            includeUnitTest: 'Include Router test value must be boolean.'
        })
    })

    it.concurrent('can validate unit test for VueJS Project #2', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeUnitTest":"true","indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            includeUnitTest: 'Include Unit test value must be boolean.'
        })
    })

    it.concurrent('can validate router for VueJS Project #3', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({})
    })

    it.concurrent('can validate Pinia for VueJS Project #1', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":"false","includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            includePinia: 'Include Pinia value must be boolean.'
        })
    })

    it.concurrent('can validate Pinia for VueJS Project #3', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({})
    })

    it.concurrent('can validate Unit test for VueJS Project #1', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":"true","indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            includeUnitTest: 'Include Unit test value must be boolean.'
        })
    })

    it.concurrent('can validate Unit test for VueJS Project #3', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({})
    })

    it.concurrent('can validate Prettier for VueJS Project #1', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":true,"includePrettier":"true"}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            includePrettier: 'Include Prettier value must be boolean.'
        })
    })

    it.concurrent('can validate ESLint for VueJS Project #1', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":"true","includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            includeEslint: 'Include ESLint value must be boolean.'
        })
    })

    it.concurrent('can ESLint usage for Prettier for VueJS project', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":"playwright","includeEslint":false,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({ includePrettier: 'Prettier needs ESLint usage.' })
    })

    it.concurrent('can validate Indent size for VueJS Project #1', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":"2","integrationTest":"playwright","includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            indentSize: 'Include size must be an integer.'
        })
    })

    it.concurrent('can validate Indent size for VueJS Project #2', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"indentSize":2,"includeUnitTest":true,"includeEslint":true,"indentSize":200,"includePrettier":true,"integrationTest":"playwright"}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            indentSize: 'Indent size must be either 2 or 4.'
        })
    })

    it.concurrent('can validate Indent size for VueJS Project #3', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"indentSize":2.345,"includeUnitTest":true,"includeEslint":true,"indentSize":200,"includePrettier":true,"integrationTest":"playwright"}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            indentSize: 'Indent size must be either 2 or 4.'
        })
    })

    it.concurrent('can validate Integration test for VueJS Project #1', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"includeUnitTest":true,"indentSize":2,"integrationTest":true,"includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            integrationTest: 'Include Integration test value must be string.'
        })
    })

    it.concurrent('can validate Integration test for VueJS Project #2', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"integrationTest":"taco", "includePinia":false,"includeRouter":false,"indentSize":2,"includeUnitTest":true,"includeEslint":true,"includePrettier":true}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            integrationTest: 'Include Integration test value must be valid.'
        })
    })

    it.concurrent('can validate Integration test for VueJS Project #4', () => {
        const input =
            '{"language":"js","description":"test","name":"test","artifact":"demo","nodeVersion":20,"includePinia":false,"includeRouter":false,"indentSize":2,"includeUnitTest":true,"includeEslint":true,"includePrettier":true,"integrationTest":"true"}'
        expect(isValid(JSON.parse(input))).toStrictEqual({
            integrationTest: 'Include Integration test value must be valid.'
        })
    })
})
