<script setup lang="ts">
import { computed, defineAsyncComponent, inject, nextTick, ref, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import Logo from '@/icons/Logo.vue'
import Ripple from '@/components/Ripple.vue'
import AppComponentLoader from '@/components/AppComponentLoader.vue'
import type { Package } from '@/entity/Dependency'
import { dependencyStore as dStore } from '@/stores/dependency'
import CloseIcon from '@/icons/CloseIcon.vue'
import SpringProject from '@/components/SpringProject.vue'
import { ProjectType } from '@/entity/ProjectType'
import { SpringBootVersion } from '@/entity/SpringBootVersion'
import type { SpringProject as SpringProjectType } from '@/entity/SpringProject'
import type { VueJsProject as VueJsProjectType } from '@/entity/VueJsProject'
import { clone, zipContentTree } from '@/util/Util'
import type { ContentTree } from '@/entity/ContentTree'
import { Language } from '@/entity/Language'
import VueJsProject from '@/components/VueJsProject.vue'
import GithubIcon from '@/icons/GithubIcon.vue'
import XIcon from '@/icons/XIcon.vue'
import BaseInput from '@/components/BaseInput.vue'

const defaultGroup = import.meta.env.VITE_DEFAULT_GROUP ?? 'com.example'
const dependencyStore = dStore()
const keys = useMagicKeys({
    passive: false,
    onEventFired(e) {
        if (e.ctrlKey && e.key === 'b' && e.type === 'keydown') {
            e.preventDefault()
        }
        if (e.metaKey && e.key === 'b' && e.type === 'keydown') {
            e.preventDefault()
        }
    }
})
const DependenciesDialog = defineAsyncComponent({
    loader: () => import('@/components/DependenciesDialog.vue'),
    loadingComponent: AppComponentLoader,
    delay: 100
})
const Explorer = defineAsyncComponent({
    loader: () => import('@/components/Explorer.vue'),
    loadingComponent: AppComponentLoader,
    delay: 100
})
const contentTree = ref<ContentTree | null>(null)
const generateButtonLabel = ref<string>('Generate')
const isLoading = ref<boolean>(false)
const showExplorer = ref<boolean>(false)
const ctrlB = keys['Ctrl+B']
const metaB = keys['Meta+B']
//const metaEnter = keys['Meta+Enter']
const ctrlSpace = keys['Ctrl+Space']
const ctrlEnter = keys['Ctrl+Enter']
const projectType = ref<ProjectType>(ProjectType.Spring)
const isMac = inject<boolean>('isMac') as boolean
const isMobile = inject<boolean>('isMobile') as boolean
const showDependenciesDialog = ref<boolean>(false)
const selectedPackages = ref<Set<string>>(new Set<string>())
const projectMetadata = ref<
    Map<
        ProjectType,
        | { active: boolean; valid: boolean; metaData: SpringProjectType }
        | { active: boolean; valid: boolean; metaData: VueJsProjectType }
    >
>(new Map<ProjectType, { active: boolean; valid: boolean; metaData: SpringProjectType }>())

const springProject = ref<{ active: boolean; valid: boolean; metaData: SpringProjectType }>({
    active: projectType.value === ProjectType.Spring,
    valid: true,
    metaData: {
        language: Language.Java,
        springBootVersion: SpringBootVersion['3_1_4'] as SpringBootVersion,
        group: defaultGroup,
        name: 'demo',
        artifact: 'demo',
        packageName: 'demo',
        description: 'This application needs some description to be filled out.',
        javaVersion: 17
    }
})

const vueJsProject = ref<{ active: boolean; valid: boolean; metaData: VueJsProjectType }>({
    active: projectType.value === ProjectType.Spring,
    valid: true,
    metaData: {
        language: Language.Typescript,
        name: 'demo',
        artifact: 'demo',
        nodeVersion: 18,
        includeUnitTest: true,
        includePinia: false,
        indentSize: 2,
        description: 'This application needs some description to be filled out.',
        includeRouter: false,
        integrationTest: 'playwright',
        includeEslint: true,
        includePrettier: true
    }
})

projectMetadata.value.set(ProjectType.Spring, springProject.value)
projectMetadata.value.set(ProjectType.VueJS, vueJsProject.value)
const springProjectComponent = ref<InstanceType<typeof SpringProject> | null>(null)
const vueJsProjectComponent = ref<InstanceType<typeof VueJsProject> | null>(null)

const selectedPackageInformation = computed<Package[]>(() => {
    return Array.from(selectedPackages.value).map((packageId: string) => {
        const packageInformation = dependencyStore.packageInformationByProjectType(projectType.value, packageId)
        if (projectType.value !== ProjectType.Spring) {
            return packageInformation
        }
        return {
            name: packageInformation.name,
            id: packageInformation.id,
            groupId: packageInformation.groupId,
            artifactId: packageInformation.artifactId,
            version: packageInformation.version,
            description: packageInformation.description,
            supported: dependencyStore.checkPackageSupportForSpring(
                (projectMetadata.value.get(projectType.value)?.metaData as SpringProjectType)?.springBootVersion ??
                    null,
                packageId
            ),
            plugin: packageInformation.plugin,
            parentName: packageInformation.parentName,
            testPackages: packageInformation.testPackages
        }
    })
})

function haveValidProjectMetaData(): boolean {
    if (projectMetadata.value.has(projectType.value)) {
        return projectMetadata.value.get(projectType.value)?.valid ?? true
    }
    return true
}

watch(
    springProject,
    (v) => {
        projectMetadata.value.set(ProjectType.Spring, v)
    },
    {
        deep: true
    }
)

watch(
    vueJsProject,
    (v) => {
        projectMetadata.value.set(ProjectType.VueJS, v)
    },
    {
        deep: true
    }
)

// watch(metaEnter, (v) => {
//     if (v && isMac && !showDependenciesDialog.value) {
//         console.log('CMD + Enter is pressed.')
//     }
// })

watch(metaB, (v) => {
    if (v) {
        showDependenciesDialog.value = true
    }
})

watch(ctrlEnter, (v) => {
    if (v && !isMac && !showDependenciesDialog.value) {
        console.log('CTRL + Enter is pressed.')
    }
})

watch(ctrlSpace, async (v) => {
    if (v) {
        await onExplore()
    }
})

watch(ctrlB, (v) => {
    if (v && !isMac) {
        showDependenciesDialog.value = true
    }
})

watch(projectType, (newProjectType) => {
    // If Project Type changes we need to clear out the dependencies.
    selectedPackages.value = new Set<string>()
    projectMetadata.value.forEach((project, key) => {
        const clonedProject = clone(project)
        clonedProject.active = false
        projectMetadata.value.set(key, clonedProject)
    })

    if (projectMetadata.value.has(newProjectType)) {
        const project = projectMetadata.value.get(newProjectType)
        if (project) {
            project.active = true
            projectMetadata.value.set(newProjectType, project)
        }
    }
})

async function getProjectContent() {
    if (projectType.value === ProjectType.Spring) {
        const { getContent } = await import('@/generator/spring/SpringProjectGenerator')
        contentTree.value = getContent({
            metadata: projectMetadata.value.get(projectType.value)?.metaData!! as SpringProjectType,
            dependencies: selectedPackageInformation.value
        })
    } else {
        const { getContent } = await import('@/generator/vuejs/VueJsProjectGenerator')
        contentTree.value = getContent({
            metadata: projectMetadata.value.get(projectType.value)?.metaData!! as VueJsProjectType,
            dependencies: selectedPackageInformation.value
        })
    }

    isLoading.value = false
}

function validateSelectedProject() {
    if (projectType.value === ProjectType.Spring && springProjectComponent.value) {
        springProjectComponent.value.validate()
    } else if (projectType.value === ProjectType.VueJS && vueJsProjectComponent.value) {
        vueJsProjectComponent.value.validate()
    }
}
async function onGenerate() {
    validateSelectedProject()
    await nextTick()
    if (projectMetadata.value.has(projectType.value) && haveValidProjectMetaData()) {
        isLoading.value = true
        generateButtonLabel.value = 'Generating'
        nextTick().then(async () => {
            await getProjectContent()
            if (contentTree.value !== null) {
                generateButtonLabel.value = 'Generate'
                await zipContentTree(
                    contentTree.value,
                    projectMetadata.value.get(projectType.value)?.metaData.artifact ?? 'demo'
                )
            }
        })
    }
}

async function onExplore() {
    validateSelectedProject()
    await nextTick()
    if (!haveValidProjectMetaData()) {
        return
    }

    if (projectMetadata.value.has(projectType.value)) {
        isLoading.value = true
        nextTick().then(async () => {
            await getProjectContent()
            showExplorer.value = true
        })
    }
}

function removePackage(packageId: string) {
    selectedPackages.value.delete(packageId)
}
</script>
<template>
    <AppComponentLoader v-if="isLoading"></AppComponentLoader>
    <header class="bg-primary-500 shadow-inner dark:bg-gray-900 flex items-center justify-between" role="banner">
        <a
            href="/"
            class="mx-2 my-3"
            role="navigation"
            aria-label="Generator Genie"
            tabindex="-1"
            title="Generator Genie"
        >
            <Logo class="w-80 fill-current text-white drop-shadow-lg"></Logo>
        </a>
        <div class="flex space-y-3 flex-col items-center justify-center mr-2 md:flex-row md:space-y-0 md:space-x-4">
            <a
                href="https://github.com/ideasbucketlabs/generator-genie"
                target="_blank"
                aria-label="Go to Generator Genie Github page"
                rel="noopener noreferrer"
                tabindex="-1"
                class="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 flex items-center justify-center"
                title="Go to Generator Genie Github page"
            >
                <span class="block h-full w-full"
                    ><GithubIcon
                        class="text-white fill-current w-full h-full hover:scale-105 hover:drop-shadow-xl drop-shadow-lg"
                        aria-label="Go to Generator Genie Github page"
                    ></GithubIcon
                ></span>
            </a>
            <a
                href="https://twitter.com/@myideasbucket"
                target="_blank"
                tabindex="-1"
                rel="noopener noreferrer"
                class="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 flex items-center justify-center"
                aria-label="Go to IdeasBucket Twitter(X) page"
                title="Go to IdeasBucket Twitter(X) page"
            >
                <span class="block h-full w-full"
                    ><XIcon
                        class="text-white fill-current w-full h-full hover:scale-105 hover:drop-shadow-xl drop-shadow-lg"
                        aria-label="Go to IdeasBucket Twitter(X) page"
                    ></XIcon
                ></span>
            </a>
        </div>
    </header>
    <main class="h-10 flex-grow overflow-auto bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-100" role="main">
        <Explorer
            v-if="showExplorer && contentTree !== null"
            :content="contentTree"
            :artifact="projectMetadata.get(projectType)?.metaData.artifact ?? 'demo'"
            @close="showExplorer = false"
        ></Explorer>
        <DependenciesDialog
            v-if="showDependenciesDialog"
            title="Dependencies"
            @close="showDependenciesDialog = false"
            :projectType="projectType"
            v-model="selectedPackages"
            :springVersion="
                projectType === ProjectType.Spring
                    ? (projectMetadata.get(projectType)?.metaData as SpringProjectType)?.springBootVersion ?? ''
                    : ''
            "
        ></DependenciesDialog>
        <div class="xl:flex">
            <div class="overflow-auto xl:flex-1">
                <div class="space-y-4 p-2 xl:flex xl:space-x-10 xl:space-y-0">
                    <div class="">
                        <div class="font-medium">Project Type</div>
                        <div class="flex space-x-4">
                            <BaseInput
                                v-model="projectType"
                                label="Spring Boot"
                                name="project_type"
                                type="radio"
                                :value="ProjectType.Spring"
                            ></BaseInput>
                            <BaseInput
                                v-model="projectType"
                                label="VueJS"
                                name="project_type"
                                type="radio"
                                :value="ProjectType.VueJS"
                            ></BaseInput>
                        </div>
                    </div>
                </div>
                <div class="p-2">
                    <SpringProject
                        v-if="projectType === ProjectType.Spring"
                        ref="springProjectComponent"
                        v-model="springProject"
                    ></SpringProject>
                    <VueJsProject v-else v-model="vueJsProject" ref="vueJsProjectComponent"></VueJsProject>
                </div>
            </div>
            <div class="flex-1 xl:flex xl:flex-col p-2">
                <div class="flex items-center justify-between">
                    <div class="font-medium">Dependencies</div>
                    <button
                        class="relative flex dark:border-gray-950 border-primary-400 items-center overflow-hidden rounded border px-4 py-2 transition duration-200 ease-linear hover:bg-gray-200 hover:shadow-lg dark:text-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700"
                        type="button"
                        @click="showDependenciesDialog = true"
                    >
                        <ripple></ripple>
                        <span class="block">Add dependencies</span>
                        <span v-if="!isMobile && isMac" class="ml-2 block font-extralight">⌘ + b</span>
                        <span v-if="!isMobile && !isMac" class="font-mono ml-2 block font-extralight">Ctrl + b</span>
                    </button>
                </div>
                <hr class="my-2 dark:border-gray-500" />
                <div class="mt-2 italic" v-if="selectedPackages.size === 0">No dependency selected</div>
                <div v-else class="xl:flex xl:flex-col space-y-4 xl:overflow-y-auto">
                    <TransitionGroup
                        name="list"
                        tag="div"
                        enter-active-class="animate__animated fadeIn"
                        leave-active-class="animate__animated fadeOut"
                        class="flex flex-col space-y-4"
                    >
                        <div
                            v-for="p in selectedPackageInformation"
                            :key="'package-' + p.id"
                            class="flex items-center justify-between rounded p-2 shadow"
                            :class="[p.supported ? 'bg-white dark:bg-gray-700' : 'bg-red-100 dark:bg-red-500']"
                        >
                            <div>
                                <div class="space-x-2 font-medium">
                                    <div>
                                        {{ p.name
                                        }}<span
                                            class="ml-2 truncate rounded bg-primary-500 px-2 py-1 text-sm uppercase text-white"
                                            >{{ p.parentName }}</span
                                        >
                                    </div>
                                </div>
                                <div>{{ p.description }}</div>
                                <div class="text-red-500 dark:text-red-900" v-if="!p.supported">
                                    Not supported for selected Spring Boot version
                                </div>
                            </div>
                            <div class="w-6">
                                <button
                                    type="button"
                                    class="flex w-6 items-center rounded-full bg-red-500 hover:shadow-lg dark:bg-red-700"
                                    title="Remove this package"
                                    @click="removePackage(p.id)"
                                >
                                    <span class="block"
                                        ><CloseIcon class="w-full fill-current text-white"></CloseIcon
                                    ></span>
                                </button>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>
            </div>
        </div>
    </main>
    <footer role="contentinfo" class="flex border-primary-50 z-0 relative items-center">
        <div
            class="h-16 flex relative flex-1 z-0 bg-white items-center justify-center space-x-4 border-t dark:border-gray-900 dark:bg-gray-700"
        >
            <button
                v-if="haveValidProjectMetaData()"
                @click="onGenerate"
                type="button"
                class="relative flex items-center overflow-hidden rounded border border-primary-600 bg-primary-500 px-4 py-2 text-white transition duration-200 ease-linear hover:bg-primary-600 hover:shadow-lg"
            >
                <Ripple></Ripple>
                <span class="block">{{ generateButtonLabel }}</span>
                <span class="ml-2 block font-extralight" v-if="!isMobile && isMac">⌘ + ⏎</span>
                <span class="ml-2 block font-extralight" v-if="!isMobile && !isMac">Ctrl + ⏎</span>
            </button>
            <button
                v-else
                type="button"
                class="relative flex cursor-not-allowed items-center overflow-hidden rounded border border-gray-600 bg-gray-500 px-4 py-2 text-white"
            >
                <span class="block">Generate</span>
            </button>
            <button
                v-if="haveValidProjectMetaData()"
                type="button"
                @click="onExplore"
                class="relative flex dark:border-gray-950 border-primary-400 items-center overflow-hidden rounded border px-4 py-2 transition duration-200 ease-linear hover:bg-gray-200 hover:shadow-lg dark:text-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
                <Ripple></Ripple>
                <span>Explore</span>
                <span v-if="!isMobile" class="ml-2 font-extralight">Ctrl + Space</span>
            </button>
            <button
                v-else
                type="button"
                @click="onExplore"
                class="relative flex cursor-not-allowed dark:border-gray-950 border-primary-400 items-center overflow-hidden rounded border px-4 py-2 text-gray-400 dark:text-gray-100"
            >
                <span>Explore</span>
            </button>
        </div>
    </footer>
</template>

<style scoped>
footer::before {
    width: 98%;
    height: 100%;
    top: 2px;
    position: absolute;
    border-radius: 35px;
    box-shadow: 0 -4px 33px -17px rgba(0, 0, 0, 0.29);
    z-index: -1;
    content: '';
}
</style>
