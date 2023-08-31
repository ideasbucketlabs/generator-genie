<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SpringProject } from '@/entity/SpringProject'
import { SpringBootVersion } from '@/entity/SpringBootVersion'
import { clone } from '@/util/Util'
import { isValid } from '@/validators/SpringProjectValidator'
import type { SpringProjectError } from '@/entity/SpringProjectError'
import { Language } from '@/entity/Language'
import InformationIcon from '@/icons/InformationIcon.vue'

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
const javaVersion = ref<number>(information.javaVersion)

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
            <div class="space-x-4">
                <label class="inline-flex cursor-pointer items-center">
                    <input
                        type="radio"
                        class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                        name="languagePreference"
                        :value="Language.Java"
                        v-model="language"
                    />
                    <span class="ml-2">Java</span>
                </label>
                <label class="inline-flex cursor-pointer items-center">
                    <input
                        type="radio"
                        class="-mt-[2px] text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                        name="languagePreference"
                        :value="Language.Kotlin"
                        v-model="language"
                    />
                    <span class="ml-2">Kotlin</span>
                </label>
            </div>
        </div>
        <div class="">
            <div class="font-medium">Spring boot version</div>
            <div class="space-x-4">
                <label class="inline-flex cursor-pointer items-center">
                    <input
                        type="radio"
                        class="text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                        name="springBootVersion"
                        :value="SpringBootVersion['3_0_9']"
                        v-model="springBootVersion"
                    />
                    <span class="ml-2">{{ SpringBootVersion['3_0_9'] }}</span>
                </label>
                <label class="inline-flex cursor-pointer items-center">
                    <input
                        type="radio"
                        class="text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                        name="springBootVersion"
                        :value="SpringBootVersion['3_1_2']"
                        v-model="springBootVersion"
                    />
                    <span class="ml-2">{{ SpringBootVersion['3_1_2'] }}</span>
                </label>
            </div>
        </div>
        <div class="font-medium">Project Metadata</div>
        <div class="space-y-4">
            <div class="">
                <label class="block" for="group" :class="{ 'text-red-500 dark:text-red-700': haveError('group') }"
                    >Group:</label
                >
                <input
                    type="text"
                    id="group"
                    name="group"
                    v-model="group"
                    class="w-full rounded transition duration-200 ease-linear focus:shadow-lg focus:outline-none focus:ring-1 focus:ring-offset-0 dark:bg-gray-800"
                    :class="[
                        haveError('group')
                            ? 'border-red-500 dark:border-red-700 have-error focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-700'
                            : 'hover:border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500'
                    ]"
                />
                <div class="text-red-500 dark:text-red-700" v-if="haveError('group')">
                    {{ getError('group') }}
                </div>
            </div>

            <div class="">
                <label class="block" :class="{ 'text-red-500 dark:text-red-700': haveError('artifact') }" for="artifact"
                    >Artifact:</label
                >
                <input
                    type="text"
                    id="artifact"
                    name="artifact"
                    v-model="artifact"
                    class="w-full rounded transition duration-200 ease-linear focus:shadow-lg focus:outline-none focus:ring-1 focus:ring-offset-0 dark:bg-gray-800"
                    :class="[
                        haveError('artifact')
                            ? 'border-red-500 dark:border-red-700 have-error focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-700'
                            : 'hover:border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500'
                    ]"
                />
                <div class="text-red-500 dark:text-red-700" v-if="haveError('artifact')">
                    {{ getError('artifact') }}
                </div>
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
                    {{ getError('name') }}
                </div>
            </div>

            <div class="">
                <div class="block">Package Name:</div>
                <div
                    class="w-full cursor-not-allowed bg-white hover:border-indigo-500 border rounded border-gray-700 px-3 py-2 dark:bg-gray-800 dark:border-gray-500"
                >
                    {{ packageName }}
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
                    {{ getError('description') }}
                </div>
            </div>
            <div>
                <div class="font-medium">Java version</div>
                <div class="space-x-4">
                    <label class="inline-flex cursor-pointer items-center">
                        <input
                            type="radio"
                            name="java_version"
                            :value="17"
                            v-model.number="javaVersion"
                            class="text-indigo-500 hover:border hover:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-indigo-500"
                        />
                        <span class="ml-2">17</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
