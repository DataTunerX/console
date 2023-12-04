<template>
  <div
    v-if="state.shellUrl || isLoading"
    v-loading="isLoading"
    class="cloud-shell__iframe"
  >
    <iframe
      v-if="state.shellUrl"
      ref="iframeRef"
      title="cloud shell"
      :src="state.shellUrl"
      frameborder="0"
      @load="handleIframeLoaded"
    />
  </div>

  <div
    v-else
    class="cloud-shell__no-data"
  >
    <dao-empty />
  </div>
</template>

<script lang="ts" setup>
import { Spec as CloudShellSpec } from '@/api/cloudshell';
import {
  CloudShellRequest, TerminalState, createCloudShell, deleteCloudShell, detectHtmlReadiness,
} from './CloudShellService';

const props = defineProps({
  urlParams: {
    type: Object as PropType<CloudShellRequest>,
    default: () => ({}),
    required: true,
  },
  config: {
    type: Object as PropType<CloudShellSpec>,
    default: () => ({}),
  },
});

const emits = defineEmits(['update:terminal']);

const isLoading = ref(false);

const state = reactive<TerminalState>({
  shellName: props.urlParams.podName,
  urlParams: props.urlParams,
  config: props.config,
});

const handleCreate = async () => {
  isLoading.value = true;

  try {
    const { urlParams, config } = props;
    const res = await createCloudShell(urlParams, config);

    if (res.status?.accessURL) {
      await detectHtmlReadiness(`${res.shellUrl}/token`);

      state.metadataName = res.metadata?.name as string;
      state.shellUrl = res.shellUrl;

      emits('update:terminal', { ...state });
    } else {
      isLoading.value = false;
    }
  } catch {
    isLoading.value = false;
  }
};

onBeforeMount(() => {
  handleCreate();
});

const handleDelete = () => {
  if (state.metadataName) {
    deleteCloudShell(props.urlParams.namespace, state.metadataName);
  }
};

onBeforeUnmount(() => {
  handleDelete();
});

const iframeRef = ref();

const handleIframeLoaded = () => {
  isLoading.value = false;
  const operatorNode = iframeRef.value?.contentDocument?.querySelector?.('.terminal-operator');

  if (operatorNode) {
    operatorNode.style.display = 'none';
  }
};
</script>

<style lang="scss" scoped>
.cloud-shell__iframe {
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
  }
}

.cloud-shell__no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: var(--dao-gray-blue-080);

  .dao-empty {
    background-color: transparent;
  }
}
</style>
