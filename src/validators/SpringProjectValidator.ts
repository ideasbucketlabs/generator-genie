import type { SpringProject } from '@/entity/SpringProject'
import type { SpringProjectError } from '@/entity/SpringProjectError'

export function isValid(springProject: SpringProject): SpringProjectError {
    const error: SpringProjectError = {}

    if ((springProject.group ?? '').trim().length === 0) {
        error.group = 'Group cannot be null or blank and must be all lower case.'
    } else if (!/^(?!\.)(?!.*\.$)(?!.*\.\.)[a-z][a-z0-9_.]+$/.test(springProject.group)) {
        error.group =
            // eslint-disable-next-line vue/max-len
            'Group must not begin or end with `.`, cannot have two consecutive `.`, must begin with alpha character and must be alpha numeric.'
    }

    if ((springProject.name ?? '').trim().length === 0) {
        error.name = 'Name cannot be null or blank and must be at least 2 characters.'
    } else if (!/^[a-zA-Z][a-zA-Z0-9]+$/.test(springProject.name)) {
        error.name = 'Name must be all alpha numeric and must begin with alpha character.'
    }

    if ((springProject.artifact ?? '').trim().length === 0) {
        error.artifact = 'Artifact cannot be null or blank.'
    } else if (!/^[a-zA-Z](?![a-zA-Z\d]*\d$)[a-zA-Z\d]*$/.test(springProject.artifact)) {
        error.artifact = 'Artifact cannot begin and end with number and must be alpha numeric.'
    }

    if ((springProject.description ?? '').trim().length === 0) {
        error.description = 'Description cannot be null or blank.'
    }

    return error
}
