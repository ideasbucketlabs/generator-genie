<script setup lang="ts">
import { computed, defineAsyncComponent, inject, nextTick, onMounted, ref, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import AppComponentLoader from '@/components/AppComponentLoader.vue'
import type { Package } from '@/entity/Dependency'
import { dependencyStore as dStore } from '@/stores/dependency'
import CloseIcon from '@/icons/CloseIcon.vue'
import SpringProject from '@/components/SpringProject.vue'
import { ProjectType } from '@/entity/ProjectType'
import { SpringBootVersion } from '@/entity/SpringBootVersion'
import type { SpringProject as SpringProjectType } from '@/entity/SpringProject'
import type { VueJsProject as VueJsProjectType } from '@/entity/VueJsProject'
import { clone, extractDataFromParameters, getId, zipContentTree } from '@/util/Util'
import type { ContentTree } from '@/entity/ContentTree'
import { Language } from '@/entity/Language'
import VueJsProject from '@/components/VueJsProject.vue'
import GithubIcon from '@/icons/GithubIcon.vue'
import XIcon from '@/icons/XIcon.vue'
import BaseInput from '@/components/BaseInput.vue'
import ShareIcon from '@/icons/ShareIcon.vue'
import BaseButton from '@/components/BaseButton.vue'
import Logo from '@/icons/Logo.vue'

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
const renderKey = ref<string>(getId())
const DependenciesDialog = defineAsyncComponent({
    loader: () => import('@/components/DependenciesDialog.vue'),
    loadingComponent: AppComponentLoader,
    delay: 50
})
const Explorer = defineAsyncComponent({
    loader: () => import('@/components/Explorer.vue'),
    loadingComponent: AppComponentLoader,
    delay: 50
})
const ShareDialog = defineAsyncComponent({
    loader: () => import('@/components/ShareDialog.vue'),
    loadingComponent: AppComponentLoader,
    delay: 50
})

const contentTree = ref<ContentTree | null>(null)
const generateButtonLabel = ref<string>('Generate')
const isLoading = ref<boolean>(false)
const showExplorer = ref<boolean>(false)
const showShareDialog = ref<boolean>(false)
const ctrlB = keys['Ctrl+B']
const metaB = keys['Meta+B']
const metaEnter = keys['Meta+Enter']
const ctrlSpace = keys['Ctrl+Space']
const ctrlEnter = keys['Ctrl+Enter']
const projectType = ref<ProjectType>(ProjectType.Spring)
const isMac = inject<boolean>('isMac') as boolean
const isMobile = inject<boolean>('isMobile') as boolean
const showDependenciesDialog = ref<boolean>(false)
const selectedPackagesPerProject = ref<Map<string, Set<string>>>(new Map())
const addDependencyButton = ref<InstanceType<typeof BaseButton> | null>(null)
const focusTrapInputElement = ref<HTMLInputElement | null>(null)
const exploreButton = ref<InstanceType<typeof BaseButton> | null>(null)
const shareButton = ref<InstanceType<typeof BaseButton> | null>(null)
const generateButton = ref<InstanceType<typeof BaseButton> | null>(null)
//const selectedPackages = ref<Set<string>>(new Set<string>())
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
        springBootVersion: SpringBootVersion['3_2_2'] as SpringBootVersion,
        group: defaultGroup,
        name: 'demo',
        artifact: 'demo',
        packageName: 'demo',
        buildTool: 'gradle',
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
        nodeVersion: 20,
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
const selectedPackages = computed<Set<string>>({
    // getter
    get() {
        if (selectedPackagesPerProject.value.has(projectType.value)) {
            return selectedPackagesPerProject.value.get(projectType.value) as Set<string>
        }
        return new Set()
    },
    // setter
    set(newValue) {
        selectedPackagesPerProject.value.set(projectType.value, newValue)
    }
})

const selectedPackageInformation = computed<Package[]>(() => {
    return Array.from(selectedPackages.value)
        .map((packageId: string) => {
            try {
                const packageInformation =
                    projectType.value === ProjectType.Spring
                        ? dependencyStore.packageInformationByProjectTypeAndVersion(
                              projectType.value,
                              packageId,
                              springProject.value.metaData.springBootVersion
                          )
                        : dependencyStore.packageInformationByProjectType(projectType.value, packageId)

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
                        (projectMetadata.value.get(projectType.value)?.metaData as SpringProjectType)
                            ?.springBootVersion ?? null,
                        packageId
                    ),
                    plugin: packageInformation.plugin,
                    parentName: packageInformation.parentName,
                    testPackages: packageInformation.testPackages
                }
            } catch (error) {
                return null
            }
        })
        .filter((it) => it !== null) as Array<Package>
})

