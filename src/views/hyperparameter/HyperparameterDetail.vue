<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useDateFormat } from '@dao-style/extend';
import { useI18n } from 'vue-i18n';
import { useNamespaceStore } from '@/stores/namespace';
import { Hyperparameter, hyperparameterClient } from '@/api/hyperparameter';
import { nError } from '@/utils/useNoty';

const router = useRouter();
const route = useRoute();
const namespaceStore = useNamespaceStore();
const { t } = useI18n();

const hyperparameter = ref<Hyperparameter | null>(null);

// 获取超参数详细信息
const fetchDataset = async () => {
  try {
    const res = await hyperparameterClient.read(namespaceStore.namespace, route.params.name as string);

    hyperparameter.value = res.data;
  } catch (error) {
    nError(
      t('common.notyError', {
        name: t('common.fetch'),
        action: t('views.Hyperparameter.hyperparameterGroup'),
      }),
      error,
    );
  }
};

fetchDataset();

const name = computed(() => hyperparameter.value?.metadata.name);

// 基本信息
const infos = computed(() => {
  const data = hyperparameter.value;

  if (!data) return [];

  return [
    {
      label: t('views.Hyperparameter.name'),
      value: name.value,
    },
    {
      label: t('views.Hyperparameter.fineTuningType'),
      value: data.spec.objective.type,
    },
    {
      label: t('views.Dataset.tag'),
      value: data.metadata.labels,
      slotId: 'tag',
    },
    {
      label: t('common.createTime'),
      value: useDateFormat(data.metadata.creationTimestamp),
    },
  ];
});

// 参数详情
const parameters = computed(() => {
  const params = hyperparameter.value?.spec.parameters;

  if (!params) return [];

  return [
    {
      label: 'BatchSize',
      value: params.batchSize,
    },
    {
      label: 'LearningRate',
      value: params.learningRate,
    },
    {
      label: 'BlockSize',
      value: params?.blockSize,
    },
    {
      label: 'Epochs',
      value: params?.epochs,
    },
    {
      label: 'Scheduler',
      value: params?.scheduler,
    },
    {
      label: 'Optimizer',
      value: params?.optimizer,
    },
    {
      label: 'int4',
      value: `${params?.int4}`,
    },
    {
      label: 'int8',
      value: `${params?.int8}`,
    },
    {
      label: 'LoRA_R',
      value: params?.loRA_R,
    },
    {
      label: 'LoRA_Alpha',
      value: params?.loRA_Alpha,
    },
    {
      label: 'LoRA_Dropout',
      value: params?.loRA_Dropout,
    },
    {
      label: 'WarmupRatio',
      value: params?.warmupRatio,
    },
    {
      label: 'WeightDecay',
      value: params?.weightDecay,
    },
    {
      label: 'GradAccSteps',
      value: params?.gradAccSteps,
    },
    {
      label: 'TrainerType',
      value: params?.trainerType,
    },
    {
      label: 'FP16',
      value: `${params?.FP16}`,
    },
  ];
});

// 获取标签字符串数组
const getLabels = (row?: Record<string, string> | null) => {
  if (!row) return [];

  return Object.entries(row).map(([key, value]) => `${key}:${value}`);
};

const onEdit = () => {
  router.push({
    name: 'HyperparameterCreate',
    query: {
      name: name.value,
    },
  });
};
</script>

<template>
  <div class="hyperparameter-detail console-main-container">
    <dao-header type="3rd">
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-cluster"
          @navigate="router.push"
        >
          <dao-breadcrumb-item
            :label="t('views.Hyperparameter.parameterSet')"
            :to="{ name: 'HyperparameterList' }"
          />
          <dao-breadcrumb-item :label="name" />
        </dao-breadcrumb>
      </template>

      <template #action>
        <dao-button
          type="tertiary"
          @click="onEdit"
        >
          {{ t('common.edit') }}
        </dao-button>
      </template>
    </dao-header>

    <dao-card
      type="simple"
      :title="t('views.Dataset.basicInformation')"
    >
      <dao-card-item>
        <dao-key-value-layout
          direction="vertical"
          :column="4"
          :data="infos"
        >
          <template #kv-tag="{ row }">
            <dao-key-value-layout-item :label="row.label">
              <dao-hover-card :data="getLabels(row.value as Record<string, string> | null)" />
            </dao-key-value-layout-item>
          </template>
        </dao-key-value-layout>
      </dao-card-item>
    </dao-card>

    <dao-card
      type="simple"
      :title="t('views.Hyperparameter.parameterDetail')"
      class="mt-[16px]"
    >
      <dao-card-item>
        <dao-key-value-layout
          direction="vertical"
          :column="4"
          :data="parameters"
        />
      </dao-card-item>
    </dao-card>
  </div>
</template>
