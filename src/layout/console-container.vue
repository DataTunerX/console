<template>
  <anakin-header />

  <div
    v-if="namespace"
    id="container"
  >
    <anakin-nav class="console-sidebar" />

    <router-view
      :key="namespace"
      class="console-content"
    />
  </div>
</template>

<script lang="ts" setup>
import AnakinNav from '@/components/AnakinNav.vue';
import AnakinHeader from '@/components/AnakinHeader.vue';
import { useNamespaceStore } from '@/stores/namespace';

const namespaceStore = useNamespaceStore();
const { namespace } = storeToRefs(useNamespaceStore());

onBeforeMount(async () => {
  await namespaceStore.fetchNamespace();
});
</script>
