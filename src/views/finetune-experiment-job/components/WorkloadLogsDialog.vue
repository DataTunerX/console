<script lang="ts" setup>
import CloudShell from '@/components/cloud-shell/CloudShell.vue';
import { CommandType } from '@/components/cloud-shell/CloudShellService';
import { useNamespaceStore } from '@/stores/namespace';

const props = defineProps({
  podName: {
    type: String,
    required: true,
  },
  container: {
    type: String,
    required: true,
  },
});

const { namespace } = storeToRefs(useNamespaceStore());

defineEmits(['reject']);

/**
 * 全屏、取消全屏
 */
const isFullScreen = ref(false);

const handleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
};
</script>

<template>
  <dao-drawer
    :model-value="true"
    size="lg"
    :title="$t('components.dialogs.WorkloadLogsDialog.title')"
    :hide-footer="true"
    @close="$emit('reject')"
  >
    <div
      class="workload-logs__drawer-body"
      :class="[
        isFullScreen && 'workload-logs__fullscreen',
      ]"
    >
      <!-- tip: link insight -->
      <dao-message
        class="mb-[10px]"
        :is-close-show="false"
      >
        <template #default="{ className }">
          <div :class="className">
            {{ $t('components.dialogs.WorkloadLogsDialog.moreInfo') }}
          </div>
        </template>
      </dao-message>

      <!-- 日志搜索结果详情 -->
      <div class="workload-logs__detail">
        <div class="workload-logs__detail-tools">
          <!-- FIXME: When is fullscreen state, change the icon -->
          <dao-button
            type="secondary"
            icon-left="icon-model-view"
            use-font
            class="fullscreen-btn"
            @click="handleFullScreen"
            @keyup.enter="handleFullScreen"
          />
        </div>

        <cloud-shell
          :url-params="{
            type: CommandType.CommandTypeLogs,
            namespace,
            podName: props.podName,
            container: props.container
          }"
        />
      </div>
    </div>
  </dao-drawer>
</template>

<style lang="scss" scoped>
.workload-logs {
  &__drawer-body {
    display: flex;
    flex-direction: column;
    height: 100%;

    :deep(.dao-message-inner) {
      align-items: center;

      .dao-message-content {
        display: flex;
        align-items: center;
      }
    }
  }

  // 日志详情
  &__detail {
    position: relative;
    flex: 1;
    overflow: hidden;
    font-size: 13px;
    line-height: 18px;
    color: var(--dao-pure-white);
    background-color: var(--dao-pure-black);

    &-inner {
      position: relative;
      height: 100%;
      padding: 10px 20px;
      overflow: auto;
    }

    &-item {
      margin-top: 5px;
    }
  }

  &__detail-tools {
    position: absolute;
    top: 20px;
    right: 15px;
    z-index: 2;
    display: none;

    /* stylelint-disable-next-line no-descending-specificity */
    :deep(.dao-icon) {
      font-size: 16px;
      color: var(--dao-navigation-060);
      cursor: pointer;
      user-select: none;
    }

    .fullscreen-btn {
      padding: 0 6px;
    }
  }

  &__detail:hover {
    .workload-logs__detail-tools {
      display: block;
    }
  }

  // 全屏
  &__fullscreen {
    .workload-logs__detail {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100%;
    }
  }
}

</style>
