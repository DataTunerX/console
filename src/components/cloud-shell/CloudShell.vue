<template>
  <div
    v-if="state.accessUrl || isLoading"
    v-loading="isLoading"
    class="cloud-shell__iframe"
  >
    <iframe
      v-if="state.accessUrl"
      ref="iframeRef"
      title="cloud shell"
      :src="state.accessUrl"
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
  CloudShellRequest, TerminalState, createCloudShell, deleteCloudShell, detectCloudShellReady,
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
  shellName: '',
  urlParams: props.urlParams,
  config: props.config,
});

const handleCreate = async () => {
  isLoading.value = true;

  try {
    const { urlParams, config } = props;
    const res = await createCloudShell(urlParams, config);

    const accessUrl = await detectCloudShellReady(res.metadata?.namespace as string, res.metadata?.name as string);

    state.accessUrl = `http://${accessUrl}`;
    state.shellName = res.metadata?.name as string;

    emits('update:terminal', { ...state });
  } catch {
    isLoading.value = false;
  }
};

onBeforeMount(() => {
  handleCreate();
});

const handleDelete = () => {
  if (state.shellName) {
    deleteCloudShell(props.urlParams.namespace, state.shellName);
  }
};

onBeforeUnmount(() => {
  handleDelete();
});

const iframeRef = ref();

const handleIframeLoaded = () => {
  // FIXME: 现在跨域，这个隐藏不了
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
