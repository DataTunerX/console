<template>
  <div
    v-dompurify-html="compiledMarkdown"
    class="markdown-body"
  />
</template>

<script lang="ts" setup>
import 'github-markdown-css/github-markdown.css';
import { marked } from 'marked';

const propsData = defineProps({
  source: {
    type: String,
    default: '',
    required: true,
  },
});

const compiledMarkdown = computed(() => marked.parse(propsData.source));
</script>

<style lang="scss" scoped>
.markdown-body {
  padding: 10px 20px;
}
</style>
