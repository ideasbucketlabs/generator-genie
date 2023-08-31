<script setup lang="ts">
import type { Folder } from '@/entity/ContentTree'
import type { File } from '@/entity/File'
import { ContentType } from '@/entity/ContentType'
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{ content: Array<File | Folder>; level?: number; selectedId?: string | null }>(),
    {
        level: 1,
        selectedId: null
    }
)

const pathSeperator = computed<string>(() => {
    const l = (props.level ?? 1) - 1
    return l === 0 ? '' : '../'.repeat(l)
})

function isSelected(file: File, id: string): boolean {
    return file.id === id
}
</script>

<template>
    <template v-for="(c, index) in content">
        <template v-if="c.type === ContentType.Folder">
            <option :key="index.toString() + level.toString()" :value="c.id" class="flex items-center" disabled>
                {{ pathSeperator }}{{ c.name }}
            </option>
            <template v-if="((c as Folder).children ?? []).length !== 0">
                <NestedOption
                    :content="(c as Folder).children ?? []"
                    :key="index.toString() + level.toString() + 'folder'"
                    :selected-id="selectedId"
                    :level="level + 1"
                ></NestedOption>
            </template>
        </template>
        <template v-else>
            <option
                :key="index.toString() + level.toString() + 'leaf'"
                :selected="isSelected(c as File, selectedId ?? '')"
                :value="(c as File)?.id"
                class="flex items-center"
                :disabled="((c as File).content ?? null) === null"
            >
                {{ pathSeperator }}{{ c.name }}
            </option>
        </template>
    </template>
</template>
