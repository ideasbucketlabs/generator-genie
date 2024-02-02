<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SpringProject } from '@/entity/SpringProject'
import { SpringBootVersion } from '@/entity/SpringBootVersion'
import { clone } from '@/util/Util'
import { isValid } from '@/validators/SpringProjectValidator'
import type { SpringProjectError } from '@/entity/SpringProjectError'
import { Language } from '@/entity/Language'
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
const buildTool = ref<'gradle' | 'maven'>(information.buildTool)

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
        javaVersion: javaVersion.value,
        buildTool: buildTool.value
    }
})

watch(
    springProject,
    (newSpringProject) => {
        if (isDataDirty.value) {
            validate()
        }
        emit('update:model-value', {
            active: props.modelValue.active,
            valid: Object.entries(errors.value).length === 0,
            metaData: newSpringProject
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
        <div class="space-y-4 xl:flex xl:space-x-10 xl:space-y-0">
            <div class="">
                <div class="font-medium">Language Preference</div>
                <div class="flex space-x-4">
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
                <div class="font-medium">Build Tool</div>
                <div class="flex space-x-4">
                    <BaseInput
                        v-model="buildTool"
                        label="Gradle - Kotlin"
                        name="buildTool"
                        type="radio"
                        value="gradle"
                    ></BaseInput>
                    <BaseInput
                        v-model="buildTool"
                        label="Maven"
                        name="buildTool"
                        type="radio"
                        value="maven"
                    ></BaseInput>
                </div>
            </div>
        </div>
        <div class="">
            <div class="font-medium">Spring boot version</div>
            <div class="flex space-x-4">
                <BaseInput
                    v-model="springBootVersion"
                    :label="SpringBootVersion['3_2_2']"
                    name="springBootVersion"
                    type="radio"
                    :value="SpringBootVersion['3_2_2']"
                ></BaseInput>
                <BaseInput
                    v-model="springBootVersion"
                    :label="SpringBootVersion['3_1_8']"
                    name="springBootVersion"
                    type="radio"
                    :value="SpringBootVersion['3_1_8']"
                ></BaseInput>
            </div>
        </div>
        <div class="border-b border-dashed font-medium dark:border-gray-600">Project Metadata</div>
        <div class="space-y-4">
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
                    class="w-full cursor-not-allowed rounded border border-gray-700 bg-white px-3 py-2 hover:border-primary-500 dark:border-gray-500 dark:bg-primary-dark-800"
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
