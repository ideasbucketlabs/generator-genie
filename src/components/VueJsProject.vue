<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { VueJsProject as VueJsProjectType } from '@/entity/VueJsProject'
import { clone } from '@/util/Util'
import { Language } from '@/entity/Language'
import InformationIcon from '@/icons/InformationIcon.vue'

const props = defineProps<{
    modelValue: { active: boolean; valid: boolean; metaData: VueJsProjectType }
}>()
const isDataDirty = ref<boolean>(false)

const emit = defineEmits<{
    (e: 'update:model-value', value: { active: boolean; valid: boolean; metaData: VueJsProjectType }): void
}>()

const information = clone(props.modelValue.metaData)
const description = ref<string>(information.description)
const name = ref<string>(information.name)
const language = ref<Language.Javascript | Language.Typescript>(information.language)
const nodeVersion = ref<number>(information.nodeVersion)
const includeRouter = ref<boolean>(information.includeRouter)
const includeUnitTest = ref<boolean>(information.includeUnitTest)
const includePinia = ref<boolean>(information.includePinia)
const indentSize = ref<2 | 4>(information.indentSize)
const includeEslint = ref<boolean>(information.includeEslint)
const includePrettier = ref<boolean>(information.includePrettier)
const nameError = ref<string>('')
const descriptionError = ref<string>('')
const integrationTest = ref<'none' | 'playwright' | 'cypress' | 'nightwatch'>(information.integrationTest)

defineExpose({ validate })

const artifact = computed<string>(() => {
    if (name.value === '') {
        return ''
    }

    if (/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name.value)) {
        return name.value.toLowerCase()
    }

    return ''
})

const vueJsProject = computed<VueJsProjectType>(() => {
    return {
        language: language.value,
        name: name.value,
        artifact: artifact.value,
        nodeVersion: nodeVersion.value,
        includePinia: includePinia.value,
        includeRouter: includeRouter.value,
        includeUnitTest: includeUnitTest.value,
        description: description.value,
        indentSize: indentSize.value,
        integrationTest: integrationTest.value,
        includeEslint: includeEslint.value,
        includePrettier: includePrettier.value
    }
})

watch(
    vueJsProject,
    (newVueJsProject) => {
        if (isDataDirty.value) {
            validate()
        }
        emit('update:model-value', {
            active: props.modelValue.active,
            valid: nameError.value === '' && descriptionError.value === '',
            metaData: newVueJsProject
        })
    },
    {
        deep: true
    }
)

watch(includeEslint, (newIncludeEslint) => {
    includePrettier.value = newIncludeEslint
})
function haveError(key: 'name' | 'description'): boolean {
    if (key === 'name') {
        return nameError.value !== ''
    }

    return descriptionError.value !== ''
}

function validate() {
    nameError.value = ''
    descriptionError.value = ''
    isDataDirty.value = true

    if ((description.value ?? '').trim().length === 0) {
        descriptionError.value = 'Description cannot be null or blank.'
    }

    if ((name.value ?? '').trim().length === 0) {
        nameError.value = 'Name cannot be null or blank.'
    } else if (!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name.value)) {
        nameError.value =
            'Name must comply with `package.json` name attribute. No spaces, uppercase and special characters allowed.'
    }

    if (nameError.value !== '' || descriptionError.value !== '') {
        emit('update:model-value', {
            active: props.modelValue.active,
            valid: false,
            metaData: vueJsProject.value
        })
    } else {
        emit('update:model-value', {
            active: props.modelValue.active,
            valid: true,
            metaData: vueJsProject.value
        })
    }
}
</script>

