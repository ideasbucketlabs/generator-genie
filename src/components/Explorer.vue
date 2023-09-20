<script setup lang="ts">
import type { ContentTree, Folder } from '@/entity/ContentTree'
import Dialog from '@/components/Dialog.vue'
import { defineAsyncComponent, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import Ripple from '@/components/Ripple.vue'
import highlight from '@/util/highlighter'
import type { File } from '@/entity/File'
import TreeNode from '@/components/TreeNode.vue'
import { getId } from '@/util/Util'
import { ContentType } from '@/entity/ContentType'
import { Language } from '@/entity/Language'
import NestedOption from '@/components/NestedOption.vue'
import AppComponentLoader from '@/components/AppComponentLoader.vue'

const dialog = ref<typeof Dialog | null>(null)
const isMac = inject<boolean>('isMac') as boolean
const isMobile = inject<boolean>('isMobile') as boolean
const emit = defineEmits<{
    (e: 'close'): void
    (e: 'update:model-value', selectedPackage: Set<string>): void
}>()
const code = ref<string>('')
const rawCode = ref<string>('')
const selectedFileId = ref<string>(getId())
const selectedFileLanguageType = ref<Language | null>(null)
const markedDownShowPreview = ref<boolean>(true)

const props = withDefaults(defineProps<{ content: ContentTree | null; artifact: string }>(), {
    content: null
})

const fileMap: Map<string, File> = new Map()

function fillMap(input: Array<File | Folder>) {
    input.forEach((it) => {
        if (it.type === ContentType.File) {
            fileMap.set(it.id, it as File)
        } else if (((it as Folder).children ?? []).length !== 0) {
            fillMap((it as Folder).children ?? [])
        }
    })
}
const copyText = ref<string>('Copy')

const MarkdownPreview = defineAsyncComponent({
    loader: () => import('@/components/MarkdownPreview.vue'),
    loadingComponent: AppComponentLoader,
    delay: 100
})
function closeDialog() {
    if (dialog.value !== null) {
        dialog.value.hide()
    }
}

function listenForKeyboardEvent(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'escape') {
        closeDialog()
    }
}

async function copyToClipboard(textToCopy: string) {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy)
    } else {
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy

        // Move textarea out of the viewport so that it's not visible
        textArea.style.position = 'absolute'
        textArea.style.left = '-999999px'

        document.body.prepend(textArea)
        textArea.select()

        try {
            document.execCommand('copy')
        } catch (error) {
            copyText.value = 'Copy failed'
            setTimeout(() => {
                copyText.value = 'Copy'
            }, 3000)
        } finally {
            textArea.remove()
        }
    }
}

async function copyContent() {
    //navigator.clipboard.writeText(rawCode.value)
    await copyToClipboard(rawCode.value)
    copyText.value = 'Copied'
    setTimeout(() => {
        copyText.value = 'Copy'
    }, 3000)
}

async function selectFile(id: string, content: string, lang: Language) {
    if (selectedFileId.value === id) {
        return
    }
    code.value = await highlight(content, lang)
    selectedFileLanguageType.value = lang
    rawCode.value = content
    selectedFileId.value = id
    markedDownShowPreview.value = lang === Language.Markdown
}

async function nestedOptionChanged(inputElement: HTMLInputElement | null) {
    if (inputElement === null) {
        return
    }
    if (fileMap.has(inputElement.value)) {
        const file = fileMap.get(inputElement.value) as File
        code.value = await highlight(file.content ?? '', file.lang)
        rawCode.value = file.content ?? ''
        selectedFileId.value = file.id
        selectedFileLanguageType.value = file.lang
        markedDownShowPreview.value = file.lang === Language.Markdown
    }
}
function findFirstFile(contentTree: ContentTree): File | null {
    const files = contentTree.tree.filter((it) => (it.type ?? ContentType.Folder) === ContentType.File)

    return files.length > 0 ? (files[0] as File) : null
}

onMounted(async () => {
    document.addEventListener('keydown', listenForKeyboardEvent)
    if (props.content !== null) {
        fillMap(props.content.tree)
        code.value = '<div class="flex w-full h-full flex-1 items-center justify-center"><div>Loading...</div></div>'
        rawCode.value = ''
        const firstFile = findFirstFile(props.content)

        if (firstFile !== null) {
            rawCode.value = firstFile.content!!
            code.value = await highlight(firstFile.content!!, firstFile.lang)
            selectedFileId.value = firstFile.id!!
        } else {
            code.value =
                // eslint-disable-next-line vue/max-len
                '<div class="flex w-full h-full flex-1 items-center justify-center"><div>Please select a file to see the content.</div></div>'
            rawCode.value = ''
        }
    } else {
        code.value =
            // eslint-disable-next-line vue/max-len
            '<div class="flex w-full h-full flex-1 items-center justify-center"><div>Please select a file to see the content.</div></div>'
        rawCode.value = ''
    }
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', listenForKeyboardEvent)
})
</script>

