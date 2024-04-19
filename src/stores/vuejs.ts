/* eslint vue/max-len: 0 */
import type { Dependency } from '@/entity/Dependency'

const data: Dependency[] = [
    {
        id: 'styling',
        group: 'CSS Styling',
        packages: [
            {
                name: 'Tailwind CSS support',
                id: 'tailwind',
                description:
                    'A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup. Please note this will install PostCSS as well.',
                groupId: 'tailwindcss',
                version: '^3.4.3',
                testPackages: [
                    {
                        name: 'Tailwind CSS prettier support',
                        id: 'tailwind-prettier-plugin',
                        description: 'Tailwind CSS prettier plugins',
                        groupId: 'prettier-plugin-tailwindcss',
                        version: '^0.5.14'
                    },
                    {
                        name: 'Autoprefixer',
                        id: 'autoprefixer',
                        description: 'Autoprefixer',
                        groupId: 'autoprefixer',
                        version: '^10.4.19'
                    },
                    {
                        name: 'PostCSS',
                        id: 'postcss',
                        description: 'PostCSS',
                        groupId: 'postcss',
                        version: '^8.4.38'
                    }
                ]
            }
        ]
    },
    {
        id: 'utility',
        group: 'Utilities',
        packages: [
            {
                name: 'VueUse',
                id: 'vueuse',
                description:
                    'VueUse is a collection of utility functions based on Composition API. We assume you are already familiar with the basic ideas of Composition API before you continue.',
                groupId: '@vueuse/core',
                version: '^10.9.0'
            },
            {
                name: 'LoDash Order By',
                id: 'lodashorderby',
                description:
                    'Creates an array of elements, sorted as per argument (asc or desc). This method performs a stable sort. If orders is unspecified, all values are sorted in ascending order. Otherwise, specify an order of "desc" for descending or "asc" for ascending sort order of corresponding values.',
                groupId: 'lodash.orderby',
                version: '^4.6.0',
                testPackages: [
                    {
                        name: 'LoDash Order By type definition',
                        id: 'lodash-order-by-type-definition',
                        description: 'LoDash Order By type definition',
                        groupId: '@types/lodash.orderby',
                        version: '^4.6.8'
                    }
                ]
            },
            {
                name: 'LoDash Filter',
                id: 'lodashfilterby',
                description:
                    'Iterates over elements of collection, returning an array of all elements predicate returns truthy for. The predicate is invoked with three arguments: (value, index|key, collection).',
                groupId: 'lodash.filter',
                version: '^4.6.0',
                testPackages: [
                    {
                        name: 'LoDash File type definition',
                        id: 'lodash-filer-type-definition',
                        description: 'LoDash Filter type definition',
                        groupId: '@types/lodash.filter',
                        version: '^4.6.8'
                    }
                ]
            }
        ]
    }
]
export default data
