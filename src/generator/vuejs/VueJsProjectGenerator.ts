import { Liquid, type Template } from 'liquidjs'
import type { ContentTree, Folder } from '@/entity/ContentTree'
import type { VueJsProject } from '@/entity/VueJsProject'
import type { Package } from '@/entity/Dependency'
import type { File } from '@/entity/File'
import { ContentType } from '@/entity/ContentType'
import { getId } from '@/util/Util'
import content from '@/generator/vuejs/template/compiled/content'
import { Language } from '@/entity/Language'
import { jsGitIgnore } from '@/generator/common/gitignore'
import { getEditorConfig } from '@/generator/common/util'
import partition from 'lodash.partition'

const engine = new Liquid({
    jsTruthy: true,
    cache: true,
    greedy: false
})

let compilationComplete = false
const parsedTemplates: Map<string, Template[]> = new Map()

function compileTemplates() {
    if (compilationComplete) {
        return
    }

    content.forEach((template: File) => {
        parsedTemplates.set(template.name, engine.parse(template.content ?? ''))
    })

    compilationComplete = true
}

function getPrettierConfig(indentSize: number, includeTailwindPlugin: boolean): string {
    const payload = {
        ...{
            $schema: 'https://json.schemastore.org/prettierrc',
            semi: false,
            tabWidth: indentSize,
            singleQuote: true,
            printWidth: 100,
            trailingComma: 'none'
        },
        ...(includeTailwindPlugin
            ? {
                  plugins: ['prettier-plugin-tailwindcss']
              }
            : {})
    }

    return JSON.stringify(payload, null, indentSize)
}

function getTsConfigAppJson(indentSize: number): string {
    return JSON.stringify(
        {
            extends: '@vue/tsconfig/tsconfig.dom.json',
            include: ['env.d.ts', 'src/**/*', 'src/**/*.vue'],
            exclude: ['src/**/__tests__/*'],
            compilerOptions: {
                composite: true,
                baseUrl: '.',
                paths: {
                    '@/*': ['./src/*']
                }
            }
        },
        null,
        indentSize
    )
}

function getNightWatchTsConfig(indentSize: number, nodeVersion: number): string {
    return JSON.stringify(
        {
            extends: `@tsconfig/node${nodeVersion}/tsconfig.json`,
            compilerOptions: {
                target: 'ESNext',
                module: 'commonjs',
                composite: true,
                rootDir: '../',
                lib: ['ESNext', 'dom'],
                types: ['nightwatch']
            },
            include: ['../node_modules/@nightwatch/**/*', '../src/components/**/*', '../tests/e2e/**/*'],
            'ts-node': {
                files: true
            },
            files: ['nightwatch.d.ts']
        },
        null,
        indentSize
    )
}

function getTsConfigJson(
    indentSize: number,
    includeUnitTest: boolean,
    integrationTest: 'none' | 'playwright' | 'cypress' | 'nightwatch'
): string {
    const references = [
        {
            path: './tsconfig.node.json'
        },
        {
            path: './tsconfig.app.json'
        }
    ]

    if (includeUnitTest) {
        references.push({
            path: './tsconfig.vitest.json'
        })
    }

    if (integrationTest === 'nightwatch') {
        references.push({
            path: './nightwatch/tsconfig.json'
        })
    }

    return JSON.stringify(
        {
            files: [],
            references: references
        },
        null,
        indentSize
    )
}

