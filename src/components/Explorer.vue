<script setup lang="ts">
import type { ContentTree, Folder } from '@/entity/ContentTree'
import Dialog from '@/components/Dialog.vue'
import { computed, defineAsyncComponent, inject, onMounted, ref } from 'vue'
import Ripple from '@/components/Ripple.vue'
import highlight from '@/util/highlighter'
import type { File } from '@/entity/File'
import TreeNode from '@/components/TreeNode.vue'
import { getId, copyToClipboard as copyString } from '@/util/Util'
import { ContentType } from '@/entity/ContentType'
import { Language } from '@/entity/Language'
import NestedOption from '@/components/NestedOption.vue'
import AppComponentLoader from '@/components/AppComponentLoader.vue'
import BaseButton from '@/components/BaseButton.vue'

const dialog = ref<typeof Dialog | null>(null)
const isMac = inject<boolean>('isMac') as boolean
const isMobile = inject<boolean>('isMobile') as boolean
const emit = defineEmits<{
    (e: 'close'): void
    (e: 'downloadClicked'): void
    (e: 'update:model-value', selectedPackage: Set<string>): void
}>()
const code = ref<string>('')
const numberOfLinesInACode = ref<number>(0)
const rawCode = ref<string>('')
const selectedFileId = ref<string>(getId())
const selectedFileLanguageType = ref<Language | null>(null)
const markedDownShowPreview = ref<boolean>(true)

const props = withDefaults(defineProps<{ content: ContentTree | null; artifact: string }>(), {
    content: null
})

const fileMap: Map<string, File> = new Map()

const lineHtml = computed<string>(() => {
    if (numberOfLinesInACode.value === 0) {
        return ''
    }

    let html = ''

    for (let i = 1; i <= numberOfLinesInACode.value; ++i) {
        html = html + `<div><pre class="line-number">${i}</pre></div>`
    }

    return html
})

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

