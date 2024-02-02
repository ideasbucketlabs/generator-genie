<script setup lang="ts">
import { ref } from 'vue'
import Ripple from '@/components/Ripple.vue'

withDefaults(defineProps<{ enabled?: boolean; primary?: boolean }>(), {
    enabled: true,
    primary: false
})

defineEmits(['click'])

const root = ref<HTMLElement | null>(null)

function focus() {
    root.value?.focus()
}

function blur() {
    root.value?.blur()
}

defineExpose({
    focus,
    blur
})
</script>

<template>
    <button
        ref="root"
        v-if="enabled"
        @click="$emit('click')"
        type="button"
        tabindex="-1"
        :class="[
            primary
                ? 'border-primary-600 bg-primary-500 text-white ring-primary-800 hover:bg-primary-600 hover:shadow-lg'
                : 'border-primary-400 ring-primary-600 hover:bg-gray-200 hover:shadow-lg dark:border-gray-950 dark:bg-primary-dark-600 dark:text-primary-dark-100 dark:hover:bg-gray-700'
        ]"
        class="relative flex items-center overflow-hidden rounded border px-4 py-2 transition duration-200 ease-linear focus:ring-1 dark:ring-primary-dark-900"
    >
        <Ripple></Ripple>
        <slot name="default"></slot>
        <slot name="shortcut"></slot>
    </button>
    <button
        v-else
        type="button"
        class="relative flex cursor-not-allowed items-center overflow-hidden rounded border border-gray-600 bg-gray-500 px-4 py-2 text-white"
    >
        <slot name="default"></slot>
    </button>
</template>