function getPackageJson(projectMetaData: VueJsProject, dependencies: Package[], devDependencies: Package[]): string {
    const typescriptSelected = projectMetaData.language === Language.Typescript
    const scripts = {
        ...{
            dev: 'vite',
            preview: 'vite preview'
        },
        ...(typescriptSelected
            ? {
                  'type-check': projectMetaData.includeUnitTest
                      ? 'vue-tsc --noEmit -p tsconfig.vitest.json --composite false'
                      : 'vue-tsc --noEmit -p tsconfig.app.json --composite false',
                  build: 'run-p type-check "build-only {@}" --',
                  'build-only': 'vite build'
              }
            : {
                  build: 'vite build'
              }),
        ...(projectMetaData.includeUnitTest
            ? {
                  'test:unit': 'vitest'
              }
            : {}),
        ...(projectMetaData.includeEslint
            ? {
                  lint: `eslint . --ext .vue,.js,.jsx,.mjs,.cjs${
                      typescriptSelected ? ',.ts,.tsx,.cts,.mts' : ''
                  } --fix --ignore-path .gitignore`
              }
            : {}),
        ...(projectMetaData.includePrettier
            ? {
                  format: 'prettier --write src/'
              }
            : {}),
        ...(projectMetaData.integrationTest === 'playwright'
            ? {
                  'test:e2e': 'playwright test'
              }
            : {}),
        ...(projectMetaData.integrationTest === 'cypress'
            ? {
                  'test:e2e': "start-server-and-test preview http://localhost:4173 'cypress run --e2e'",
                  'test:e2e:dev':
                      "start-server-and-test 'vite dev --port 4173' http://localhost:4173 'cypress open --e2e'"
              }
            : {}),
        ...(projectMetaData.integrationTest === 'nightwatch'
            ? {
                  'test:e2e': 'nightwatch tests/e2e'
              }
            : {})
    }

    const userChosenExplicitDependency: Record<string, string> = {}
    dependencies.forEach((it) => {
        userChosenExplicitDependency[it.groupId ?? ''] = it.version ?? ''
    })

    const userChosenExplicitDevDependency: Record<string, string> = {}
    devDependencies.forEach((it) => {
        userChosenExplicitDevDependency[it.groupId ?? ''] = it.version ?? ''
    })

    const final = {
        name: projectMetaData.name,
        version: '0.0.0',
        private: true,
        type: 'module',
        scripts: scripts,
        dependencies: {
            ...{
                vue: '^3.3.4'
            },
            ...(projectMetaData.includeRouter
                ? {
                      'vue-router': '^4.2.5'
                  }
                : {}),
            ...(projectMetaData.includePinia
                ? {
                      pinia: '^2.1.7'
                  }
                : {}),
            ...userChosenExplicitDependency
        },
        devDependencies: {
            ...{
                '@vitejs/plugin-vue': '^5.0.3',
                vite: '^5.0.10'
            },
            ...(typescriptSelected
                ? {
                      [`@tsconfig/node${projectMetaData.nodeVersion}`]:
                          projectMetaData.nodeVersion === 18 ? '^18.2.2' : '^20.1.2',
                      '@types/node': projectMetaData.nodeVersion === 18 ? '^18.18.7' : '^20.11.10',
                      '@vue/tsconfig': '^0.5.1',
                      'npm-run-all2': '^6.1.1',
                      'vue-tsc': '^1.8.27',
                      typescript: '~5.3.0'
                  }
                : {}),
            ...(projectMetaData.includeEslint
                ? {
                      '@rushstack/eslint-patch': '^1.3.3',
                      eslint: '^8.49.0',
                      'eslint-plugin-vue': '^9.17.1'
                  }
                : {}),
            ...(projectMetaData.includeEslint && typescriptSelected
                ? {
                      '@vue/eslint-config-typescript': '^12.0.0'
                  }
                : {}),
            ...(projectMetaData.includePrettier
                ? {
                      prettier: '^3.0.3',
                      '@vue/eslint-config-prettier': '^8.0.0'
                  }
                : {}),
            ...(projectMetaData.includeUnitTest
                ? {
                      jsdom: '^24.0.0',
                      vitest: '^1.2.2',
                      '@vue/test-utils': '^2.4.4'
                  }
                : {}),
            ...(projectMetaData.includeUnitTest && typescriptSelected
                ? {
                      '@types/jsdom': '^21.1.6'
                  }
                : {}),
            ...(projectMetaData.integrationTest === 'playwright'
                ? {
                      '@playwright/test': '^1.41.1'
                  }
                : {}),
            ...(projectMetaData.integrationTest === 'cypress'
                ? {
                      cypress: '^13.6.3',
                      'start-server-and-test': '^2.0.3'
                  }
                : {}),
            ...(projectMetaData.integrationTest === 'nightwatch'
                ? {
                      '@nightwatch/vue': '^3.1.0',
                      chromedriver: '^121.0.0',
                      geckodriver: '^4.3.1',
                      nightwatch: '^3.4.0',
                      'vite-plugin-nightwatch': '^0.4.6',
                      'ts-node': '^10.9.2'
                  }
                : {}),
            ...(projectMetaData.integrationTest === 'cypress' && projectMetaData.includeEslint
                ? {
                      'eslint-plugin-cypress': '^2.15.1'
                  }
                : {}),
            ...userChosenExplicitDevDependency
        }
    }

    return JSON.stringify(final, null, projectMetaData.indentSize)
}

