<script lang="ts" setup>
import showdown from 'showdown';

const transformMsg = (msgInfo:string) => {
  const converter = new showdown.Converter();

  return converter.makeHtml(msgInfo);
};
</script>
<!-- eslint-disable vue/no-v-html -->
<template>
  <!-- eslint-disable-next-line vue/html-self-closing -->
  <div
    class="markdown-viewer"
    v-html="transformMsg('bbbbbb')"
  ></div>
</template>
<style lang="scss" scoped>
// .markdown-viewer {
  //

// }
</style>