async function copyToClipboard(textToCopy: string) {
    await copyString(textToCopy, () => {
        copyText.value = 'Copy failed'
        setTimeout(() => {
            copyText.value = 'Copy'
        }, 3000)
    })
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
    const highlightedCode = await highlight(content, lang)
    code.value = highlightedCode.code
    numberOfLinesInACode.value = highlightedCode.lines
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
        const highlightedCode = await highlight(file.content ?? '', file.lang)
        code.value = highlightedCode.code
        numberOfLinesInACode.value = highlightedCode.lines

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
    if (props.content !== null) {
        fillMap(props.content.tree)
        code.value = '<div class="flex w-full h-full flex-1 items-center justify-center"><div>Loading...</div></div>'
        rawCode.value = ''
        const firstFile = findFirstFile(props.content)

        if (firstFile !== null) {
            rawCode.value = firstFile.content!!

            const highlightedCode = await highlight(firstFile.content!!, firstFile.lang)
            code.value = highlightedCode.code
            numberOfLinesInACode.value = highlightedCode.lines
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
</script>

<template>
    <Teleport to="body">
        <Dialog
            ref="dialog"
            width="w-full md:w-10/12 lg:w-7/12 xl:w-10/12"
            @overlay-clicked="closeDialog"
            @escaped="closeDialog"
            title=""
            @close="emit('close')"
        >
            <div style="height: calc(100dvh - 5dvw)" class="flex dark:text-primary-dark-100">
                <div class="hidden w-72 flex-col bg-primary-50 xl:flex xl:pb-16 dark:bg-primary-dark-800">
                    <div
                        class="flex h-11 items-center border-b border-primary-100 p-2 font-semibold text-primary-500 dark:border-gray-700"
                    >
                        {{ artifact }}.zip
                    </div>
                    <div class="flex flex-1 overflow-auto">
                        <TreeNode
                            v-if="content !== null"
                            :level="1"
                            :content="content.tree"
                            class="flex max-w-[24rem] flex-1 flex-col"
                            :selected-id="selectedFileId"
                            @node-selected="selectFile($event.id, $event.content, $event.lang)"
                        ></TreeNode>
                    </div>
                </div>
                <div class="flex flex-1 flex-col overflow-auto">
                    <div class="flex xl:hidden" v-if="content !== null">
                        <select
                            class="flex-1 border-primary-100 text-primary-500 hover:border hover:border-primary-200 focus:border-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-primary-500 dark:bg-primary-dark-900 dark:focus:border-primary-500"
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
                        class="flex flex-1 flex-col overflow-auto rounded-bl border-b border-l border-primary-100 bg-white dark:border-gray-700 dark:bg-primary-dark-900"
                    >
                        <div
                            class="flex h-11 items-center justify-center border-b border-primary-100 bg-primary-50 dark:border-gray-700 dark:bg-primary-dark-800"
                            v-if="selectedFileLanguageType === Language.Markdown"
                        >
                            <button
                                type="button"
                                v-if="markedDownShowPreview"
                                @click="markedDownShowPreview = !markedDownShowPreview"
                                class="relative my-1 flex items-center overflow-hidden rounded border border-primary-400 px-4 py-1 transition duration-200 ease-linear hover:bg-gray-200 hover:shadow-lg dark:border-gray-950 dark:bg-primary-dark-600 dark:text-primary-dark-100 dark:hover:bg-gray-700"
                            >
                                <Ripple></Ripple>
                                View Source
                            </button>
                            <button
                                type="button"
                                v-if="!markedDownShowPreview"
                                @click="markedDownShowPreview = !markedDownShowPreview"
                                class="relative my-1 flex items-center overflow-hidden rounded border border-primary-400 px-4 py-1 transition duration-200 ease-linear hover:bg-gray-200 hover:shadow-lg dark:border-gray-950 dark:bg-primary-dark-600 dark:text-primary-dark-100 dark:hover:bg-gray-700"
                            >
                                <Ripple></Ripple>
                                Preview
                            </button>
                        </div>
                        <div
                            v-if="selectedFileLanguageType === Language.Markdown && markedDownShowPreview"
                            class="relative flex h-10 flex-grow overflow-auto"
                        >
                            <MarkdownPreview
                                class="prose prose-gray absolute w-full p-4 dark:prose-invert prose-a:text-blue-500"
                                :content="rawCode"
                            ></MarkdownPreview>
                        </div>
                        <template v-else>
                            <div class="flex flex-1">
                                <div
                                    v-if="numberOfLinesInACode !== 0"
                                    class="mr-2 w-10 border-r border-primary-100 bg-primary-50 pr-1 text-right text-primary-300 dark:border-gray-700 dark:bg-primary-dark-800 dark:text-primary-dark-500"
                                    v-html="lineHtml"
                                ></div>
                                <pre class="code-display relative flex-1 overflow-auto rounded-bl" v-html="code"></pre>
                            </div>
                        </template>

                        <!--                        <pre class="code-display flex-1 rounded-bl overflow-auto relative" v-html="code"></pre>-->
                    </div>
                    <div class="flex justify-center space-x-4 bg-primary-50 py-2 dark:bg-primary-dark-800">
                        <BaseButton :primary="true" @click="emit('downloadClicked')" v-if="!isMobile">
                            <span class="block">Download</span>
                            <template #shortcut>
                                <span class="ml-2 hidden font-extralight md:block" v-if="isMac">⌘ + ⏎</span>
                                <span class="ml-2 hidden font-extralight md:block" v-else>Ctrl + ⏎</span>
                            </template>
                        </BaseButton>

                        <BaseButton @click="copyContent">
                            <span>{{ copyText }}</span>
                        </BaseButton>

                        <BaseButton @click="closeDialog">
                            <span>Close</span>
                            <template #shortcut>
                                <span v-if="!isMobile" class="ml-2 hidden font-extralight md:block">Esc</span>
                            </template>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </Dialog>
    </Teleport>
</template>

<style scoped>
.line-number {
    @apply whitespace-pre leading-6;
    word-spacing: normal;
    word-wrap: normal;
}

:deep(.code-display) code,
.code-display {
    @apply whitespace-pre border-0 bg-none text-left leading-6 text-black;
    direction: ltr;
    word-spacing: normal;
    word-wrap: normal;
    hyphens: none;
}

/*.code-display,
//:deep(.code-display) :not(pre) > code {
//} */

/* Theme */
:deep(.code-display) .token.prolog,
:deep(.code-display) .token.doctype,
:deep(.code-display) .token.cdata {
    color: theme('colors.gray.700');
}

:deep(.code-display) .token.comment {
    color: theme('colors.gray.300');
    font-style: italic;
    text-shadow: theme('colors.gray.50') 0 1px;
}

:deep(.code-display) .token.selector,
:deep(.code-display) .token.operator,
:deep(.code-display) .token.punctuation {
    color: theme('colors.gray.900');
}

:deep(.code-display) .token.namespace {
    opacity: 0.7;
}

:deep(.code-display) .token.tag,
:deep(.code-display) .token.boolean {
    color: theme('colors.red.500');
}

:deep(.code-display) .token.atrule,
:deep(.code-display) .token.attr-value,
:deep(.code-display) .token.hex,
:deep(.code-display) .token.string {
    color: theme('colors.blue.500');
}

:deep(.code-display) .token.rule {
    color: theme('colors.sky.500');
}

:deep(.code-display) .token.property,
:deep(.code-display) .token.entity,
:deep(.code-display) .token.url,
:deep(.code-display) .token.attr-name,
:deep(.code-display) .token.keyword {
    color: theme('colors.sky.500');
}

:deep(.code-display) .token.regex {
    color: theme('colors.purple.500');
}

:deep(.code-display) .token.entity {
    cursor: help;
}

:deep(.code-display) .token.function,
:deep(.code-display) .token.constant {
    color: theme('colors.error.500');
}

:deep(.code-display) .token.variable {
    color: theme('colors.blue.500');
}

:deep(.code-display) .token.number {
    color: theme('colors.primary.500');
}

:deep(.code-display) .token.important,
:deep(.code-display) .token.deliminator {
    color: theme('colors.error.500');
}

:deep(.code-display) .token.annotation.builtin {
    color: theme('colors.green.600');
}

@media (prefers-color-scheme: dark) {
    :deep(.code-display) code,
    .code-display {
        color: theme('colors.white');
    }

    :deep(.code-display) .token.prolog,
    :deep(.code-display) .token.doctype,
    :deep(.code-display) .token.cdata {
        color: theme('colors.gray.50');
    }

    :deep(.code-display) .token.comment {
        color: theme('colors.gray.400');
        text-shadow: theme('colors.gray.800') 0 1px;
        font-style: italic;
    }

    :deep(.code-display) .token.selector,
    :deep(.code-display) .token.operator,
    :deep(.code-display) .token.punctuation {
        color: theme('colors.gray.500');
    }

    :deep(.code-display) .token.namespace {
        opacity: 0.7;
    }

    :deep(.code-display) .token.tag,
    :deep(.code-display) .token.boolean {
        color: theme('colors.error.600');
    }

    :deep(.code-display) .token.atrule,
    :deep(.code-display) .token.attr-value,
    :deep(.code-display) .token.hex,
    :deep(.code-display) .token.string {
        color: theme('colors.lime.500');
    }

    :deep(.code-display) .token.rule {
        color: theme('colors.amber.300');
    }

    :deep(.code-display) .token.property,
    :deep(.code-display) .token.entity,
    :deep(.code-display) .token.url,
    :deep(.code-display) .token.attr-name,
    :deep(.code-display) .token.keyword {
        color: theme('colors.amber.500');
    }

    :deep(.code-display) .token.regex {
        color: theme('colors.purple.500');
    }

    :deep(.code-display) .token.annotation.builtin {
        color: theme('colors.lime.500');
    }

    :deep(.code-display) .token.entity {
        cursor: help;
    }

    :deep(.code-display) .token.function,
    :deep(.code-display) .token.constant {
        color: theme('colors.rose.500');
    }

    :deep(.code-display) .token.variable {
        color: theme('colors.amber.300');
    }

    :deep(.code-display) .token.number {
        color: theme('colors.blue.200');
    }

    :deep(.code-display) .token.important,
    :deep(.code-display) .token.deliminator {
        color: theme('colors.error.500');
    }
}
</style>
