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
import { javaGitIgnore } from '@/generator/common/gitignore'

const engine = new Liquid({
    jsTruthy: true,
    cache: true
})

const springCloudDependencies = [
    'cloud-starter',
    'cloud-function',
    'cloud-task',
    'spring-cloud-routing',
    'cloud-gateway',
    'spring-cloud-circuit-breaker',
    'cloud-resilience4j',
    'spring-cloud-messaging',
    'cloud-bus',
    'cloud-stream'
]

const supportedDatabases = new Set(['mariadb', 'sqlserver', 'mysql', 'postgresql', 'h2', 'hsql'])

let compilationComplete = false
const parsedTemplates: Map<string, Template[]> = new Map()
function compileTemplates() {
    if (compilationComplete) {
        return
    }

    content.forEach((template: File) => {
        if (template.name !== 'gradle-wrapper.properties') {
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
        content: engine.renderSync(parsedTemplates.get('compose.yaml')!!, {
            dependenciesIds: Array.from(packages)
        }) as unknown as string,
        id: getId()
    } as File
}

function getApplicationCode(metadata: SpringProject): string {
    return engine.renderSync(
        parsedTemplates.get(`application.${metadata.language === Language.Kotlin ? 'kt' : 'java'}`)!!,
        metadata
    ) as unknown as string
}

function getTestApplicationCode(metadata: SpringProject): string {
    return engine.renderSync(
        parsedTemplates.get(`application-test.${metadata.language === Language.Kotlin ? 'kt' : 'java'}`)!!,
        metadata
    ) as unknown as string
}
function getProjectFolders(metadata: SpringProject, context: 'main' | 'test'): Folder {
    const parts = metadata.packageName.split('.').reverse()
    let folder: Folder | null = null

    parts.forEach((part) => {
        if (folder === null) {
            folder = {
                name: part,
                type: ContentType.Folder,
                id: getId(),
                children: [
                    {
                        name: `${metadata.name.charAt(0).toUpperCase()}${metadata.name.slice(1)}Application${
                            context === 'main' ? '' : 'Tests'
                        }.${metadata.language === Language.Java ? 'java' : 'kt'}`,
                        content: context === 'main' ? getApplicationCode(metadata) : getTestApplicationCode(metadata),
                        id: getId(),
                        type: ContentType.File,
                        lang: metadata.language
                    }
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
        children: [folder!!]
    }
}

function getPropertiesFolderContent(packages: Set<string>): Array<File | Folder> {
    const content: Array<File | Folder> = [
        {
            name: 'application.properties',
            type: ContentType.File,
            id: getId(),
            // content: engine.renderSync(parsedTemplates.get('application.properties')!!, {
            //     dependenciesIds: Array.from(packages)
            // }) as unknown as string,
            content: '',
            lang: Language.Text
        },
        {
            name: 'application-prod.properties',
            type: ContentType.File,
            id: getId(),
            // content: engine.renderSync(parsedTemplates.get('application-prod.properties')!!, {
            //     dependenciesIds: Array.from(packages)
            // }) as unknown as string,
            content: '',
            lang: Language.Text
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
    const mainFolder: Folder = getProjectFolders(metadata, 'main')
    const testFolder: Folder = getProjectFolders(metadata, 'test')
    return {
        name: 'src',
        type: ContentType.Folder,
        id: getId(),
        children: [
            {
                name: 'main',
                type: ContentType.Folder,
                id: getId(),
                children: [
                    mainFolder,
                    {
                        name: 'resources',
                        type: ContentType.Folder,
                        id: getId(),
                        children: getPropertiesFolderContent(packages)
                    }
                ] as Array<File | Folder>
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

export function getContent(projectMetaData: { metadata: SpringProject; dependencies: Package[] }): ContentTree {
    compileTemplates()
    const testDependencies: Map<string, Package> = new Map()

    const enabledDependencies = projectMetaData.dependencies.filter((it) => it.supported ?? true)
    const dependenciesIds: Set<string> = new Set<string>(enabledDependencies.map((it) => it.id))

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
        return supportedDatabases.has(pointer.id)
    })

    const [annotationDependencies, dependencies] = partition(g, (pointer: Package) => {
        return pointer.id === 'lombok' || pointer.id === 'configuration-processor'
    })

    dependencies.forEach((dependency) => {
        ;(dependency.testPackages ?? []).forEach((it) => {
            if (!dependenciesIds.has(it.id)) {
                testDependencies.set(it.id, it)
            }
        })
    })

    const payload = {
        metadata: projectMetaData.metadata,
        plugins: plugins,
        dependencies: dependencies,
        runtimeDependencies: runtimeDependencies,
        developmentDependencies: developmentDependencies,
        compileDependencies: compileDependencies,
        dependenciesIds: Array.from(dependenciesIds),
        testDependencies: Array.from(testDependencies.values()),
        haveLombok: dependenciesIds.has('lombok'),
        haveSpringShellDependency: dependenciesIds.has('spring-shell'),
        haveSpringCloudDependency: haveCloudDependencies(dependenciesIds),
        annotationDependencies: annotationDependencies,
        kotlin: Language.Kotlin,
        java: Language.Java,
        kotlinSelected: projectMetaData.metadata.language === Language.Kotlin,
        javaSelected: projectMetaData.metadata.language === Language.Java
    }

    const contentTree: Array<File | Folder> = [
        {
            name: 'build.gradle.kts',
            lang: Language.Kotlin,
            type: ContentType.File,
            content: engine.renderSync(parsedTemplates.get('build.gradle.kts')!!, payload) as unknown as string,
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
                            lang: Language.Kotlin,
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
            content: engine.renderSync(parsedTemplates.get('settings.gradle.kts')!!, {
                artifact: projectMetaData.metadata.artifact
            }) as unknown as string,
            id: getId()
        } as File,
        {
            name: '.gitignore',
            lang: Language.Text,
            type: ContentType.File,
            content: javaGitIgnore,
            id: getId()
        } as File,
        {
            name: 'README.md',
            lang: Language.Markdown,
            type: ContentType.File,
            id: getId(),
            content: engine.renderSync(parsedTemplates.get('readme.md')!!, payload) as unknown as string
        }
    ]

    if (dependenciesIds.has('docker-compose-setup')) {
        contentTree.push(getDockerYaml(dependenciesIds))
    }

    contentTree.push(getSrcFolder(projectMetaData.metadata, dependenciesIds))
    return {
        tree: contentTree
    }
}
