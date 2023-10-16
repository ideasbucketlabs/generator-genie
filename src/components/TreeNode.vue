<script setup lang="ts">
import type { Folder } from '@/entity/ContentTree'
import type { File } from '@/entity/File'
import FileIcon from '@/icons/FileIcon.vue'
import ArrowRightIcon from '@/icons/ArrowRightIcon.vue'
import FolderCloseIcon from '@/icons/FolderCloseIcon.vue'
import { ContentType } from '@/entity/ContentType'
import { ref } from 'vue'
import type { Language } from '@/entity/Language'
import EmptyFolderIcon from '@/icons/EmptyFolderIcon.vue'

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

function isCollapsed(id: string): boolean {
    if (!folderState.value.has(id)) {
        folderState.value.set(id, true)
    }

    return folderState.value.get(id)!!
}
</script>

<template>
    <ul>
        <li v-for="(c, index) in content" :key="index.toString() + level.toString()" class="flex items-center">
            <template v-if="c.type === ContentType.File">
                <span
                    @click="
                        selectNode((c as File)?.id ?? null, (c as File)?.content ?? null, (c as File)?.lang ?? null)
                    "
                    :class="[
                        ((c as File).content ?? null) === null
                            ? 'cursor-not-allowed text-gray-400'
                            : 'hover:bg-primary-100 dark:hover:bg-gray-700 cursor-pointer transition duration-200 ease-linear',
                        {
                            'font-medium dark:text-blue-500 text-primary-500 bg-primary-100 dark:bg-gray-700':
                                ((c as File)?.id ?? 'NA') === selectedId
                        }
                    ]"
                    class="flex flex-1 space-x-2 items-center py-1"
                >
                    <span :style="{ width: level === 1 ? 0 : (level * 0.74).toString() + 'rem' }"></span>
                    <span class="w-4 flex-none">
                        <FileIcon class="w-full"></FileIcon>
                    </span>
                    <span class="flex-none truncate">{{ c.name }}&nbsp;&nbsp;</span>
                </span>
            </template>
            <template v-else>
                <li class="flex flex-col flex-1">
                    <span
                        v-if="((c as Folder).children ?? []).length !== 0"
                        class="flex space-x-2 items-center hover:bg-primary-100 dark:hover:bg-gray-700 transition duration-200 ease-linear py-1 cursor-pointer"
                        @click="collapseExpandFolder(c.id)"
                    >
                        <span :style="{ width: level === 1 ? 0 : (level * 0.7).toString() + 'rem' }"></span>
                        <span class="w-4"
                            ><ArrowRightIcon
                                class="w-full transition ease-linear duration-200"
                                :class="{ 'rotate-45': !isCollapsed(c.id) }"
                            ></ArrowRightIcon
                        ></span>
                        <span class="w-4"><FolderCloseIcon class="w-full fill-current"></FolderCloseIcon></span>
                        <span>{{ c.name }}&nbsp;&nbsp;</span>
                    </span>
                    <span
                        v-else
                        class="flex space-x-2 items-center hover:bg-primary-100 dark:hover:bg-gray-700 transition duration-200 ease-linear py-1 cursor-default"
                        title="Empty folder"
                    >
                        <span :style="{ width: level === 1 ? 0 : (level * 0.7).toString() + 'rem' }"></span>
                        <span class="w-4"><EmptyFolderIcon class="w-full fill-current"></EmptyFolderIcon></span>
                        <span>{{ c.name }}</span>
                    </span>
                    <TreeNode
                        v-if="((c as Folder).children ?? []).length !== 0 && !isCollapsed(c.id)"
                        :content="(c as Folder)?.children ?? []"
                        :level="level + 1"
                        :selected-id="selectedId"
                        @node-selected="selectNode($event.id, $event.content, $event.lang)"
                    ></TreeNode>
                </li>
            </template>
        </li>
    </ul>
</template>

<style scoped></style>
