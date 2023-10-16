<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SpringProject } from '@/entity/SpringProject'
import { SpringBootVersion } from '@/entity/SpringBootVersion'
import { clone } from '@/util/Util'
import { isValid } from '@/validators/SpringProjectValidator'
import type { SpringProjectError } from '@/entity/SpringProjectError'
import { Language } from '@/entity/Language'
import InformationIcon from '@/icons/InformationIcon.vue'
import BaseInput from '@/components/BaseInput.vue'

const props = defineProps<{
    modelValue: { active: boolean; valid: boolean; metaData: SpringProject }
}>()
const errors = ref<SpringProjectError>({})
const isDataDirty = ref<boolean>(false)

const emit = defineEmits<{
    (e: 'update:model-value', value: { active: boolean; valid: boolean; metaData: SpringProject }): void
}>()

// eslint-disable-next-line vue/no-setup-props-destructure
// const springProject = ref<SpringProject>(clone(props.modelValue.metaData))
const information = clone(props.modelValue.metaData)
const group = ref<string>(information.group)
const artifact = ref<string>(information.artifact)
const name = ref<string>(information.name)
const language = ref<Language.Java | Language.Kotlin>(information.language)
const springBootVersion = ref<SpringBootVersion>(information.springBootVersion)
const description = ref<string>(information.description)
const javaVersion = ref<17 | 21>(information.javaVersion)

defineExpose({ validate })

const packageName = computed<string>(() => {
    if (artifact.value === '') {
        return group.value
    }

    return group.value + '.' + artifact.value
})

const springProject = computed<SpringProject>(() => {
    return {
        language: language.value,
        name: name.value,
        springBootVersion: springBootVersion.value,
        group: group.value,
        artifact: artifact.value,
        packageName: packageName.value,
        description: description.value,
        javaVersion: javaVersion.value
    }
})

watch(
    springProject,
    (newGradleProject) => {
        if (isDataDirty.value) {
            validate()
        }
        emit('update:model-value', {
            active: props.modelValue.active,
            valid: Object.entries(errors.value).length === 0,
            metaData: newGradleProject
        })
    },
    {
        deep: true
    }
)

function haveError<K extends keyof SpringProjectError>(key: K): boolean {
    return errors.value ? key in errors.value : false
}

function getError<K extends keyof SpringProjectError>(key: K): string {
    if (!errors.value) {
        return ''
    }

    if (key in errors.value) {
        return errors.value[key] as string
    }
    return ''
}

function validate() {
    const error = isValid(springProject.value)
    isDataDirty.value = true
    if (Object.entries(error).length === 0) {
        errors.value = {}
        emit('update:model-value', {
            active: props.modelValue.active,
            valid: true,
            metaData: springProject.value
        })
    } else {
        errors.value = error
        emit('update:model-value', {
            active: props.modelValue.active,
            valid: false,
            metaData: springProject.value
        })
    }
}
</script>

<template>
    <div class="space-y-4">
        <div class="">
            <div class="font-medium">Language Preference</div>
            <div class="space-x-4 flex">
                <BaseInput
                    v-model="language"
                    label="Java"
                    name="languagePreference"
                    type="radio"
                    :value="Language.Java"
                ></BaseInput>
                <BaseInput
                    v-model="language"
                    label="Kotlin"
                    name="languagePreference"
                    type="radio"
                    :value="Language.Kotlin"
                ></BaseInput>
            </div>
        </div>
        <div class="">
            <div class="font-medium">Spring boot version</div>
            <div class="space-x-4 flex">
                <BaseInput
                    v-model="springBootVersion"
                    :label="SpringBootVersion['3_0_11']"
                    name="springBootVersion"
                    type="radio"
                    :value="SpringBootVersion['3_0_11']"
                ></BaseInput>
                <BaseInput
                    v-model="springBootVersion"
                    :label="SpringBootVersion['3_1_4']"
                    name="springBootVersion"
                    type="radio"
                    :value="SpringBootVersion['3_1_4']"
                ></BaseInput>
            </div>
        </div>
        <div class="font-medium">Project Metadata</div>
        <div class="space-y-4">
            <div class="flex items-center rounded bg-primary-100 dark:bg-primary-500 shadow-lg p-4 space-x-4">
                <div class="">
                    <InformationIcon
                        aria-label="Information"
                        class="w-10 fill-current text-primary-500 dark:text-white"
                    ></InformationIcon>
                </div>
                <div>Please note project will be generated based on Gradle.</div>
            </div>
            <BaseInput
                v-model="group"
                label="Group:"
                :has-error="haveError('group')"
                :error="getError('group')"
            ></BaseInput>

            <BaseInput
                v-model="artifact"
                label="Artifact:"
                :has-error="haveError('artifact')"
                :error="getError('artifact')"
            ></BaseInput>

            <BaseInput
                v-model="name"
                label="Name:"
                :has-error="haveError('name')"
                :error="getError('name')"
            ></BaseInput>

            <div class="">
                <div class="block">Package Name:</div>
                <div
                    class="w-full cursor-not-allowed bg-white hover:border-primary-500 border rounded border-gray-700 px-3 py-2 dark:bg-gray-800 dark:border-gray-500"
                >
                    {{ packageName }}
                </div>
            </div>

            <BaseInput
                type="textarea"
                v-model="description"
                label="Description:"
                placeholder="Enter project description. Markdown is supported."
                :has-error="haveError('description')"
                :error="getError('description')"
                information-tooltip="Markdown is supported this will be the part of README.md"
            ></BaseInput>

            <div>
                <div class="font-medium">Java version</div>
                <div class="flex space-x-2">
                    <BaseInput
                        v-model.number="javaVersion"
                        :value="17"
                        label="17"
                        type="radio"
                        name="java_version"
                    ></BaseInput>
                    <BaseInput
                        v-model.number="javaVersion"
                        :value="21"
                        label="21"
                        type="radio"
                        name="java_version"
                    ></BaseInput>
                </div>
            </div>
        </div>
    </div>
</template>
