import { Liquid, type Template } from 'liquidjs'
import type { ContentTree, Folder } from '@/entity/ContentTree'
import type { SpringProject } from '@/entity/SpringProject'
import type { Package } from '@/entity/Dependency'
import type { File } from '@/entity/File'
import { ContentType } from '@/entity/ContentType'
import { getId } from '@/util/Util'
import partition from 'lodash.partition'
import content from '@/generator/spring/template/compiled/content'
import { Language } from '@/entity/Language'
import { gradleGitIgnore, mavenGitIgnore } from '@/generator/common/gitignore'
import { SpringBootVersion } from '@/entity/SpringBootVersion'
import { sortContentTreeItems } from '@/generator/common/util'

const engine = new Liquid({
    jsTruthy: true,
    cache: true,
    greedy: false
})

const springCloudDependencies = [
    'cloud-starter',
    'cloud-function',
    'cloud-task',
    'spring-cloud-routing',
    'cloud-gateway',
    'reactive-cloud-gateway',
    'spring-cloud-circuit-breaker',
    'cloud-resilience4j',
    'spring-cloud-messaging',
    'cloud-bus',
    'resilience-4j',
    'cloud-stream',
    'cloud-load-balancer'
]

const supportedDatabases = new Set(['mariadb', 'sqlserver', 'mysql', 'postgresql', 'h2', 'hsql'])
const runtimeEntries = new Set(['prometheus', 'influx', 'graphite', 'newrelic'])

let compilationComplete = false
const parsedTemplates: Map<string, Template[]> = new Map()
function compileTemplates() {
    if (compilationComplete) {
        return
    }

    content.forEach((template: File) => {
        if (template.name !== 'gradle-wrapper.properties' && template.name !== 'maven-wrapper.properties') {
            parsedTemplates.set(template.name, engine.parse(template.content ?? ''))
        }
    })

    compilationComplete = true
}

function haveCloudDependencies(inputs: Set<string>): boolean {
    let keySize = springCloudDependencies.length

    while (keySize--) {
        if (inputs.has(springCloudDependencies[keySize])) {
            return true
        }
    }

    return false
}

function getDockerYaml(packages: Set<string>): File {
    return {
        name: 'compose.yaml',
        lang: Language.Yaml,
        type: ContentType.File,
        content: engine.renderSync(parsedTemplates.get('compose.yaml')!, {
            dependenciesIds: Array.from(packages)
        }) as unknown as string,
        id: getId()
    } as File
}

function getApplicationCode(metadata: SpringProject): string {
    return engine.renderSync(
        parsedTemplates.get(`application.${metadata.language === Language.Kotlin ? 'kt' : 'java'}`)!,
        metadata
    ) as unknown as string
}

function getTestApplicationCode(metadata: SpringProject): string {
    return engine.renderSync(
        parsedTemplates.get(`application-test.${metadata.language === Language.Kotlin ? 'kt' : 'java'}`)!,
        metadata
    ) as unknown as string
}
function getProjectFolders(metadata: SpringProject, context: 'main' | 'test', dependenciesIds: Set<string>): Folder {
    const parts = metadata.packageName.split('.').reverse()
    let folder: Folder | null = null
    parts.forEach((part) => {
        if (folder === null) {
            folder = {
                name: part,
                type: ContentType.Folder,
                id: getId(),
                children: [
                    ...[
                        {
                            name: `${metadata.name}Application${context === 'main' ? '' : 'Tests'}.${
                                metadata.language === Language.Java ? 'java' : 'kt'
                            }`,
                            content:
                                context === 'main' ? getApplicationCode(metadata) : getTestApplicationCode(metadata),
                            id: getId(),
                            type: ContentType.File,
                            lang: metadata.language
                        }
                    ],
                    ...(context === 'test' && dependenciesIds.has('testcontainers')
                        ? [
                              {
                                  id: getId(),
                                  name: `Test${metadata.name}Application.${
                                      metadata.language === Language.Java ? 'java' : 'kt'
                                  }`,
                                  content: engine.renderSync(
                                      parsedTemplates.get(
                                          `test-container-application.${
                                              metadata.language === Language.Kotlin ? 'kt' : 'java'
                                          }`
                                      )!,
                                      metadata
                                  ) as unknown as string,
                                  type: ContentType.File,
                                  lang: metadata.language
                              } as File
                          ]
                        : [])
                ]
            }
        } else {
            folder = {
                name: part,
                id: getId(),
                type: ContentType.Folder,
                children: [folder]
            }
        }
    })

    return {
        name: metadata.language === Language.Kotlin ? 'kotlin' : 'java',
        id: getId(),
        type: ContentType.Folder,
        children: [folder!]
    }
}

