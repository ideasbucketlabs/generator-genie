import type { SpringProject } from '@/entity/SpringProject'
import type { SpringProjectError } from '@/entity/SpringProjectError'
import { SpringBootVersion } from '@/entity/SpringBootVersion'
import { Language } from '@/entity/Language'

export function isValid(springProject: SpringProject): SpringProjectError {
    const error: SpringProjectError = {}

    if (typeof (springProject.group ?? '') !== 'string') {
        error.group = 'Group cannot be null or blank and must be all lower case.'
    } else if ((springProject.group ?? '').trim().length === 0) {
        error.group = 'Group cannot be null or blank and must be all lower case.'
    } else if (!/^(?!\.)(?!.*\.$)(?!.*\.\.)[a-z][a-z0-9_.]+$/.test(springProject.group)) {
        error.group =
             
            'Group must not begin or end with `.`, cannot have two consecutive `.`, must begin with alpha character and must be alpha numeric.'
    }

    if (typeof (springProject.name ?? '') !== 'string') {
        error.name = 'Name cannot be null or blank.'
    } else if ((springProject.name ?? '').trim().length < 2) {
        error.name = 'Name cannot be null or blank and must be at least 2 characters.'
    } else if (!/^[a-zA-Z][a-zA-Z0-9]+$/.test(springProject.name)) {
        error.name = 'Name must be all alpha numeric and must begin with alpha character.'
    }

    if (typeof (springProject.buildTool ?? '') !== 'string') {
        error.buildTool = 'Invalid build tool selection.'
    } else if (!/^(?:gradle|maven)$/.test(springProject.buildTool)) {
        error.buildTool = error.buildTool = 'Invalid build tool selection.'
    }

    if ((springProject.language ?? '') !== Language.Java && (springProject.language ?? '') !== Language.Kotlin) {
        error.language = 'Language should be either Kotlin or Java.'
    }

    const javaVersion = parseInt((springProject.javaVersion ?? 0).toString(), 10)

    if (javaVersion !== 21 && javaVersion !== 17) {
        error.javaVersion = 'Invalid Java version.'
    }

    if (typeof (springProject.artifact ?? '') !== 'string') {
        error.artifact = 'Artifact cannot be null or blank.'
    } else if ((springProject.artifact ?? '').trim().length === 0) {
        error.artifact = 'Artifact cannot be null or blank.'
    } else if (!/^[a-zA-Z].*[a-zA-Z\d]$/.test(springProject.artifact)) {
        error.artifact = 'Artifact must begin with a letter and end with a letter or number.'
    } else if (!/^[a-zA-Z\d._-]+$/.test(springProject.artifact)) {
        error.artifact = 'Artifact must only contain letters, numbers, periods, hyphens, and underscores.'
    }

    if (
        typeof (springProject.description ?? '') !== 'string' ||
        (springProject.description ?? '').trim().length === 0
    ) {
        error.description = 'Description cannot be null or blank.'
    }

    if (
        (springProject.springBootVersion ?? '') !== SpringBootVersion['3_3_4'] &&
        (springProject.springBootVersion ?? '') !== SpringBootVersion['3_2_10']
    ) {
        error.springBootVersion = 'Spring Boot version is invalid.'
    }

    return error
}
