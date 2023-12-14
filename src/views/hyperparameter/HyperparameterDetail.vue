<script setup lang="ts">
import { useDateFormat } from '@dao-style/extend';
import { useNamespaceStore } from '@/stores/namespace';
import filter from 'lodash/filter';
import { Theme } from '@/api/finetune-job';
import {
  retrieveQuantization,
  useDeleteHyperparameter,
  useHyperparameter,
} from './composition/hyperparameter';
import { useFinetuneJob } from '../finetune-experiment-job/composition/job';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const { namespace } = storeToRefs(useNamespaceStore());
const name = route.params.name as string;

const { hyperparameter, fetchHyperparameter } = useHyperparameter();

onBeforeMount(() => {
  fetchHyperparameter(namespace.value, name);
});

const { jobs, fetchJobs } = useFinetuneJob();

onBeforeMount(() => {
  fetchJobs(namespace.value);
});

const referenceJobs = computed<string[]>(() => {
  const data = filter(
    jobs.value,
    (job) => job.spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef === name,
  ).map((job) => job.metadata?.name);

  return data as string[];
});

// 基本信息
const infos = computed(() => {
  const data = hyperparameter.value;

  if (!data) return [];

  return [
    {
      label: t('views.Hyperparameter.name'),
      value: data.metadata.name,
    },
    {
      label: t('views.Hyperparameter.fineTuningType'),
      value: data.spec.objective.type,
    },
    {
      label: t('views.Hyperparameter.referencedTask'),
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
    [
      {
        label: 'Scheduler',
        value: params?.scheduler,
      },
      {
        label: 'Optimizer',
        value: params?.optimizer,
      },
      {
        label: 'FP16',
        value: `${params?.FP16}`,
      },
      {
        label: 'LoRA_Alpha',
        value: params?.loRA_Alpha,
      },
      {
        label: 'LoRA_R',
        value: params?.loRA_R,
      },
      {
        label: 'LoRA_Dropout',
        value: params?.loRA_Dropout,
      },
      {
        label: 'int4/8',
        value: t(`views.Hyperparameter.quantization.${retrieveQuantization(params)}`),
      },
    ],
    [
      {
        label: 'LearningRate',
        value: params.learningRate,
      },

      {
        label: 'Epochs',
        value: params?.epochs,
      },
      {
        label: 'BlockSize',
        value: params?.blockSize,
      },
      {
        label: 'BatchSize',
        value: params.batchSize,
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
    ],
  ];
});

const onEdit = () => {
  router.push({
    name: 'HyperparameterCreate',
    query: {
      name,
    },
  });
};

const toList = () => {
  router.push({
    name: 'HyperparameterList',
  });
};

const { onConfirmDelete } = useDeleteHyperparameter(namespace, toList);
</script>

<template>
  <div class="hyperparameter-detail console-main-container">
    <dao-header type="3rd">
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-cluster"
          :list="[
            {
              label: t('views.Hyperparameter.hyperparameterGroup'),
              to: { name: 'HyperparameterList' },
            },
            {
              value: name,
            },
          ]"
          @navigate="router.push"
        />
      </template>

      <template #action>
        <dao-dropdown placement="bottom-start">
          <template #default>
            <dao-button
              type="tertiary"
              icon-left="icon-more-horizontal"
              use-font
            />
          </template>
          <template #menu>
            <dao-dropdown-menu>
              <dao-dropdown-item @click="onEdit">
                {{ t("common.edit") }}
              </dao-dropdown-item>
              <dao-dropdown-item type="divider" />
              <dao-dropdown-item
                color="red"
                @click="onConfirmDelete(hyperparameter?.metadata.name)"
              >
                {{ t("common.delete") }}
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </template>
        </dao-dropdown>
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
              <dao-hover-card :data="referenceJobs">
                <template #item="{ text }">
                  <dao-label-extend :color="Theme">
                    {{ text }}
                  </dao-label-extend>
                </template>
              </dao-hover-card>
            </dao-key-value-layout-item>
          </template>
        </dao-key-value-layout>
      </dao-card-item>
    </dao-card>

    <div class="flex">
      <div class="flex-1 w-0">
        <dao-card
          type="simple"
          :title="t('views.Hyperparameter.parameterDetail')"
          class="mt-[16px]"
        >
          <dao-card-item>
            <dao-key-value-layout
              direction="vertical"
              :column="2"
              :data="parameters[0]"
            />
          </dao-card-item>
        </dao-card>
      </div>
      <div class="flex-1 ml-[20px]">
        <dao-card
          type="simple"
          title=""
          class="mt-[16px]"
        >
          <dao-card-item>
            <dao-key-value-layout
              direction="vertical"
              :column="2"
              :data="parameters[1]"
            />
          </dao-card-item>
        </dao-card>
      </div>
    </div>
  </div>
</template>
