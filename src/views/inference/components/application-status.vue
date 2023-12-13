<script lang="ts" setup>
import { ActiveServiceStatusApplicationStatus } from '@/api/ray-service';
import type { StateIconType } from '@dao-style/extend';
import { PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';

enum ApplicationStatus {
  NOT_STARTED = 'NOT_STARTED',
  DEPLOYING = 'DEPLOYING',
  RUNNING = 'RUNNING',
  DEPLOY_FAILED = 'DEPLOY_FAILED',
  DELETING = 'DELETING',
  UNHEALTHY = 'UNHEALTHY',
  UNKNOWN = 'UNKNOWN',
}

const props = defineProps({
  applicationStatus: {
    type: Object as PropType<ActiveServiceStatusApplicationStatus>,
    default: () => ({}),
  },
});

const { t } = useI18n();

interface ApplicationStatusMap {
  text: string;
  type: StateIconType;
}

const statusMap: Record<string, ApplicationStatusMap> = {
  [ApplicationStatus.NOT_STARTED]: {
    text: t('views.Inference.status.NOT_STARTED'),
    type: 'default',
  },
  [ApplicationStatus.DEPLOYING]: {
    text: t('views.Inference.status.DEPLOYING'),
    type: 'spin',
  },
  [ApplicationStatus.RUNNING]: {
    text: t('views.Inference.status.RUNNING'),
    type: 'success',
  },
  [ApplicationStatus.DEPLOY_FAILED]: {
    text: t('views.Inference.status.DEPLOY_FAILED'),
    type: 'error',
  },
  [ApplicationStatus.DELETING]: {
    text: t('views.Inference.status.DELETING'),
    type: 'error',
  },
  [ApplicationStatus.UNHEALTHY]: {
    text: t('views.Inference.status.UNHEALTHY'),
    type: 'warning',
  },
  unknown: {
    text: t('views.Inference.status.unknown'),
    type: 'warning',
  },
};

const curStatus = computed(() => statusMap[props.applicationStatus.status ?? 'unknown']);

</script>

<template>
  <dao-state-icon :type="curStatus.type">
    {{ curStatus.text }}
  </dao-state-icon>
</template>