<template>
    <Teleport to="body">
        <Dialog
            ref="dialog"
            width="w-full md:w-10/12 lg:w-7/12 xl:w-10/12"
            @overlay-clicked="closeDialog"
            title=""
            @close="emit('close')"
        >
            <div style="height: calc(100dvh - 5dvw)" class="flex dark:text-gray-100">
                <div class="bg-indigo-50 dark:bg-gray-800 w-72 hidden xl:flex flex-col xl:pb-16">
                    <div
                        class="p-2 font-semibold text-indigo-500 border-b border-indigo-100 dark:border-gray-700 h-11 flex items-center"
                    >
                        {{ artifact }}.zip
                    </div>
                    <div class="flex-1 overflow-auto">
                        <TreeNode
                            v-if="content !== null"
                            :level="1"
                            :content="content.tree"
                            class="max-w-[24rem]"
                            :selected-id="selectedFileId"
                            @node-selected="selectFile($event.id, $event.content, $event.lang)"
                        ></TreeNode>
                    </div>
                </div>
                <div class="flex-1 flex flex-col">
                    <div class="xl:hidden flex" v-if="content !== null">
                        <select
                            class="flex-1 dark:bg-gray-900 text-indigo-500 hover:border border-indigo-100 dark:border-indigo-500 hover:border-indigo-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-indigo-200 dark:focus:border-indigo-500"
                            @change="nestedOptionChanged(($event.target as HTMLInputElement) ?? null)"
                        >
                            <NestedOption
                                :content="content.tree"
                                :level="1"
                                :selected-id="selectedFileId"
                            ></NestedOption>
                        </select>
                    </div>
                    <div
                        class="flex-1 border-l border-b border-indigo-100 dark:border-gray-700 flex flex-col rounded-bl bg-white dark:bg-gray-900"
                    >
                        <div
                            class="border-b flex border-indigo-100 items-center justify-center bg-indigo-50 dark:bg-gray-800 dark:border-gray-700 h-11"
                            v-if="selectedFileLanguageType === Language.Markdown"
                        >
                            <button
                                type="button"
                                v-if="markedDownShowPreview"
                                @click="markedDownShowPreview = !markedDownShowPreview"
                                class="relative flex my-1 dark:border-gray-950 border-indigo-400 items-center overflow-hidden rounded border px-4 py-1 transition duration-200 ease-linear hover:bg-gray-200 hover:shadow-lg dark:text-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700"
                            >
                                <Ripple></Ripple>
                                View Source
                            </button>
                            <button
                                type="button"
                                v-if="!markedDownShowPreview"
                                @click="markedDownShowPreview = !markedDownShowPreview"
                                class="relative flex my-1 dark:border-gray-950 border-indigo-400 items-center overflow-hidden rounded border px-4 py-1 transition duration-200 ease-linear hover:bg-gray-200 hover:shadow-lg dark:text-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700"
                            >
                                <Ripple></Ripple>
                                Preview
                            </button>
                        </div>
                        <div
                            v-if="selectedFileLanguageType === Language.Markdown && markedDownShowPreview"
                            class="overflow-auto relative h-10 flex flex-grow"
                        >
                            <MarkdownPreview
                                class="absolute p-4 w-full prose prose-a:text-blue-500 dark:prose-invert prose-gray"
                                :content="rawCode"
                            ></MarkdownPreview>
                        </div>
                        <pre v-else class="code-display flex-1 rounded-bl overflow-auto relative" v-html="code"></pre>

                        <!--                        <pre class="code-display flex-1 rounded-bl overflow-auto relative" v-html="code"></pre>-->
                    </div>
                    <div class="flex justify-center space-x-4 bg-indigo-50 dark:bg-gray-800 py-2">
                        <button
                            type="button"
                            v-if="!isMobile"
                            class="relative flex items-center overflow-hidden rounded border border-indigo-600 bg-indigo-500 px-4 py-2 text-white transition duration-200 ease-linear hover:bg-indigo-600 hover:shadow-lg"
                        >
                            <Ripple></Ripple>
                            <span class="block">Download</span>
                            <span class="ml-2 block font-extralight" v-if="isMac">⌘ + ⏎</span>
                            <span class="ml-2 block font-extralight" v-else>Ctrl + ⏎</span>
                        </button>
                        <button
                            type="button"
                            @click="copyContent"
                            class="relative flex dark:border-gray-950 border-indigo-400 items-center overflow-hidden rounded border px-4 py-2 transition duration-200 ease-linear hover:bg-gray-200 hover:shadow-lg dark:text-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700"
                        >
                            <Ripple></Ripple>
                            <span>{{ copyText }}</span>
                        </button>
                        <button
                            type="button"
                            @click="closeDialog"
                            class="relative flex dark:border-gray-950 border-indigo-400 items-center overflow-hidden rounded border px-4 py-2 transition duration-200 ease-linear hover:bg-gray-200 hover:shadow-lg dark:text-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700"
                        >
                            <Ripple></Ripple>
                            <span>Close</span>
                            <span v-if="!isMobile" class="ml-2 font-extralight">Esc</span>
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    </Teleport>
</template>

<style scoped>
:deep(.code-display) pre {
    overflow: auto !important;
    position: absolute;
}

:deep(.code-display) code {
    counter-reset: step;
    counter-increment: step 0;
    position: relative;
    overflow: auto !important;
}

:deep(.code-display) code .line::before {
    content: counter(step);
    counter-increment: step;
    width: theme('width.12');
    padding-right: theme('width.2');
    display: inline-block;
    text-align: right;
    font-weight: 200;
    color: theme('colors.indigo.300');
    border-right: solid 10px theme('colors.white');
    background: theme('colors.indigo.50');
}

@media (prefers-color-scheme: dark) {
    :deep(.code-display) code .line::before {
        color: theme('colors.blue.500');
        background: theme('colors.gray.800');
        border-right-color: theme('colors.gray.900');
    }
}
</style>