function getTsConfigNodeJson(metadata: VueJsProject): string {
    return JSON.stringify(
        {
            extends: `@tsconfig/node${metadata.nodeVersion}/tsconfig.json`,
            include: [
                'vite.config.*',
                'vitest.config.*',
                'cypress.config.*',
                'nightwatch.conf.*',
                'playwright.config.*'
            ],
            compilerOptions: {
                composite: true,
                module: 'ESNext',
                moduleResolution: 'Bundler',
                types: ['node']
            }
        },
        null,
        metadata.indentSize
    )
}

function getSrcContent(
    projectMetaData: VueJsProject,
    typescriptSelected: boolean,
    javascriptSelected: boolean,
    dependenciesIds: Set<string>
): Folder {
    const payload = {
        metadata: projectMetaData,
        indentSize: projectMetaData.indentSize,
        typescriptSelected: typescriptSelected,
        javascriptSelected: javascriptSelected,
        dependenciesIds: Array.from(dependenciesIds)
    }
    const assets = {
        name: 'assets',
        type: ContentType.Folder,
        id: getId(),
        children: [
            {
                name: 'main.css',
                type: ContentType.File,
                lang: Language.Css,
                id: getId(),
                content: dependenciesIds.has('tailwind')
                    ? `@tailwind base;
@tailwind components;
@tailwind utilities;`
                    : ''
            }
        ]
    } as Folder

    const components = {
        name: 'components',
        type: ContentType.Folder,
        id: getId(),
        children: [
            {
                name: 'HelloWorld.vue',
                type: ContentType.File,
                id: getId(),
                lang: Language.Vue,
                content: engine.renderSync(parsedTemplates.get('helloworld.vue')!!, payload) as unknown as string
            },
            {
                name: '__tests__',
                type: ContentType.Folder,
                id: getId(),
                children: projectMetaData.includeUnitTest
                    ? [
                          {
                              name: `HelloWorld.spec.${typescriptSelected ? 'ts' : 'js'}`,
                              type: ContentType.File,
                              id: getId(),
                              lang: projectMetaData.language,
                              content: engine.renderSync(
                                  parsedTemplates.get('helloworld.spec.ts')!!,
                                  payload
                              ) as unknown as string
                          }
                      ]
                    : []
            }
        ]
    } as Folder

    const icons = {
        name: 'icons',
        type: ContentType.Folder,
        id: getId(),
        children: []
    } as Folder

    const outputChildren: Array<Folder | File> = [assets, components, icons]

    if (projectMetaData.includePinia) {
        outputChildren.push({
            name: 'stores',
            type: ContentType.Folder,
            id: getId(),
            children: [
                {
                    name: `counter.${typescriptSelected ? 'ts' : 'js'}`,
                    type: ContentType.File,
                    id: getId(),
                    lang: projectMetaData.language,
                    content: engine.renderSync(parsedTemplates.get('store.ts')!!, payload) as unknown as string
                }
            ]
        })
    }

    if (projectMetaData.includeRouter) {
        outputChildren.push(
            {
                name: 'views',
                type: ContentType.Folder,
                id: getId(),
                children: [
                    {
                        name: 'HomeView.vue',
                        type: ContentType.File,
                        id: getId(),
                        lang: Language.Vue,
                        content: engine.renderSync(parsedTemplates.get('home.vue')!!, payload) as unknown as string
                    }
                ]
            },
            {
                name: 'layouts',
                type: ContentType.Folder,
                id: getId(),
                children: [
                    {
                        name: 'MainLayout.vue',
                        type: ContentType.File,
                        id: getId(),
                        lang: Language.Vue,
                        content: engine.renderSync(parsedTemplates.get('layout.vue')!!, payload) as unknown as string
                    }
                ]
            },
            {
                name: 'router',
                type: ContentType.Folder,
                id: getId(),
                children: [
                    {
                        name: `index.${typescriptSelected ? 'ts' : 'js'}`,
                        type: ContentType.File,
                        id: getId(),
                        lang: projectMetaData.language,
                        content: engine.renderSync(parsedTemplates.get('router.ts')!!, payload) as unknown as string
                    }
                ]
            }
        )
    }

    outputChildren.push(
        {
            name: `main.${typescriptSelected ? 'ts' : 'js'}`,
            type: ContentType.File,
            id: getId(),
            lang: projectMetaData.language,
            content: engine.renderSync(parsedTemplates.get('main.ts')!!, payload) as unknown as string
        },
        {
            name: 'App.vue',
            type: ContentType.File,
            id: getId(),
            lang: Language.Vue,
            content: engine.renderSync(parsedTemplates.get('app.vue')!!, payload) as unknown as string
        }
    )

    return {
        name: 'src',
        type: ContentType.Folder,
        id: getId(),
        children: outputChildren
    } as Folder
}
export function getContent(projectMetaData: { metadata: VueJsProject; dependencies: Package[] }): ContentTree {
    compileTemplates()

    const typescriptSelected = projectMetaData.metadata.language === Language.Typescript
    const javascriptSelected = projectMetaData.metadata.language === Language.Javascript

    const enabledDependencies = projectMetaData.dependencies.filter((it) => it.supported ?? true)
    const dependenciesIds: Set<string> = new Set<string>(enabledDependencies.map((it) => it.id))
    const [dependencies, devDependencies] = partition(enabledDependencies, (pointer: Package) => {
        return pointer.id !== 'tailwind'
    })

    enabledDependencies.forEach((it) => {
        const typesPackages = it.testPackages ?? []
        typesPackages.forEach((typePackage) => {
            if (
                it.id === 'tailwind' &&
                projectMetaData.metadata.includePrettier &&
                typePackage.id === 'tailwind-prettier-plugin'
            ) {
                devDependencies.push(typePackage)
            } else if (it.id !== 'tailwind' && typescriptSelected) {
                devDependencies.push(typePackage)
            } else if (it.id === 'tailwind' && typePackage.id !== 'tailwind-prettier-plugin') {
                devDependencies.push(typePackage)
            }
        })
    })

    const payload = {
        metadata: projectMetaData.metadata,
        indentSize: projectMetaData.metadata.indentSize,
        dependenciesIds: Array.from(dependenciesIds),
        typescript: Language.Typescript,
        javascript: Language.Javascript,
        typescriptSelected: typescriptSelected,
        javascriptSelected: javascriptSelected
    }

    const contentTree: Array<File | Folder> = [
        {
            name: 'package.json',
            lang: Language.Json,
            type: ContentType.File,
            content: getPackageJson(projectMetaData.metadata, dependencies, devDependencies),
            id: getId()
        } as File,
        {
            name: '.gitignore',
            lang: Language.Text,
            type: ContentType.File,
            content: jsGitIgnore,
            id: getId()
        } as File,
        {
            name: 'index.html',
            lang: Language.Html,
            type: ContentType.File,
            content: engine.renderSync(parsedTemplates.get('index.html')!!, payload) as unknown as string,
            id: getId()
        } as File,
        getSrcContent(projectMetaData.metadata, typescriptSelected, javascriptSelected, dependenciesIds),
        {
            name: '.editorconfig',
            lang: Language.Text,
            type: ContentType.File,
            id: getId(),
            content: getEditorConfig(projectMetaData.metadata.indentSize, 100)
        },
        {
            name: 'public',
            type: ContentType.Folder,
            id: getId(),
            children: []
        },
        {
            name: 'README.md',
            type: ContentType.File,
            lang: Language.Markdown,
            id: getId(),
            content: engine.renderSync(parsedTemplates.get('readme.md')!!, payload) as unknown as string
        }
    ]

    if (dependenciesIds.has('tailwind')) {
        contentTree.push(
            {
                name: typescriptSelected ? 'tailwind.config.ts' : 'tailwind.config.cjs',
                lang: projectMetaData.metadata.language,
                id: getId(),
                type: ContentType.File,
                content: engine.renderSync(parsedTemplates.get('tailwind.config.ts')!!, payload) as unknown as string
            } as File,
            {
                name: 'postcss.config.cjs',
                lang: Language.Javascript,
                id: getId(),
                type: ContentType.File,
                content: engine.renderSync(parsedTemplates.get('postcss.config.cjs')!!, payload) as unknown as string
            } as File
        )
    }

    if (typescriptSelected) {
        contentTree.push(
            {
                name: 'tsconfig.app.json',
                lang: Language.Json,
                id: getId(),
                type: ContentType.File,
                content: getTsConfigAppJson(projectMetaData.metadata.indentSize)
            } as File,
            {
                name: 'tsconfig.json',
                lang: Language.Json,
                id: getId(),
                type: ContentType.File,
                content: getTsConfigJson(
                    projectMetaData.metadata.indentSize,
                    projectMetaData.metadata.includeUnitTest,
                    projectMetaData.metadata.integrationTest
                )
            },
            {
                name: 'tsconfig.node.json',
                lang: Language.Json,
                id: getId(),
                type: ContentType.File,
                content: getTsConfigNodeJson(projectMetaData.metadata)
            },
            {
                name: 'env.d.ts',
                lang: Language.Typescript,
                id: getId(),
                type: ContentType.File,
                content: '/// <reference types="vite/client" />'
            }
        )
    }

    if (projectMetaData.metadata.includeUnitTest) {
        contentTree.push({
            name: `vitest.config.${typescriptSelected ? 'ts' : 'js'}`,
            lang: projectMetaData.metadata.language,
            id: getId(),
            type: ContentType.File,
            content: engine.renderSync(parsedTemplates.get('vitest.config.js')!!, payload) as unknown as string
        } as File)

        if (typescriptSelected) {
            contentTree.push({
                name: 'tsconfig.vitest.json',
                lang: Language.Json,
                id: getId(),
                type: ContentType.File,
                content: JSON.stringify(
                    {
                        extends: './tsconfig.app.json',
                        exclude: [],
                        compilerOptions: {
                            composite: true,
                            lib: [],
                            types: ['node', 'jsdom']
                        }
                    },
                    null,
                    projectMetaData.metadata.indentSize
                )
            })
        }
    }

    if (projectMetaData.metadata.integrationTest === 'playwright') {
        contentTree.push(
            {
                name: `playwright.config.${typescriptSelected ? 'ts' : 'js'}`,
                lang: projectMetaData.metadata.language,
                id: getId(),
                type: ContentType.File,
                content: engine.renderSync(parsedTemplates.get('playwright.config.js')!!, payload) as unknown as string
            } as File,
            {
                name: 'e2e',
                id: getId(),
                type: ContentType.Folder,
                children: [
                    ...[
                        {
                            name: `vue.spec.${typescriptSelected ? 'ts' : 'js'}`,
                            lang: projectMetaData.metadata.language,
                            id: getId(),
                            type: ContentType.File,
                            content: engine.renderSync(
                                parsedTemplates.get('playwright.e2e.js')!!,
                                payload
                            ) as unknown as string
                        } as File
                    ],
                    ...(typescriptSelected
                        ? [
                              {
                                  name: 'tsconfig.json',
                                  lang: Language.Json,
                                  id: getId(),
                                  type: ContentType.File,
                                  content: JSON.stringify(
                                      {
                                          // eslint-disable-next-line vue/max-len
                                          extends: `@tsconfig/node${projectMetaData.metadata.nodeVersion}/tsconfig.json`,
                                          include: ['./**/*']
                                      },
                                      null,
                                      projectMetaData.metadata.indentSize
                                  )
                              } as File
                          ]
                        : [])
                ]
            } as Folder
        )
    }

    if (projectMetaData.metadata.integrationTest === 'cypress') {
        contentTree.push(
            {
                name: `cypress.config.${typescriptSelected ? 'ts' : 'js'}`,
                lang: projectMetaData.metadata.language,
                id: getId(),
                type: ContentType.File,
                content: engine.renderSync(parsedTemplates.get('cypress.config.js')!!, payload) as unknown as string
            } as File,
            {
                name: 'cypress',
                id: getId(),
                type: ContentType.Folder,
                children: [
                    {
                        name: 'e2e',
                        id: getId(),
                        type: ContentType.Folder,
                        children: [
                            ...[
                                {
                                    name: `example.cy.${typescriptSelected ? 'ts' : 'js'}`,
                                    lang: projectMetaData.metadata.language,
                                    type: ContentType.File,
                                    id: getId(),
                                    content: engine.renderSync(
                                        parsedTemplates.get('example.cy.ts')!!,
                                        payload
                                    ) as unknown as string
                                }
                            ],
                            ...(typescriptSelected
                                ? [
                                      {
                                          name: 'tsconfig.json',
                                          lang: Language.Json,
                                          id: getId(),
                                          type: ContentType.File,
                                          content: JSON.stringify(
                                              {
                                                  extends: '@vue/tsconfig/tsconfig.dom.json',
                                                  include: ['./**/*', '../support/**/*'],
                                                  compilerOptions: {
                                                      isolatedModules: false,
                                                      target: 'es5',
                                                      lib: ['es5', 'dom'],
                                                      types: ['cypress']
                                                  }
                                              },
                                              null,
                                              projectMetaData.metadata.indentSize
                                          )
                                      } as File
                                  ]
                                : [
                                      {
                                          name: 'jsconfig.json',
                                          lang: Language.Json,
                                          id: getId(),
                                          type: ContentType.File,
                                          content: JSON.stringify(
                                              {
                                                  compilerOptions: {
                                                      target: 'es5',
                                                      lib: ['es5', 'dom'],
                                                      types: ['cypress']
                                                  },
                                                  include: ['./**/*', '../support/**/*']
                                              },
                                              null,
                                              projectMetaData.metadata.indentSize
                                          )
                                      } as File
                                  ])
                        ]
                    },
                    {
                        name: 'fixtures',
                        id: getId(),
                        type: ContentType.Folder,
                        children: [
                            {
                                name: 'example.json',
                                id: getId(),
                                type: ContentType.File,
                                lang: Language.Json,
                                content: JSON.stringify(
                                    {
                                        name: 'Using fixtures to represent data',
                                        email: 'hello@cypress.io',
                                        body: 'Fixtures are a great way to mock data for responses to routes'
                                    },
                                    null,
                                    projectMetaData.metadata.indentSize
                                )
                            }
                        ]
                    },
                    {
                        name: 'support',
                        id: getId(),
                        type: ContentType.Folder,
                        children: [
                            {
                                name: `e2e.${typescriptSelected ? 'ts' : 'js'}`,
                                id: getId(),
                                type: ContentType.File,
                                lang: projectMetaData.metadata.language,
                                content: engine.renderSync(
                                    parsedTemplates.get('cypresse2e.js')!!,
                                    payload
                                ) as unknown as string
                            },
                            {
                                name: `commands.${typescriptSelected ? 'ts' : 'js'}`,
                                id: getId(),
                                type: ContentType.File,
                                lang: projectMetaData.metadata.language,
                                content: engine.renderSync(
                                    parsedTemplates.get('cypress.command.js')!!,
                                    payload
                                ) as unknown as string
                            }
                        ]
                    }
                ]
            } as Folder
        )
    }

    if (projectMetaData.metadata.integrationTest === 'nightwatch') {
        contentTree.push(
            {
                name: 'nightwatch.conf.cjs',
                lang: Language.Javascript,
                id: getId(),
                type: ContentType.File,
                content: engine.renderSync(parsedTemplates.get('nightwatch.conf.js')!!, payload) as unknown as string
            } as File,
            {
                name: 'tests',
                type: ContentType.Folder,
                id: getId(),
                children: [
                    {
                        name: 'e2e',
                        type: ContentType.Folder,
                        id: getId(),
                        children: [
                            {
                                name: `example.${typescriptSelected ? 'ts' : 'js'}`,
                                type: ContentType.File,
                                lang: projectMetaData.metadata.language,
                                id: getId(),
                                content: engine.renderSync(
                                    parsedTemplates.get('nightwatch.example.ts')!!,
                                    payload
                                ) as unknown as string
                            }
                        ]
                    }
                ]
            },
            {
                name: 'nightwatch',
                id: getId(),
                type: ContentType.Folder,
                children: [
                    ...[],
                    ...(typescriptSelected
                        ? [
                              {
                                  name: 'nightwatch.d.ts',
                                  lang: projectMetaData.metadata.language,
                                  type: ContentType.File,
                                  id: getId(),
                                  content: engine.renderSync(
                                      parsedTemplates.get('nightwatch.d.ts')!!,
                                      payload
                                  ) as unknown as string
                              },
                              {
                                  name: 'tsconfig.json',
                                  lang: Language.Json,
                                  type: ContentType.File,
                                  id: getId(),
                                  content: getNightWatchTsConfig(
                                      projectMetaData.metadata.indentSize,
                                      projectMetaData.metadata.nodeVersion
                                  )
                              }
                          ]
                        : [])
                ]
            } as Folder
        )
    }

    if (projectMetaData.metadata.includeEslint) {
        contentTree.push({
            name: '.eslintrc.cjs',
            lang: Language.Javascript,
            id: getId(),
            type: ContentType.File,
            content: engine.renderSync(parsedTemplates.get('eslintrc.cjs')!!, payload) as unknown as string
        } as File)
    }

    if (projectMetaData.metadata.includePrettier) {
        contentTree.push({
            name: '.prettierrc.json',
            lang: Language.Json,
            id: getId(),
            type: ContentType.File,
            content: getPrettierConfig(projectMetaData.metadata.indentSize, dependenciesIds.has('tailwind'))
        } as File)
    }

    contentTree.push({
        name: `vite.config.${typescriptSelected ? 'ts' : 'js'}`,
        lang: projectMetaData.metadata.language,
        id: getId(),
        type: ContentType.File,
        content: engine.renderSync(parsedTemplates.get('vite.config.ts')!!, payload) as unknown as string
    } as File)

    return {
        tree: contentTree
    }
}