const isAnyDialogShown = computed<boolean>(() => {
    return showShareDialog.value || showExplorer.value || showDependenciesDialog.value
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

watch(metaEnter, async (v) => {
    if (v && isMac && !showDependenciesDialog.value && !showShareDialog.value) {
        await onGenerate()
    }
})

watch(metaB, (v) => {
    if (v && !isAnyDialogShown.value) {
        displayDependencyDialog()
    }
})

watch(ctrlEnter, async (v) => {
    if (v && !isMac && !showDependenciesDialog.value && !showShareDialog.value) {
        await onGenerate()
    }
})

watch(ctrlSpace, async (v) => {
    if (v && !isAnyDialogShown.value) {
        await onExplore()
    }
})

watch(ctrlB, (v) => {
    if (v && !isMac && !isAnyDialogShown.value) {
        displayDependencyDialog()
    }
})

watch(projectType, (newProjectType) => {
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
    addDependencyButton.value?.blur()
    shareButton.value?.blur()
    exploreButton.value?.blur()

    validateSelectedProject()
    await nextTick()
    if (projectMetadata.value.has(projectType.value) && haveValidProjectMetaData()) {
        isLoading.value = true
        generateButtonLabel.value = 'Generating'
        await nextTick()
        await getProjectContent()
        if (contentTree.value !== null) {
            generateButtonLabel.value = 'Generate'
            await zipContentTree(
                contentTree.value,
                projectMetadata.value.get(projectType.value)?.metaData.artifact ?? 'demo'
            )
        }
    }
}

async function onShare() {
    validateSelectedProject()
    await nextTick()
    if (!haveValidProjectMetaData()) {
        return
    }
    showShareDialog.value = true
}
async function onExplore() {
    addDependencyButton.value?.blur()
    shareButton.value?.blur()
    generateButton.value?.blur()
    validateSelectedProject()
    await nextTick()
    if (!haveValidProjectMetaData()) {
        return
    }

    if (projectMetadata.value.has(projectType.value)) {
        isLoading.value = true
        await nextTick()
        await getProjectContent()
        showExplorer.value = true
    }
}

function removePackage(packageId: string) {
    selectedPackages.value.delete(packageId)
}

onMounted(async () => {
    const parameters = new URLSearchParams(window.location.search).get('param')
    if (parameters !== null) {
        const result = extractDataFromParameters(parameters, springProject.value.metaData, vueJsProject.value.metaData)
        if (result !== null) {
            if (result.projectType === ProjectType.Spring) {
                springProject.value = {
                    metaData: result.metaData as SpringProjectType,
                    active: true,
                    valid: true
                }
            } else {
                vueJsProject.value = {
                    metaData: result.metaData as VueJsProjectType,
                    active: true,
                    valid: true
                }
            }
            projectType.value = result.projectType
            selectedPackages.value = new Set(result.packages)
            renderKey.value = getId() // Re-render project options
        }
    }
})

function displayDependencyDialog() {
    exploreButton.value?.blur()
    shareButton.value?.blur()
    generateButton.value?.blur()

    showDependenciesDialog.value = true
    focusTrapInputElement.value?.focus()
}

function onCloseDependencyDialog() {
    exploreButton.value?.blur()
    shareButton.value?.blur()
    generateButton.value?.blur()

    showDependenciesDialog.value = false
    addDependencyButton.value?.focus()
}

function onCloseExplorerDialog() {
    addDependencyButton.value?.blur()
    shareButton.value?.blur()
    generateButton.value?.blur()

    showExplorer.value = false
    exploreButton.value?.focus()
}

function onCloseShareDialog() {
    addDependencyButton.value?.blur()
    exploreButton.value?.blur()
    generateButton.value?.blur()

    showShareDialog.value = false
    shareButton.value?.focus()
}
</script>
<template>
    <AppComponentLoader v-if="isLoading"></AppComponentLoader>
    <header
        class="flex items-center justify-between bg-primary-500 shadow-inner transition duration-200 ease-linear xl:px-4 dark:bg-primary-dark-900"
        :class="{ 'motion-safe:blur-sm': isAnyDialogShown }"
        role="banner"
    >
        <a href="/" class="mx-2 my-3 h-[39px]" aria-label="Generator Genie" tabindex="0" title="Generator Genie">
            <Logo class="w-80 fill-current text-white drop-shadow-lg" alt="Generator Genie"></Logo>
        </a>
        <label
            id="focus-trap-label-element-ui-1"
            for="focus-trap-input-element-ui-1"
            class="hidden"
            aria-hidden="true"
        ></label>
        <input
            type="text"
            id="focus-trap-input-element-ui-1"
            class="absolute left-0 top-0 m-0 h-px w-px border-0 bg-transparent p-0"
            aria-labelledby="focus-trap-label-element-ui-1"
            ref="focusTrapInputElement"
        />
        <div class="mr-2 flex flex-col items-center justify-center space-y-3 md:flex-row md:space-x-4 md:space-y-0">
            <a
                href="https://github.com/ideasbucketlabs/generator-genie"
                target="_blank"
                aria-label="Go to Generator Genie Github page"
                rel="noopener noreferrer"
                tabindex="-1"
                class="flex h-5 w-5 items-center justify-center md:h-7 md:w-7 lg:h-8 lg:w-8 xl:h-9 xl:w-9"
                title="Go to Generator Genie Github page"
            >
                <span class="block h-full w-full"
                    ><GithubIcon
                        class="h-full w-full fill-current text-white drop-shadow-lg hover:scale-105 hover:drop-shadow-xl"
                        aria-label="Go to Generator Genie Github page"
                    ></GithubIcon
                ></span>
            </a>
            <a
                href="https://twitter.com/@myideasbucket"
                target="_blank"
                tabindex="-1"
                rel="noopener noreferrer"
                class="flex h-5 w-5 items-center justify-center md:h-7 md:w-7 lg:h-8 lg:w-8 xl:h-9 xl:w-9"
                aria-label="Go to IdeasBucket Twitter(X) page"
                title="Go to IdeasBucket Twitter(X) page"
            >
                <span class="block h-full w-full"
                    ><XIcon
                        class="h-full w-full fill-current text-white drop-shadow-lg hover:scale-105 hover:drop-shadow-xl"
                        aria-label="Go to IdeasBucket Twitter(X) page"
                    ></XIcon
                ></span>
            </a>
        </div>
    </header>
    <main
        class="h-10 flex-grow overflow-auto bg-gray-50 text-gray-800 transition duration-200 ease-linear xl:px-4 dark:bg-primary-dark-800 dark:text-primary-dark-100"
        :class="{ 'motion-safe:blur-sm': isAnyDialogShown }"
        role="main"
    >
        <Explorer
            v-if="showExplorer && contentTree !== null"
            :content="contentTree"
            :artifact="projectMetadata.get(projectType)?.metaData.artifact ?? 'demo'"
            @close="onCloseExplorerDialog"
            @downloadClicked="onGenerate"
        ></Explorer>
        <ShareDialog
            v-if="showShareDialog"
            @close="onCloseShareDialog"
            :metaData="projectMetadata.get(projectType)?.metaData!!"
            :projectType="projectType"
            :packages="selectedPackageInformation"
        ></ShareDialog>
        <DependenciesDialog
            v-if="showDependenciesDialog"
            title="Dependencies"
            @close="onCloseDependencyDialog"
            :projectType="projectType"
            v-model="selectedPackages"
            :springVersion="
                projectType === ProjectType.Spring
                    ? (projectMetadata.get(projectType)?.metaData as SpringProjectType)?.springBootVersion ?? ''
                    : ''
            "
        ></DependenciesDialog>
        <div class="xl:flex">
            <div class="overflow-auto xl:sticky xl:top-0 xl:h-min xl:flex-1">
                <div class="space-y-4 p-2 xl:flex xl:space-x-10 xl:space-y-0">
                    <div class="">
                        <div class="font-medium">Project Type</div>
                        <div class="flex space-x-3.5">
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
                <div class="p-2" :key="renderKey">
                    <SpringProject
                        v-if="projectType === ProjectType.Spring"
                        ref="springProjectComponent"
                        v-model="springProject"
                    ></SpringProject>
                    <VueJsProject v-else v-model="vueJsProject" ref="vueJsProjectComponent"></VueJsProject>
                </div>
            </div>
            <div class="flex-1 p-2 xl:flex xl:flex-col">
                <div class="flex items-center justify-between">
                    <div class="font-medium">Dependencies</div>
                    <BaseButton :primary="false" ref="addDependencyButton" @click="displayDependencyDialog">
                        <template #shortcut>
                            <span v-if="!isMobile && isMac" class="ml-2 block font-extralight">⌘ + b</span>
                            <span v-if="!isMobile && !isMac" class="ml-2 block font-mono font-extralight"
                                >Ctrl + b</span
                            >
                        </template>
                        <span class="block">Add dependencies</span>
                    </BaseButton>
                </div>
                <hr class="my-2 dark:border-gray-500" />
                <div class="mt-2 italic" v-if="selectedPackages.size === 0">No dependency selected</div>
                <div v-else class="space-y-4 xl:flex xl:flex-col xl:overflow-y-auto">
                    <TransitionGroup
                        name="list"
                        tag="div"
                        enter-from-class="-translate-x-full opacity-0"
                        enter-active-class="transition duration-500 ease-out"
                        leave-to-class="opacity-0"
                        leave-active-class="transition duration-500 ease-out"
                        class="flex flex-col space-y-4"
                    >
                        <div
                            v-for="p in selectedPackageInformation"
                            :key="'package-' + p.id"
                            data-selected-package-item="true"
                            :data-selected-package-item-id="p.id"
                            class="flex items-center justify-between rounded border border-gray-200 p-2 shadow dark:border-gray-500"
                            :class="[
                                p.supported ? 'bg-white dark:bg-primary-dark-700' : 'bg-error-100 dark:bg-error-500'
                            ]"
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
                                <div class="text-error-500 dark:text-error-900" v-if="!p.supported">
                                    Not supported for selected Spring Boot version
                                </div>
                            </div>
                            <div class="w-7 pl-1">
                                <button
                                    type="button"
                                    class="flex w-6 items-center rounded-full bg-error-500 hover:shadow-lg dark:bg-error-700"
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
    <footer
        role="contentinfo"
        class="footer relative z-0 flex items-center border-primary-50 transition duration-200 ease-linear"
        :class="{ 'motion-safe:blur-sm': isAnyDialogShown }"
    >
        <div
            class="relative z-0 flex h-16 flex-1 items-center justify-center space-x-4 border-t bg-white dark:border-gray-900 dark:bg-primary-dark-700"
        >
            <BaseButton ref="generateButton" :primary="true" :enabled="haveValidProjectMetaData()" @click="onGenerate">
                <span class="block">{{ generateButtonLabel }}</span>
                <template #shortcut>
                    <span class="ml-2 hidden font-extralight md:block" v-if="!isMobile && isMac">⌘ + ⏎</span>
                    <span class="ml-2 hidden font-extralight md:block" v-if="!isMobile && !isMac">Ctrl + ⏎</span>
                </template>
            </BaseButton>

            <BaseButton :enabled="haveValidProjectMetaData()" ref="exploreButton" @click="onExplore">
                <span>Explore</span>
                <template #shortcut>
                    <span v-if="!isMobile" class="ml-2 hidden font-extralight md:block">Ctrl + Space</span>
                </template>
            </BaseButton>

            <BaseButton
                :enabled="haveValidProjectMetaData()"
                ref="shareButton"
                @click="onShare"
                class="flex-row-reverse"
            >
                <template #shortcut>
                    <span class="mr-2 hidden h-4 w-4 md:block"
                        ><ShareIcon class="fill-current text-primary-500 dark:text-primary-200"></ShareIcon
                    ></span>
                </template>
                <span>Share</span>
            </BaseButton>
        </div>
    </footer>
</template>
