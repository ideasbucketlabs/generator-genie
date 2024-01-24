<script setup lang="ts">
import { marked } from 'marked'

defineProps<{ content: string }>()
</script>

<template>
    <article v-html="(marked(content) as string).replace(/<a /g, '<a target=\'_blank\' ')"></article>
</template>