function getPropertiesFolderContent(packages: Set<string>, metadata: SpringProject): Array<File | Folder> {
    const content: Array<File | Folder> = [
        {
            name: 'application.properties',
            type: ContentType.File,
            id: getId(),
            content: engine.renderSync(parsedTemplates.get('application.properties')!, {
                dependenciesIds: Array.from(packages),
                metadata
            }) as unknown as string,
            lang: Language.Properties
        },
        {
            name: 'application-prod.properties',
            type: ContentType.File,
            id: getId(),
            // content: engine.renderSync(parsedTemplates.get('application-prod.properties')!, {
            //     dependenciesIds: Array.from(packages)
            // }) as unknown as string,
            content: '',
            lang: Language.Properties
        }
    ]

    if (packages.has('thymeleaf')) {
        content.push(
            {
                name: 'static',
                type: ContentType.Folder,
                id: getId()
            },
            {
                name: 'templates',
                type: ContentType.Folder,
                id: getId()
            }
        )
    }

    if (packages.has('graphql-code-generation')) {
        content.push({
            name: 'graphql-client',
            id: getId(),
            type: ContentType.Folder
        })
    }

    if (packages.has('liquibase') || packages.has('flyway')) {
        const children = []

        if (packages.has('liquibase')) {
            children.push({
                name: 'changelog',
                id: getId(),
                type: ContentType.Folder
            })
        }

        if (packages.has('flyway')) {
            children.push({
                name: 'migration',
                id: getId(),
                type: ContentType.Folder
            })
        }

        content.push({
            name: 'db',
            id: getId(),
            type: ContentType.Folder,
            children: children
        })
    }

    return content
}
function getSrcFolder(metadata: SpringProject, packages: Set<string>): Folder | File {
    const mainFolder: Folder = getProjectFolders(
        {
            ...metadata,
            ...{
                name: metadata.name.charAt(0).toUpperCase() + metadata.name.slice(1)
            }
        },
        'main',
        packages
    )
    const testFolder: Folder = getProjectFolders(
        {
            ...metadata,
            ...{
                name: metadata.name.charAt(0).toUpperCase() + metadata.name.slice(1)
            }
        },
        'test',
        packages
    )

    const children: Array<File | Folder> = [
        mainFolder,
        {
            name: 'resources',
            type: ContentType.Folder,
            id: getId(),
            children: getPropertiesFolderContent(packages, metadata)
        }
    ]

    if (packages.has('jte')) {
        children.push({
            name: 'jte',
            id: getId(),
            type: ContentType.Folder
        })
    }

    return {
        name: 'src',
        type: ContentType.Folder,
        id: getId(),
        children: [
            {
                name: 'main',
                type: ContentType.Folder,
                id: getId(),
                children: children
            },
            {
                name: 'test',
                type: ContentType.Folder,
                id: getId(),
                children: [testFolder] as Array<File | Folder>
            }
        ]
    }
}

