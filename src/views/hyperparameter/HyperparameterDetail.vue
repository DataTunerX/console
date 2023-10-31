<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useNamespaceStore } from '@/stores/namespace';
import { Hyperparameter, getHyperparameter } from '@/api/hyperparameter';
import { useDateFormat } from '@dao-style/extend';
import { nError } from '@/utils/useNoty';

const router = useRouter();
const route = useRoute();
const namespaceStore = useNamespaceStore();

const hyperparameter = ref<Hyperparameter | null>(null);

// 获取超参数详细信息
const fetchDataset = async () => {
  try {
    const res = await getHyperparameter(namespaceStore.namespace, route.params.name as string);

    hyperparameter.value = res.data;
  } catch (error) {
    nError('获取超参数失败', error);
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
      label: '名称',
      value: name.value,
    },
    {
      label: '微调类型',
      value: data.spec.objective.type,
    },
    {
      label: '标签',
      value: data.metadata.labels,
      slotId: 'tag',
    },
    {
      label: '创建时间',
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
            label="参数集"
            :to="{ name: 'HyperparameterList' }"
          />
          <dao-breadcrumb-item :label="name" />
        </dao-breadcrumb>
      </template>
    </dao-header>

    <dao-card
      type="simple"
      title="基本信息"
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
      title="参数详情"
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
