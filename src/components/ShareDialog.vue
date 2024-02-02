<script setup lang="ts">
import Dialog from '@/components/Dialog.vue'
import { ref, inject, computed } from 'vue'
import { copyToClipboard as copyString, encode } from '@/util/Util'
import type { SpringProject as SpringProjectType } from '@/entity/SpringProject'
import type { VueJsProject as VueJsProjectType } from '@/entity/VueJsProject'
import type { Package } from '@/entity/Dependency'
import BaseInput from '@/components/BaseInput.vue'
import type { ProjectType } from '@/entity/ProjectType'
import BaseButton from '@/components/BaseButton.vue'

const { metaData, packages, projectType } = defineProps<{
    projectType: ProjectType
    metaData: SpringProjectType | VueJsProjectType
    packages: Package[]
}>()

const dialog = ref<typeof Dialog | null>(null)
const isMobile = inject<boolean>('isMobile') as boolean
const copyText = ref<string>('Copy')
const emit = defineEmits<{
    (e: 'close'): void
}>()

const information = computed<string>(() => {
    const packagesId = packages.map((it) => it.id)
    const payload = encode(
        JSON.stringify({
            projectType: projectType,
            metaData: { ...metaData, ...{ description: '' } },
            packages: packagesId
        })
    )
    return `${location.protocol}//${location.host}?param=${payload}`
})

async function copyToClipboard(textToCopy: string) {
    await copyString(textToCopy, () => {
        copyText.value = 'Copy failed'
        setTimeout(() => {
            copyText.value = 'Copy'
        }, 3000)
    })
    copyText.value = 'Copied'
    setTimeout(() => {
        copyText.value = 'Copy'
    }, 3000)
}
function closeDialog() {
    if (dialog.value !== null) {
        dialog.value.hide()
    }
}
</script>

<template>
    <Teleport to="body">
        <Dialog
            ref="dialog"
            width="w-11/12 md:w-10/12 lg:w-7/12 xl:w-4/12"
            dialog-class="absolute flex flex-col overflow-hidden rounded border border-primary-300 bg-transparent shadow-lg dark:border-gray-800 dark:shadow-gray-900 mb-4 md:mb-0"
            @overlay-clicked="closeDialog"
            @escaped="closeDialog"
            title="Share your configuration"
            @close="emit('close')"
        >
            <div
                class="flex h-56 flex-col justify-between bg-white dark:bg-primary-dark-800 dark:text-primary-dark-100"
            >
                <div class="space-y-2 p-2">
                    <div>Use this link to share the current configuration.</div>
                    <BaseInput v-model="information" :readOnly="true" label="" class="w-full"></BaseInput>
                </div>
                <div class="footer relative z-0 flex items-center justify-center">
                    <div class="flex w-full justify-center space-x-3 bg-white py-2 dark:bg-primary-dark-700">
                        <BaseButton :primary="true" @click="copyToClipboard(information)">
                            <span class="block">{{ copyText }}</span>
                        </BaseButton>
                        <BaseButton :primary="false" @click="closeDialog">
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
