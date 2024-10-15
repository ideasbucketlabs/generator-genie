import type { VueJsProject } from '@/entity/VueJsProject'
import type { VueJsProjectError } from '@/entity/VueJsProjectError'
import { Language } from '@/entity/Language'

export function isValid(vueJsProject: VueJsProject): VueJsProjectError {
    const error: VueJsProjectError = {}
    const nodeVersion = parseInt((vueJsProject.nodeVersion ?? '0').toString(), 10)
    if (nodeVersion !== 17 && nodeVersion !== 20) {
        error.nodeVersion = 'Invalid Node version'
    }

    if (
        (vueJsProject.language ?? '') !== Language.Typescript &&
        (vueJsProject.language ?? '') !== Language.Javascript
    ) {
        error.language = `Language must be either ${Language.Typescript} or ${Language.Javascript}`
    }

    if (typeof (vueJsProject.name ?? '') !== 'string' || (vueJsProject.name ?? '').trim().length === 0) {
        error.name = 'Name cannot be null or blank.'
    } else if (!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(vueJsProject.name)) {
        error.name =
            'Name must comply with `package.json` name attribute. No spaces, uppercase and special characters allowed.'
    }

    if (typeof (vueJsProject.description ?? '') !== 'string' || (vueJsProject.description ?? '').trim().length === 0) {
        error.description = 'Description cannot be null or blank.'
    }

    if (typeof (vueJsProject.includeUnitTest ?? false) !== 'boolean') {
        error.includeUnitTest = 'Include Unit test value must be boolean.'
    }

    if (typeof (vueJsProject.integrationTest ?? '') !== 'string') {
        error.integrationTest = 'Include Integration test value must be string.'
    } else if (!['playwright', 'nightwatch', 'cypress', 'none'].includes(vueJsProject.integrationTest ?? '')) {
        error.integrationTest = 'Include Integration test value must be valid.'
    }

    if (typeof (vueJsProject.includeRouter ?? false) !== 'boolean') {
        error.includeUnitTest = 'Include Router test value must be boolean.'
    }

    if (typeof (vueJsProject.includePinia ?? false) !== 'boolean') {
        error.includePinia = 'Include Pinia value must be boolean.'
    }

    if (typeof (vueJsProject.includeEslint ?? false) !== 'boolean') {
        error.includeEslint = 'Include ESLint value must be boolean.'
    }

    if (typeof (vueJsProject.includePrettier ?? false) !== 'boolean') {
        error.includePrettier = 'Include Prettier value must be boolean.'
    }

    if (typeof (vueJsProject.indentSize ?? 0) !== 'number') {
        error.indentSize = 'Include size must be an integer.'
        return error
    }

    const indentSize = parseInt(vueJsProject.indentSize.toString(), 10)

    if (indentSize !== 2 && indentSize !== 4) {
        error.indentSize = 'Indent size must be either 2 or 4.'
    }

    if (
        !Object.prototype.hasOwnProperty.call(error, 'includeEslint') &&
        !Object.prototype.hasOwnProperty.call(error, 'includePrettier') &&
        !vueJsProject.includeEslint &&
        vueJsProject.includePrettier
    ) {
        error.includePrettier = 'Prettier needs ESLint usage.'
    }

    return error
}
