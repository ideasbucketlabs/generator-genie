<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, type PropType, ref, watch } from 'vue'
import Dialog from '@/components/Dialog.vue'
import { dependencyStore } from '@/stores/dependency'
import ReturnIcon from '@/icons/ReturnIcon.vue'
import type { Dependency } from '@/entity/Dependency'
import CloseIcon from '@/icons/CloseIcon.vue'
import type { ProjectType } from '@/entity/ProjectType'
import { SpringBootVersion } from '@/entity/SpringBootVersion'

const store = dependencyStore()
const props = defineProps({
    projectType: {
        type: String as PropType<ProjectType>,
        required: true
    },
    springVersion: {
        type: String as PropType<string>,
        required: false,
        default: ''
    },
    title: {
        type: String as PropType<string | null>,
        required: false,
        default: null
    },
    modelValue: {
        type: Set as PropType<Set<string>>,
        required: true
    }
})

const dialog = ref<typeof Dialog | null>(null)
const emit = defineEmits<{
    (e: 'close'): void
    (e: 'update:model-value', selectedPackage: Set<string>): void
}>()
const multipleSelectionActivated = ref<boolean>(false)
const inputElement = ref<HTMLInputElement | null>(null)
const packagesList = ref<HTMLElement | null>(null)
const isMac = inject<boolean>('isMac') as boolean
const isMobile = inject<boolean>('isMobile') as boolean
const filter = ref<string>('')

const dependencies = computed<Dependency[]>(() => {
    const filteredDependencies = (
        props.springVersion === ''
            ? store.dependenciesByProjectType(props.projectType as string)
            : store.dependenciesByProjectTypeForSpring(
                  props.projectType as ProjectType,
                  props.springVersion as SpringBootVersion
              )
    ).map((dependency) => {
        return {
            id: dependency.id,
            group: dependency.group,
            packages: dependency.packages.filter((p) => !(props.modelValue ?? []).has(p.id))
        }
    })

    if (filter.value.trim() === '') {
        return filteredDependencies
    }

    return filteredDependencies.map((dependency) => {
        return {
            id: dependency.id,
            group: dependency.group,
            packages: dependency.packages.filter((p) => p.name.toLowerCase().includes(filter.value.toLowerCase()))
        }
    })
})

const selectablePackages = computed<string[]>(() => {
    const result: string[] = []
    dependencies.value.forEach((d) => d.packages.forEach((p) => result.push(p.id)))

    return result
})

const keyboardSelection = ref<string | null>(null)

watch(filter, () => {
    keyboardSelection.value = null
})

watch(inputElement, (v) => {
    if (v !== null) {
        v.focus()
        v.addEventListener('keydown', listenForKeyboardEvent)
        nextTick().then(() => {
            setTimeout(() => {
                v.scrollIntoView()
            }, 200)
        })
    }
})

function handleKeyArrowEvent(direction: 'UP' | 'DOWN') {
    if (keyboardSelection.value === null) {
        keyboardSelection.value = selectablePackages.value[0]
    } else {
        if (selectablePackages.value.length !== 0) {
            const index = selectablePackages.value.indexOf(keyboardSelection.value)
            if (index === -1) {
                return
            }
            if (direction === 'UP') {
                if (index === 0) {
                    keyboardSelection.value = selectablePackages.value[0]
                } else {
                    keyboardSelection.value = selectablePackages.value[index - 1]
                }
            } else {
                if (index === selectablePackages.value.length - 1) {
                    keyboardSelection.value = selectablePackages.value[0]
                } else {
                    keyboardSelection.value = selectablePackages.value[index + 1]
                }
            }
            // Fix for text cursor shifting to start during keyboard up and down navigation.
            if (inputElement.value !== null) {
                setTimeout(() => {
                    inputElement.value!.selectionStart = inputElement.value!.selectionEnd = 10000
                }, 10)
            }
            nextTick().then(() => {
                const node = document.getElementsByClassName('keyboard-select')

                if (node.length !== 0) {
                    node[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
                }
            })
        }
    }
}
function closeDialog() {
    if (dialog.value !== null) {
        dialog.value.hide()
    }
}

function onHover(packageId: string) {
    keyboardSelection.value = packageId
}
function selectPackage(packageId: string, wasMouseClick = false) {
    emit('update:model-value', new Set([...props.modelValue, packageId]))
    if (dialog.value !== null && !multipleSelectionActivated.value) {
        dialog.value.hide()
    } else if (wasMouseClick && multipleSelectionActivated.value) {
        inputElement.value?.focus()
    }
}

function listenForKeyboardEvent(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'tab' || event.keyCode === 9) {
        inputElement.value?.focus()
        event.preventDefault()
    } else if (event.key.toLowerCase() === 'arrowdown') {
        handleKeyArrowEvent('DOWN')
    } else if (event.key.toLowerCase() === 'arrowup') {
        handleKeyArrowEvent('UP')
    } else if (event.key.toLowerCase() === 'enter' && keyboardSelection.value !== null) {
        if ((event.metaKey && isMac) || (event.ctrlKey && !isMac)) {
            // handleKeyArrowEvent('DOWN')
            const index = selectablePackages.value.indexOf(keyboardSelection.value)
            if (index !== -1) {
                emit('update:model-value', new Set([...props.modelValue, keyboardSelection.value]))
                nextTick(() => {
                    if (index === selectablePackages.value.length - 1) {
                        keyboardSelection.value = selectablePackages.value[0]
                    } else {
                        keyboardSelection.value = selectablePackages.value[index]
                    }
                })
            }
        } else {
            selectPackage(keyboardSelection.value)
        }
    } else if ((event.metaKey && isMac) || (event.ctrlKey && !isMac)) {
        multipleSelectionActivated.value = true
    }
}

