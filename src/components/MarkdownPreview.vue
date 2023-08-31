<script setup lang="ts">
import { marked } from 'marked'

defineProps<{ content: string }>()
</script>

<template>
    <article v-html="marked(content)"></article>
</template>
