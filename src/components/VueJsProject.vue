<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { VueJsProject as VueJsProjectType } from '@/entity/VueJsProject'
import { clone } from '@/util/Util'
import { Language } from '@/entity/Language'
import InformationIcon from '@/icons/InformationIcon.vue'
import BaseInput from '@/components/BaseInput.vue'

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
            <div class="flex space-x-4">
                <BaseInput type="radio" v-model="language" :value="Language.Typescript" label="Typescript"></BaseInput>
                <BaseInput type="radio" v-model="language" :value="Language.Javascript" label="Javascript"></BaseInput>
            </div>
        </div>
        <div class="font-medium">Project Metadata</div>
        <div class="space-y-4">
            <div class="flex items-center rounded bg-indigo-100 dark:bg-indigo-500 shadow-lg p-4 space-x-4">
                <div class="">
                    <InformationIcon
                        class="w-10 fill-current text-indigo-500 dark:text-white"
                        aria-label="Information"
                    ></InformationIcon>
                </div>
                <div class="">Please note project will be generated based on Node 18 (LTS).</div>
            </div>
            <BaseInput v-model="name" label="Name:" :error="nameError" :has-error="haveError('name')"></BaseInput>
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
                <div class="space-x-4 flex">
                    <BaseInput
                        name="includeRouter"
                        type="radio"
                        :value="true"
                        v-model="includeRouter"
                        label="Yes"
                    ></BaseInput>
                    <BaseInput
                        name="includeRouter"
                        type="radio"
                        :value="false"
                        v-model="includeRouter"
                        label="No"
                    ></BaseInput>
                </div>
            </div>
            <div class="">
                <div class="">Add Pinia for state management?</div>
                <div class="space-x-4 flex">
                    <BaseInput
                        name="includePinia"
                        type="radio"
                        :value="true"
                        v-model="includePinia"
                        label="Yes"
                    ></BaseInput>
                    <BaseInput
                        name="includePinia"
                        type="radio"
                        :value="false"
                        v-model="includePinia"
                        label="No"
                    ></BaseInput>
                </div>
            </div>
            <div class="">
                <div class="">Add Vitest for Unit Testing?</div>
                <div class="space-x-4 flex">
                    <BaseInput
                        name="includeUnitTest"
                        type="radio"
                        :value="true"
                        v-model="includeUnitTest"
                        label="Yes"
                    ></BaseInput>
                    <BaseInput
                        name="includeUnitTest"
                        type="radio"
                        :value="false"
                        v-model="includeUnitTest"
                        label="No"
                    ></BaseInput>
                </div>
            </div>
            <div class="">
                <div class="">Add E2E test support?</div>
                <div class="space-y-2 flex flex-col">
                    <BaseInput
                        name="integrationTest"
                        type="radio"
                        value="none"
                        v-model="integrationTest"
                        label="None"
                    ></BaseInput>

                    <BaseInput
                        name="integrationTest"
                        type="radio"
                        value="playwright"
                        v-model="integrationTest"
                        label="Playwright"
                    ></BaseInput>

                    <BaseInput
                        name="integrationTest"
                        type="radio"
                        value="cypress"
                        v-model="integrationTest"
                        label="Cypress <span class='text-gray-500 italic'>(also supports unit testing with Cypress Component Testing)</span></span>"
                        :label-raw="true"
                    ></BaseInput>

                    <BaseInput
                        name="integrationTest"
                        type="radio"
                        value="nightwatch"
                        v-model="integrationTest"
                        label="Nightwatch <span class='text-gray-500 italic'>(also supports unit testing with Nightwatch Component Testing)</span></span>"
                        :label-raw="true"
                    ></BaseInput>
                </div>
            </div>

            <div class="">
                <div class="">Add Eslint?</div>
                <div class="space-x-4 flex">
                    <BaseInput
                        name="includeEslint"
                        type="radio"
                        :value="true"
                        v-model="includeEslint"
                        label="Yes"
                    ></BaseInput>
                    <BaseInput
                        name="includeUnitTest"
                        type="radio"
                        :value="false"
                        v-model="includeEslint"
                        label="No"
                    ></BaseInput>
                </div>
            </div>
            <div class="" v-if="includeEslint">
                <div class="">Add Prettier (for formatting)?</div>
                <div class="space-x-4 flex">
                    <BaseInput
                        name="includePrettier"
                        type="radio"
                        :value="true"
                        v-model="includePrettier"
                        label="Yes"
                    ></BaseInput>
                    <BaseInput
                        name="includePrettier"
                        type="radio"
                        :value="false"
                        v-model="includePrettier"
                        label="No"
                    ></BaseInput>
                </div>
            </div>

            <div class="">
                <div class="">Indent space size to use in codebase</div>
                <div class="space-x-4 flex">
                    <BaseInput
                        name="indentSize"
                        type="radio"
                        :value="2"
                        v-model.number="indentSize"
                        label="2"
                    ></BaseInput>
                    <BaseInput
                        name="indentSize"
                        type="radio"
                        :value="4"
                        v-model.number="indentSize"
                        label="4"
                    ></BaseInput>
                </div>
            </div>
            <div>
                <BaseInput
                    type="textarea"
                    v-model="description"
                    label="Description:"
                    placeholder="Enter project description. Markdown is supported."
                    :has-error="haveError('description')"
                    :error="descriptionError"
                    information-tooltip="Markdown is supported this will be the part of README.md"
                ></BaseInput>
            </div>
        </div>
    </div>
</template>
