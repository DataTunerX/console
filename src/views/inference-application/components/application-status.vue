<script lang="ts" setup>
import { ApplicationStatus, Status as RayServiceStatus, ServiceStatus } from '@/api/ray-service';
import type { StateIconType } from '@dao-style/extend';
import { PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  rayServiceStatus: {
    type: Object as PropType<RayServiceStatus>,
    default: () => ({}),
  },
});

const { t } = useI18n();

interface StatusMap {
  text: string;
  type: StateIconType;
  icon?: string;
}

const serviceStatusMap: Record<string, StatusMap> = {
  [ServiceStatus.FailedToGetOrCreateRayCluster]: {
    text: t('views.InferenceApplication.serviceStatus.FailedToGetOrCreateRayCluster'),
    type: 'error',
    icon: 'icon-sys-error',
  },
  [ServiceStatus.WaitForDashboard]: {
    text: t('views.InferenceApplication.serviceStatus.WaitForDashboard'),
    type: 'warning',
  },
  [ServiceStatus.WaitForServeDeploymentReady]: {
    text: t('views.InferenceApplication.serviceStatus.WaitForServeDeploymentReady'),
    type: 'warning',
  },
  [ServiceStatus.FailedToGetServeDeploymentStatus]: {
    text: t('views.InferenceApplication.serviceStatus.FailedToGetServeDeploymentStatus'),
    type: 'error',
    icon: 'icon-sys-error',
  },
  [ServiceStatus.Running]: {
    text: t('views.InferenceApplication.serviceStatus.Running'),
    type: 'default',
  },
  [ServiceStatus.Restarting]: {
    text: t('views.InferenceApplication.serviceStatus.Restarting'),
    type: 'warning',
    icon: 'icon-minor',
  },
  [ServiceStatus.FailedToUpdateIngress]: {
    text: t('views.InferenceApplication.serviceStatus.FailedToUpdateIngress'),
    type: 'error',
    icon: 'icon-sys-error',
  },
  [ServiceStatus.FailedToUpdateServingPodLabel]: {
    text: t('views.InferenceApplication.serviceStatus.FailedToUpdateServingPodLabel'),
    type: 'error',
    icon: 'icon-sys-error',
  },
  [ServiceStatus.FailedToUpdateService]: {
    text: t('views.InferenceApplication.serviceStatus.FailedToUpdateService'),
    type: 'error',
    icon: 'icon-sys-error',
  },
};

const serviceStatus = computed(() => serviceStatusMap[props.rayServiceStatus.serviceStatus ?? 'unknown']);

const isServiceStatusRunning = computed(() => props.rayServiceStatus.serviceStatus === ServiceStatus.Running);

const statusMap: Record<string, StatusMap> = {
  [ApplicationStatus.NOT_STARTED]: {
    text: t('views.InferenceApplication.applicationStatus.NOT_STARTED'),
    type: 'default',
  },
  [ApplicationStatus.DEPLOYING]: {
    text: t('views.InferenceApplication.applicationStatus.DEPLOYING'),
    type: 'spin',
  },
  [ApplicationStatus.RUNNING]: {
    text: t('views.InferenceApplication.applicationStatus.RUNNING'),
    type: 'success',
  },
  [ApplicationStatus.DEPLOY_FAILED]: {
    text: t('views.InferenceApplication.applicationStatus.DEPLOY_FAILED'),
    type: 'error',
  },
  [ApplicationStatus.DELETING]: {
    text: t('views.InferenceApplication.applicationStatus.DELETING'),
    type: 'error',
  },
  [ApplicationStatus.UNHEALTHY]: {
    text: t('views.InferenceApplication.applicationStatus.UNHEALTHY'),
    type: 'warning',
  },
  unknown: {
    text: t('views.InferenceApplication.applicationStatus.unknown'),
    type: 'warning',
  },
};

const applicationStatus = (status?: string) => statusMap[status ?? 'unknown'];
</script>

<template>
  <template v-if="isServiceStatusRunning">
    <dao-state-icon
      v-for="(value, key) in rayServiceStatus?.activeServiceStatus?.applicationStatuses"
      :key="key"
      :type="applicationStatus(value.status).type"
    >
      {{ applicationStatus(value.status).text }}
    </dao-state-icon>
  </template>

  <dao-state-icon
    v-else
    :type="serviceStatus.type"
    :icon="serviceStatus.icon"
  >
    {{ serviceStatus.text }}
  </dao-state-icon>
</template>
