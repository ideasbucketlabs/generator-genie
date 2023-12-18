<script setup lang="ts">
import { inject, ref } from 'vue'
import Ripple from '@/components/Ripple.vue'

withDefaults(defineProps<{ enabled?: boolean; primary?: boolean }>(), {
    enabled: true,
    primary: false
})

defineEmits(['click'])

const isMobile = inject<boolean>('isMobile') as boolean
const root = ref<HTMLElement | null>(null)

function focus() {
    root.value?.focus()
}

defineExpose({
    focus
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
                ? 'ring-primary-800 dark:ring-primary-dark-900  border-primary-600 bg-primary-500 text-white'
                : 'ring-primary-600 dark:ring-primary-dark-900 dark:border-gray-950 border-primary-400 dark:text-primary-dark-100 dark:bg-primary-dark-600',
            { 'hover:bg-primary-600 hover:shadow-lg': !isMobile && primary },
            { 'hover:bg-gray-200 hover:shadow-lg dark:hover:bg-gray-700': !isMobile && !primary }
        ]"
        class="relative flex focus:ring-1 items-center overflow-hidden rounded border px-4 py-2 transition duration-200 ease-linear"
    >
        <Ripple></Ripple>
        <slot name="default" class="block"></slot>
        <slot name="shortcut"></slot>
    </button>
    <button
        v-else
        type="button"
        class="relative flex cursor-not-allowed items-center overflow-hidden rounded border border-gray-600 bg-gray-500 px-4 py-2 text-white"
    >
        <span class="block">
            <slot name="default"></slot>
        </span>
    </button>
</template>

<style scoped></style>
