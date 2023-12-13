<script setup lang="ts">
import { getId } from '@/util/Util'
import { onBeforeMount, type PropType } from 'vue'
import InformationIcon from '@/icons/InformationIcon.vue'

const props = defineProps({
    name: {
        type: String as PropType<string>,
        required: false,
        default: () => getId()
    },
    type: {
        type: String as PropType<'text' | 'radio' | 'number' | 'textarea'>,
        required: false,
        default: 'text'
    },
    id: {
        type: String as PropType<string>,
        required: false,
        default: () => getId()
    },
    label: {
        type: String as PropType<string>,
        required: true
    },
    labelRaw: {
        type: Boolean as PropType<boolean>,
        required: false,
        default: false
    },
    hasError: {
        type: Boolean as PropType<boolean>,
        required: false,
        default: false
    },
    error: {
        type: String as PropType<string>,
        required: false,
        default: ''
    },
    placeholder: {
        type: String as PropType<string>,
        default: '',
        required: false
    },
    modelValue: {
        required: true,
        type: null as unknown as PropType<unknown>
    },
    informationTooltip: {
        default: null,
        required: false,
        type: String as PropType<string>
    },
    value: {
        default: null,
        required: false,
        type: null as unknown as PropType<any>
    },
    readOnly: {
        default: false,
        required: false,
        type: Boolean as PropType<boolean>
    }
})
const emit = defineEmits<{
    (e: 'update:model-value', value: unknown): void
    (e: 'focus'): void
}>()

function onInput(e: Event) {
    emit('update:model-value', (e.target as HTMLInputElement).value)
}

onBeforeMount(() => {
    if (props.type === 'radio' && (props.value === undefined || props.value === null)) {
        throw new Error('Input type checkbox and radio needs value property.')
    }
})
</script>

<template>
    <div
        class="flex items-center"
        :class="[
            { 'text-error-500 dark:text-error-700': hasError },
            [type === 'radio' ? '[&>label]:pl-2' : 'flex-col-reverse justify-start items-stretch']
        ]"
    >
        <div class="text-error-500 dark:text-error-700" v-if="hasError">
            {{ error }}
        </div>
        <input
            v-if="type === 'radio'"
            :type="type"
            :id="id"
            :name="name"
            :value="value"
            :checked="value === modelValue"
            @change="emit('update:model-value', value)"
            :aria-label="label.replace(/(<([^>]+)>)/gi, '')"
            class="cursor-pointer text-primary-500 dark:text-primary-400 hover:border hover:border-primary-500 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-primary-500"
        />
        <input
            v-else-if="type === 'text' || type === 'number'"
            type="text"
            :id="id"
            :name="name"
            :value="modelValue"
            :readonly="readOnly"
            @input="onInput"
            class="w-full rounded transition duration-200 ease-linear focus:shadow-lg focus:outline-none focus:ring-1 focus:ring-offset-0 dark:bg-primary-dark-800"
            :class="[
                hasError
                    ? 'border-error-500 dark:border-error-700 have-error focus:border-error-500 focus:ring-error-500 dark:focus:ring-error-700'
                    : 'hover:border-primary-500 focus:border-primary-500 focus:ring-primary-500 dark:hover:border-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500'
            ]"
        />
        <textarea
            v-else
            :name="name"
            :id="id"
            @input="onInput"
            :value="modelValue as string"
            :placeholder="placeholder"
            class="h-32 w-full rounded transition duration-200 ease-linear focus:shadow-lg focus:outline-none focus:ring-1 focus:ring-offset-0 dark:bg-primary-dark-800"
            :class="[
                hasError
                    ? 'border-error-500 dark:border-error-700 have-error focus:border-error-500 focus:ring-error-500 dark:focus:ring-error-700'
                    : 'hover:border-primary-500 focus:border-primary-500 focus:ring-primary-500'
            ]"
        ></textarea>
        <label class="flex cursor-pointer items-center" :for="id" :title="informationTooltip">
            <span v-if="!labelRaw" class="">{{ label }}</span>
            <span v-else class="" v-html="label"></span>
            <span v-if="informationTooltip" class="w-4 fill-current text-blue-500 ml-1"
                ><InformationIcon class="w-full"></InformationIcon
            ></span>
        </label>
    </div>
</template>

<style scoped>
input:checked + label {
    @apply text-primary-500 dark:text-primary-400;
}
</style>