function generateMavenStub(
    projectMetaData: { metadata: SpringProject; dependencies: Package[] },
    payload: unknown
): Array<File | Folder> {
    return [
        {
            name: 'pom.xml',
            lang: Language.Xml,
            type: ContentType.File,
            content: engine.renderSync(parsedTemplates.get('pom.xml')!, payload as object) as unknown as string,
            id: getId()
        } as File,
        {
            name: '.gitignore',
            lang: Language.Text,
            type: ContentType.File,
            content: mavenGitIgnore,
            id: getId()
        } as File,
        {
            name: 'README.md',
            lang: Language.Markdown,
            type: ContentType.File,
            id: getId(),
            content: engine.renderSync(parsedTemplates.get('readme.md')!, payload as object) as unknown as string
        },
        {
            name: 'mvnw',
            lang: Language.Binary,
            type: ContentType.File,
            id: getId()
        },
        {
            name: 'mvnw.cmd',
            lang: Language.Binary,
            type: ContentType.File,
            id: getId()
        },
        {
            name: '.mvn',
            type: ContentType.Folder,
            id: getId(),
            children: [
                {
                    name: 'wrapper',
                    type: ContentType.Folder,
                    id: getId(),
                    children: [
                        {
                            name: 'maven-wrapper.properties',
                            lang: Language.Properties,
                            type: ContentType.File,
                            content: content.get('maven-wrapper.properties')?.content ?? '',
                            id: getId()
                        } as File
                    ]
                }
            ]
        }
    ]
}
function generateGradleStub(
    projectMetaData: { metadata: SpringProject; dependencies: Package[] },
    payload: unknown
): Array<File | Folder> {
    return [
        {
            name: 'build.gradle.kts',
            lang: Language.Kotlin,
            type: ContentType.File,
            content: engine.renderSync(
                parsedTemplates.get('build.gradle.kts')!,
                payload as object
            ) as unknown as string,
            id: getId()
        } as File,
        {
            name: 'gradle',
            type: ContentType.Folder,
            id: getId(),
            children: [
                {
                    name: 'wrapper',
                    type: ContentType.Folder,
                    id: getId(),
                    children: [
                        {
                            name: 'gradle-wrapper.jar',
                            lang: Language.Binary,
                            content: null,
                            id: getId(),
                            type: ContentType.File
                        } as File,
                        {
                            name: 'gradle-wrapper.properties',
                            lang: Language.Properties,
                            type: ContentType.File,
                            content: content.get('gradle-wrapper.properties')?.content ?? '',
                            id: getId()
                        } as File
                    ]
                }
            ]
        },
        {
            name: 'gradlew',
            lang: Language.Binary,
            type: ContentType.File,
            content: null,
            id: getId()
        } as File,
        {
            name: 'gradlew.bat',
            lang: Language.Binary,
            type: ContentType.File,
            content: null,
            id: getId()
        } as File,
        {
            name: 'settings.gradle.kts',
            lang: Language.Kotlin,
            type: ContentType.File,
            content: engine.renderSync(parsedTemplates.get('settings.gradle.kts')!, {
                artifact: projectMetaData.metadata.artifact
            }) as unknown as string,
            id: getId()
        } as File,
        {
            name: '.gitignore',
            lang: Language.Text,
            type: ContentType.File,
            content: gradleGitIgnore,
            id: getId()
        } as File,
        {
            name: 'README.md',
            lang: Language.Markdown,
            type: ContentType.File,
            id: getId(),
            content: engine.renderSync(parsedTemplates.get('readme.md')!, payload as object) as unknown as string
        }
    ]
}