onMounted(() => {
    // document.addEventListener('keydown', listenForKeyboardEvent)
})

onBeforeUnmount(() => {
    // document.removeEventListener('keydown', listenForKeyboardEvent)
    inputElement.value?.removeEventListener('keydown', listenForKeyboardEvent)
})
</script>

<template>
    <Teleport to="body">
        <Dialog
            ref="dialog"
            width="w-full md:w-10/12 lg:w-7/12 xl:w-6/12 shadow-2xl"
            @overlay-clicked="closeDialog"
            @escaped="closeDialog"
            title=""
            @close="emit('close')"
        >
            <div
                style="height: calc(100dvh - 5dvw)"
                class="flex flex-col bg-white dark:bg-primary-dark-800 dark:text-primary-dark-100"
            >
                <div class="relative">
                    <input
                        type="text"
                        name="dependencies-input-filter"
                        tabindex="-1"
                        ref="inputElement"
                        class="h-12 w-full border-b border-l-0 border-r-0 border-t-0 transition duration-200 ease-linear hover:border-primary-500 focus:border-primary-500 focus:shadow-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-0 dark:bg-primary-dark-800 dark:hover:border-primary-400 dark:focus:border-primary-400 dark:focus:ring-primary-400"
                        :class="{ 'pr-56': !isMobile }"
                        autocomplete="off"
                        :placeholder="
                            projectType === 'spring'
                                ? 'Web, Security, JPA, Actuator, Devtools...'
                                : 'Tailwind, VueUse...'
                        "
                        v-model="filter"
                    />
                    <div class="absolute right-0 top-0 mr-2 flex h-12 w-52 items-center justify-end">
                        <div v-if="!isMobile">
                            Press <span v-if="isMac" class="font-extralight">⌘</span>
                            <span v-else class="font-extralight">Ctrl</span> for multiple adds
                        </div>
                        <div v-else class="flex h-8 w-8 items-center justify-center" @click="closeDialog">
                            <close-icon class="w-full fill-current"></close-icon>
                        </div>
                    </div>
                </div>
                <div class="flex h-12 flex-grow overflow-auto" style="margin-top: 2px" ref="packagesList">
                    <div class="relative flex-1" data-dependencies-list="true">
                        <div v-for="dependency in dependencies" :key="dependency.id">
                            <template v-if="dependency.packages.length !== 0">
                                <div
                                    class="sticky top-0 flex items-center border-b border-primary-200 bg-white p-2 pl-2 text-white shadow dark:border-primary-400 dark:bg-primary-dark-700"
                                >
                                    <span class="block rounded bg-primary-500 px-2 py-1 text-sm uppercase">{{
                                        dependency.group
                                    }}</span>
                                </div>
                                <template v-for="packages in dependency.packages" :key="dependency.id + packages.id">
                                    <div
                                        data-package-item="true"
                                        :data-package-item-id="packages.id"
                                        @click="selectPackage(packages.id, true)"
                                        class="flex cursor-pointer border-b border-primary-200 p-2 transition duration-100 ease-linear dark:border-primary-500"
                                        :class="{
                                            'keyboard-select bg-primary-100 dark:bg-primary-500':
                                                keyboardSelection === packages.id
                                        }"
                                        @mousemove="onHover(packages.id)"
                                    >
                                        <div class="flex-1">
                                            <div class="font-medium">{{ packages.name }}</div>
                                            <div class="text-sm">{{ packages.description }}</div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="w-6">
                                                <return-icon
                                                    class="w-full fill-current text-white dark:text-primary-dark-800"
                                                ></return-icon>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    </Teleport>
</template>