<template>
    <div class="space-y-4">
        <div class="">
            <div class="font-medium">Language Preference</div>
            <div class="space-x-4">
                <label class="inline-flex cursor-pointer items-center">
                    <input
                        type="radio"
                        class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                        name="languagePreference"
                        :value="Language.Typescript"
                        v-model="language"
                    />
                    <span class="ml-2">Typescript</span>
                </label>
                <label class="inline-flex cursor-pointer items-center">
                    <input
                        type="radio"
                        class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                        name="languagePreference"
                        :value="Language.Javascript"
                        v-model="language"
                    />
                    <span class="ml-2">Javascript</span>
                </label>
            </div>
        </div>
        <div class="font-medium">Project Metadata</div>
        <div class="space-y-4">
            <div class="flex items-center rounded bg-indigo-100 dark:bg-indigo-500 shadow-lg p-4 space-x-4">
                <div class="">
                    <InformationIcon class="w-10 fill-current text-indigo-500 dark:text-white"></InformationIcon>
                </div>
                <div class="">Please note project will be generated based on Node 18 (LTS).</div>
            </div>
            <div class="">
                <label class="block" :class="{ 'text-red-500 dark:text-red-700': haveError('name') }" for="name"
                    >Name:</label
                >
                <input
                    type="text"
                    id="name"
                    name="name"
                    v-model="name"
                    class="w-full rounded transition duration-200 ease-linear focus:shadow-lg focus:outline-none focus:ring-1 focus:ring-offset-0 dark:bg-gray-800"
                    :class="[
                        haveError('name')
                            ? 'border-red-500 dark:border-red-700 have-error focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-700'
                            : 'hover:border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500'
                    ]"
                />
                <div class="text-red-500 dark:text-red-700" v-if="haveError('name')">
                    {{ nameError }}
                </div>
            </div>
            <div class="">
                <div class="block">Artifact (name of the zip file):</div>
                <div
                    class="w-full cursor-not-allowed bg-white hover:border-indigo-500 border rounded border-gray-700 px-3 py-2 dark:bg-gray-800 dark:border-gray-500"
                >
                    {{ artifact === '' ? '&nbsp;' : artifact + '.zip' }}
                </div>
            </div>
            <div class="">
                <div class="">Add Vue Router for Single Page Application development?</div>
                <div class="space-x-4">
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includeRouter"
                            :value="true"
                            v-model="includeRouter"
                        />
                        <span class="ml-2">Yes</span>
                    </label>
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includeRouter"
                            :value="false"
                            v-model="includeRouter"
                        />
                        <span class="ml-2">No</span>
                    </label>
                </div>
            </div>
            <div class="">
                <div class="">Add Pinia for state management?</div>
                <div class="space-x-4">
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includePinia"
                            :value="true"
                            v-model="includePinia"
                        />
                        <span class="ml-2">Yes</span>
                    </label>
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includePinia"
                            :value="false"
                            v-model="includePinia"
                        />
                        <span class="ml-2">No</span>
                    </label>
                </div>
            </div>
            <div class="">
                <div class="">Add Vitest for Unit Testing?</div>
                <div class="space-x-4">
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includeUnitTest"
                            :value="true"
                            v-model="includeUnitTest"
                        />
                        <span class="ml-2">Yes</span>
                    </label>
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includeUnitTest"
                            :value="false"
                            v-model="includeUnitTest"
                        />
                        <span class="ml-2">No</span>
                    </label>
                </div>
            </div>
            <div class="">
                <div class="">Add E2E test support?</div>
                <div class="space-y-2 flex flex-col">
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="integrationTest"
                            value="none"
                            v-model="integrationTest"
                        />
                        <span class="ml-2">None</span>
                    </label>
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="integrationTest"
                            value="playwright"
                            v-model="integrationTest"
                        />
                        <span class="ml-2">Playwright</span>
                    </label>
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="integrationTest"
                            value="cypress"
                            v-model="integrationTest"
                        />
                        <span class="ml-2"
                            >Cypress
                            <span class="text-gray-500 italic"
                                >(also supports unit testing with Cypress Component Testing)</span
                            ></span
                        >
                    </label>
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="integrationTest"
                            value="nightwatch"
                            v-model="integrationTest"
                        />
                        <span class="ml-2"
                            >Nightwatch
                            <span class="text-gray-500 italic"
                                >(also supports unit testing with Nightwatch Component Testing)</span
                            ></span
                        >
                    </label>
                </div>
            </div>

            <div class="">
                <div class="">Add Eslint?</div>
                <div class="space-x-4">
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includeEslint"
                            :value="true"
                            v-model="includeEslint"
                        />
                        <span class="ml-2">Yes</span>
                    </label>
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includeEslint"
                            :value="false"
                            v-model="includeEslint"
                        />
                        <span class="ml-2">No</span>
                    </label>
                </div>
            </div>
            <div class="" v-if="includeEslint">
                <div class="">Add Prettier (for formatting)?</div>
                <div class="space-x-4">
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includePrettier"
                            :value="true"
                            v-model="includePrettier"
                        />
                        <span class="ml-2">Yes</span>
                    </label>
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="includePrettier"
                            :value="false"
                            v-model="includePrettier"
                        />
                        <span class="ml-2">No</span>
                    </label>
                </div>
            </div>

            <div class="">
                <div class="">Indent space size to use in codebase</div>
                <div class="space-x-4">
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="indentSize"
                            :value="2"
                            v-model.number="indentSize"
                        />
                        <span class="ml-2">2</span>
                    </label>
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                            name="indentSize"
                            :value="4"
                            v-model.number="indentSize"
                        />
                        <span class="ml-2">4</span>
                    </label>
                </div>
            </div>
            <div>
                <label
                    class="flex items-center space-x-1 cursor-help"
                    for="description"
                    :class="{ 'text-red-500 dark:text-red-700': haveError('description') }"
                    title="Markdown is supported this will be the part of README.md"
                    ><span>Description:</span
                    ><span class="w-4 fill-current text-blue-500"
                        ><InformationIcon class="w-full"></InformationIcon></span
                ></label>
                <textarea
                    name="description"
                    id="description"
                    v-model="description"
                    placeholder="Enter project description. Markdown is supported."
                    class="h-32 w-full rounded transition duration-200 ease-linear focus:shadow-lg focus:outline-none focus:ring-1 focus:ring-offset-0 dark:bg-gray-800"
                    :class="[
                        haveError('description')
                            ? 'border-red-500 dark:border-red-700 have-error focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-700'
                            : 'hover:border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500'
                    ]"
                ></textarea>
                <div class="text-red-500 dark:text-red-700" v-if="haveError('description')">
                    {{ descriptionError }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
