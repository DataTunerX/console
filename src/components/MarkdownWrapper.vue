<template>
  <div
    v-dompurify-html="compiledMarkdown"
    class="markdown-body"
  />
</template>

<script lang="ts" setup>
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const propsData = defineProps({
  source: {
    type: String,
    default: '',
    required: true,
  },
});

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';

      return hljs.highlight(code, { language }).value;
    },
  }),
);

const compiledMarkdown = computed(() => marked.parse(propsData.source));

onMounted(async () => {
  await import('highlight.js/styles/github.css');
});
</script>

<style lang="scss">
@import 'github-markdown-css/github-markdown.css';

.markdown-body {
  padding: 10px;
}
</style>
