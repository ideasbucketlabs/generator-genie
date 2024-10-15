<script setup lang="ts">
import type { Folder } from '@/entity/ContentTree'
import type { File } from '@/entity/File'
import FileIcon from '@/icons/FileIcon.vue'
import ArrowRightIcon from '@/icons/ArrowRightIcon.vue'
import FolderCloseIcon from '@/icons/FolderCloseIcon.vue'
import { ContentType } from '@/entity/ContentType'
import { ref } from 'vue'
import { Language } from '@/entity/Language'
import EmptyFolderIcon from '@/icons/EmptyFolderIcon.vue'
import CssFileIcon from '@/icons/CssFileIcon.vue'
import JavaFileIcon from '@/icons/JavaFileIcon.vue'
import JsonFileIcon from '@/icons/JsonFileIcon.vue'
import JavaScriptFileIcon from '@/icons/JavaScriptFileIcon.vue'
import HtmlFileIcon from '@/icons/HtmlFileIcon.vue'
import MarkdownFileIcon from '@/icons/MarkdownFileIcon.vue'
import FolderOpenIcon from '@/icons/FolderOpenIcon.vue'

withDefaults(defineProps<{ content: Array<File | Folder>; level?: number; selectedId?: string | null }>(), {
    level: 1,
    selectedId: null
})

const emit = defineEmits<{
    (e: 'node-selected', value: { id: string; content: string; lang: Language }): void
}>()

const folderState = ref<Map<string, boolean>>(new Map())

function selectNode(id: string | null, content: string | null, lang: Language | null) {
    if (id !== null && content !== null && lang !== null) {
        emit('node-selected', { id, content, lang })
    }
}

function collapseExpandFolder(id: string) {
    const currentState = folderState.value.get(id)
    folderState.value.set(id, !currentState)
}

function expandFolder(id: string) {
    folderState.value.set(id, false)
}

function collapseFolder(id: string) {
    folderState.value.set(id, true)
}

function isCollapsed(id: string): boolean {
    if (!folderState.value.has(id)) {
        folderState.value.set(id, true)
    }

    return folderState.value.get(id)!
}
</script>

<template>
    <ul>
        <li v-for="(c, index) in content" :key="index.toString() + level?.toString()" class="flex items-center">
            <template v-if="c.type === ContentType.File">
                <div
                    @click="
                        selectNode((c as File)?.id ?? null, (c as File)?.content ?? null, (c as File)?.lang ?? null)
                    "
                    @keydown.enter="
                        selectNode((c as File)?.id ?? null, (c as File)?.content ?? null, (c as File)?.lang ?? null)
                    "
                    tabindex="0"
                    :class="[
                        ((c as File).content ?? null) === null
                            ? 'cursor-not-allowed text-gray-400'
                            : 'cursor-pointer transition duration-200 ease-linear hover:bg-primary-100 dark:hover:bg-gray-700',
                        [
                            ((c as File)?.id ?? 'NA') === selectedId
                                ? 'bg-primary-100 font-medium text-primary-500 dark:bg-primary-dark-700 dark:text-blue-500'
                                : 'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-200 dark:focus-visible:ring-primary-dark-600'
                        ]
                    ]"
                    class="flex flex-1 items-center space-x-2 py-1 focus:outline-none"
                    :title="c.name"
                >
                    <span :style="{ width: level === 1 ? 0 : ((level ?? 0) * 0.74).toString() + 'rem' }"></span>
                    <span class="w-4 flex-none">
                        <CssFileIcon class="w-full" v-if="(c as File).lang === Language.Css"></CssFileIcon>
                        <JavaFileIcon class="w-full" v-else-if="(c as File).lang === Language.Java"></JavaFileIcon>
                        <JsonFileIcon class="w-full" v-else-if="(c as File).lang === Language.Json"></JsonFileIcon>
                        <HtmlFileIcon class="w-full" v-else-if="(c as File).lang === Language.Html"></HtmlFileIcon>
                        <MarkdownFileIcon
                            class="w-full"
                            v-else-if="(c as File).lang === Language.Markdown"
                        ></MarkdownFileIcon>
                        <JavaScriptFileIcon
                            class="w-full"
                            v-else-if="(c as File).lang === Language.Javascript"
                        ></JavaScriptFileIcon>
                        <FileIcon class="w-full" v-else></FileIcon>
                    </span>
                    <span class="flex-none truncate">{{ c.name }}&nbsp;&nbsp;</span>
                </div>
            </template>
            <template v-else>
                <li class="flex flex-1 flex-col">
                    <div
                        v-if="((c as Folder).children ?? []).length !== 0"
                        class="flex cursor-pointer items-center space-x-2 py-1 transition duration-200 ease-linear hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-200 dark:hover:bg-gray-700 dark:focus-visible:ring-primary-dark-600"
                        @click="collapseExpandFolder(c.id)"
                        tabindex="0"
                        :title="c.name + (isCollapsed(c.id) ? ' (Click to expand)' : ' (Click to collapse)')"
                        @keydown.right="expandFolder(c.id)"
                        @keydown.enter="collapseExpandFolder(c.id)"
                        @keydown.left="collapseFolder(c.id)"
                    >
                        <span :style="{ width: level === 1 ? 0 : ((level ?? 0) * 0.7).toString() + 'rem' }"></span>
                        <span class="w-4"
                            ><ArrowRightIcon
                                class="w-full transform-gpu transition duration-200 ease-linear will-change-transform"
                                :class="{ 'rotate-[40deg]': !isCollapsed(c.id) }"
                            ></ArrowRightIcon
                        ></span>
                        <span class="relative w-4">
                            <FolderCloseIcon v-if="isCollapsed(c.id)" class="w-full fill-current"></FolderCloseIcon>
                            <FolderOpenIcon v-else class="w-full -translate-y-[1px] fill-current"></FolderOpenIcon>
                        </span>
                        <span>{{ c.name }}&nbsp;&nbsp;</span>
                    </div>
                    <div
                        v-else
                        class="flex cursor-not-allowed items-center space-x-2 py-1 transition duration-200 ease-linear hover:bg-primary-100 dark:hover:bg-gray-700"
                        :title="c.name + ' (Empty folder)'"
                    >
                        <span :style="{ width: level === 1 ? 0 : ((level ?? 0) * 0.7).toString() + 'rem' }"></span>
                        <span class="w-4"><EmptyFolderIcon class="w-full fill-current"></EmptyFolderIcon></span>
                        <span>{{ c.name }}</span>
                    </div>
                    <TreeNode
                        v-show="((c as Folder).children ?? []).length !== 0 && !isCollapsed(c.id)"
                        :content="(c as Folder)?.children ?? []"
                        :level="(level ?? 0) + 1"
                        :selected-id="selectedId"
                        @node-selected="selectNode($event.id, $event.content, $event.lang)"
                    ></TreeNode>
                </li>
            </template>
        </li>
    </ul>
</template>
