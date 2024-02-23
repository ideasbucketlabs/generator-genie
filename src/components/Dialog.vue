<script setup lang="ts">
import { nextTick, onMounted, ref, onBeforeUnmount } from 'vue'

withDefaults(defineProps<{ title?: string | null; width?: string; dialogClass?: string }>(), {
    title: null,
    width: 'w-full md:w-8/12 lg:w-5/12 xl:w-4/12',
    dialogClass:
        // eslint-disable-next-line vue/max-len
        'absolute flex flex-col overflow-hidden rounded border border-primary-300 bg-transparent shadow-lg dark:border-gray-800 dark:shadow-gray-900'
})

const displayContent = ref<boolean>(false)
const displayOverlay = ref<boolean>(false)
const root = ref<HTMLElement | null>(null)

const emit = defineEmits<{ (e: 'close'): void; (e: 'overlayClicked'): void; (e: 'escaped'): void }>()

function hide() {
    displayContent.value = false
}

function show() {
    displayContent.value = true
    if (root.value !== null && typeof root.value.scrollIntoView === 'function') {
        root.value.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }
}
function onClose() {
    emit('close')
}

defineExpose({
    hide
})

function listenForKeyboardEvent(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'escape') {
        emit('escaped')
    }
}

onMounted(async () => {
    await nextTick()
    displayOverlay.value = true
    document.addEventListener('keydown', listenForKeyboardEvent)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', listenForKeyboardEvent)
})
</script>

<template>
    <div
        class="absolute left-0 top-0 z-30 flex h-full w-full content-center items-end justify-center overflow-hidden md:items-center"
        ref="root"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <transition
            enter-from-class="opacity-0"
            enter-active-class="opacity-100 transition duration-200 ease-out"
            leave-to-class="opacity-0"
            leave-active-class="transition duration-500 ease-out"
            @after-enter="show"
            @after-leave="onClose"
        >
            <div class="absolute left-0 top-0 h-full w-full" v-if="displayOverlay" @click="emit('overlayClicked')">
                <div
                    class="absolute left-0 top-0 h-full w-full bg-primary-100 opacity-50 dark:bg-primary-dark-700"
                ></div>
            </div>
        </transition>
        <transition
            enter-from-class="-translate-y-[8%] opacity-0"
            enter-active-class="transition duration-300 ease-out"
            leave-to-class="translate-y-[8%] opacity-0"
            leave-active-class="transition duration-300 ease-out"
            @after-leave="displayOverlay = false"
        >
            <div :class="[dialogClass, width]" v-if="displayContent">
                <div
                    v-if="title"
                    class="flex items-center justify-between rounded-t border-b border-primary-300 bg-primary-500 px-2 py-2 dark:border-gray-800 dark:bg-primary-dark-700"
                >
                    <div class="select-none font-medium text-white dark:text-primary-dark-100">{{ title }}</div>
                </div>
                <div class="flex flex-grow flex-col">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>