export function getContent(projectMetaData: { metadata: SpringProject; dependencies: Package[] }): ContentTree {
    compileTemplates()
    const testDependenciesIds: Set<string> = new Set()

    const enabledDependencies = projectMetaData.dependencies.filter((it) => it.supported ?? true)
    const dependenciesIds: Set<string> = new Set<string>(enabledDependencies.map((it) => it.id))
    let haveAIDependencies = false
    for (const dependency of projectMetaData.dependencies) {
        if (
            dependency.parentName?.toLowerCase() === 'ai' &&
            dependency.supported &&
            dependency.id !== 'timefold-solver'
        ) {
            haveAIDependencies = true
            break
        }
    }
    const springAIVersion = '1.0.0-M3'
    const timefoldVersion = '1.15.0'
    const vaadinVersion: string = '24.4.13'
    const netflixDgsVersion: string =
        projectMetaData.metadata.springBootVersion === SpringBootVersion['3_3_5'] ? '9.1.2' : '8.7.1'
    const hillaVersion: string = '2.5.5'
    const springModulithVersion: string = '1.2.4'

    const [plugins, d] = partition(enabledDependencies, (pointer: Package) => {
        return pointer.plugin ?? false
    })

    const [developmentDependencies, e] = partition(d, (pointer: Package) => {
        return pointer.id === 'docker-compose-setup' || pointer.id === 'devtools'
    })

    const [compileDependencies, f] = partition(e, (pointer: Package) => {
        return pointer.id === 'pebble'
    })

    const [runtimeDependencies, g] = partition(f, (pointer: Package) => {
        return supportedDatabases.has(pointer.id) || runtimeEntries.has(pointer.id)
    })

    const [annotationDependencies, h] = partition(g, (pointer: Package) => {
        return pointer.id === 'lombok' || pointer.id === 'configuration-processor'
    })

    const [testDependencies, dependencies] = partition(h, (pointer: Package) => {
        return pointer.id === 'embedded-ldap' || pointer.id === 'testcontainers'
    })

    testDependencies.forEach((it) => {
        testDependenciesIds.add(it.id)
    })

    dependencies.forEach((dependency) => {
        ;(dependency.testPackages ?? []).forEach((it) => {
            // This is one of the edge case in case of GraphQL, Spring Webflux is needed as testDependency if not
            // present in dependency so this check solves that use case.
            if (!dependenciesIds.has(it.id) && !testDependenciesIds.has(it.id)) {
                testDependencies.push(it)
                testDependenciesIds.add(it.id)
            }
        })
    })

    testDependencies.forEach((dependency) => {
        ;(dependency.testPackages ?? []).forEach((it) => {
            // This is one of the edge case in case of GraphQL, Spring Webflux is needed as testDependency if not
            // present in dependency so this check solves that use case.
            if (!dependenciesIds.has(it.id) && !testDependenciesIds.has(it.id)) {
                testDependencies.push(it)
                testDependenciesIds.add(it.id)
            }
        })
    })

    const includeActuatorExplicitly =
        !dependenciesIds.has('actuator') &&
        (dependenciesIds.has('zipkin') ||
            dependenciesIds.has('newrelic') ||
            dependenciesIds.has('graphite') ||
            dependenciesIds.has('distributed-tracing') ||
            dependenciesIds.has('wavefront'))

    const jteVersion = dependencies.find((it) => it.id === 'jte')?.version ?? null
    const payload = {
        metadata: projectMetaData.metadata,
        plugins: plugins,
        dependencies: dependencies,
        runtimeDependencies: runtimeDependencies,
        includeActuatorExplicitly: includeActuatorExplicitly,
        developmentDependencies: developmentDependencies,
        compileDependencies: compileDependencies,
        dependenciesIds: Array.from(dependenciesIds),
        testDependencies: Array.from(testDependencies.values()),
        haveLombok: dependenciesIds.has('lombok'),
        haveSpringShellDependency: dependenciesIds.has('spring-shell'),
        haveTimeFoldSolverDependency: dependenciesIds.has('timefold-solver'),
        timefoldVersion: timefoldVersion,
        springModulithVersion,
        vaadinVersion: vaadinVersion,
        netflixDgsVersion: netflixDgsVersion,
        hillaVersion: hillaVersion,
        haveSpringCloudDependency: haveCloudDependencies(dependenciesIds),
        annotationDependencies: annotationDependencies,
        buildTool: projectMetaData.metadata.buildTool,
        kotlin: Language.Kotlin,
        haveAIDependencies: haveAIDependencies,
        springAIVersion: springAIVersion,
        jteVersion,
        java: Language.Java,
        ormVersion:
            projectMetaData.metadata.springBootVersion === SpringBootVersion['3_3_5']
                ? '"6.5.3.Final"'
                : '"6.4.10.Final"',
        kotlinSelected: projectMetaData.metadata.language === Language.Kotlin,
        javaSelected: projectMetaData.metadata.language === Language.Java,
        springCloudVersion:
            projectMetaData.metadata.springBootVersion === SpringBootVersion['3_3_5'] ? '2023.0.3' : '2023.0.3',
        springShellVersion:
            projectMetaData.metadata.springBootVersion === SpringBootVersion['3_3_5'] ? '3.3.3' : '3.2.8',
        jdkSourceCompatibility: projectMetaData.metadata.javaVersion,
        kotlinPlugin: '1.9.25'
    }

    const contentTree: Array<File | Folder> =
        projectMetaData.metadata.buildTool === 'gradle'
            ? generateGradleStub(projectMetaData, payload)
            : generateMavenStub(projectMetaData, payload)

    if (dependenciesIds.has('docker-compose-setup')) {
        contentTree.push(getDockerYaml(dependenciesIds))
    }

    contentTree.push(getSrcFolder(projectMetaData.metadata, dependenciesIds))

    return {
        tree: sortContentTreeItems(contentTree)
    }
}
