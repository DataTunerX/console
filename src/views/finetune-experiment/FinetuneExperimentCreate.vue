<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import { useFieldArray, useForm } from 'vee-validate';
import { string, object } from 'yup';
import { markRaw, onMounted, ref } from 'vue';
import { FinetuneJob } from '@/api/finetune-job';
import { finetuneExperimentClient } from '@/api/finetune-experiment';
import { useNamespaceStore } from '@/stores/namespace';
import { storeToRefs } from 'pinia';
import { nError } from '@/utils/useNoty';
import { useRouter } from 'vue-router';
import { ElementRefType } from '@/types/common';
import FinetuneJobComponent from './components/FinetuneJob.vue';
import {
  useFinetuneExperiment,
  useFinetuneJob,
  useLargeLanguageModel,
  useScoringConfig,
} from './composition/finetune';
import { useDataset } from '../dataset/composition/create';
import { useHyperparameter } from '../hyperparameter/composition/hyperparameter';

const router = useRouter();

const { namespace } = storeToRefs(useNamespaceStore());

const { datasets, fetchDatasets } = useDataset();

const { largeLanguageModels, fetchLargeLanguageModels } = useLargeLanguageModel();

const { hyperparameters, fetchHyperparameters } = useHyperparameter();

const { finetuneExperiment } = useFinetuneExperiment();

const { scoringConfigs, fetchScoringConfigs } = useScoringConfig();

const { finetuneJob } = useFinetuneJob();

onMounted(() => {
  Promise.all([
    fetchLargeLanguageModels(namespace.value),
    fetchDatasets(namespace.value),
    fetchHyperparameters(namespace.value),
    fetchScoringConfigs(namespace.value),
  ]);
});

const validationSchema = markRaw(
  object({
    metadata: object({
      name: string().RFC1123Label().required('请输入实验名称'),
    }),
    spec: object({
      scoringConfig: object({
        name: string().required('请输入评估方式'),
      }),
    }),
  }),
);

const { values, validate } = useForm({
  initialValues: finetuneExperiment,
  validationSchema,
});

const { push, remove, fields: jobs } = useFieldArray<FinetuneJob>('spec.finetuneJobs');

const onAdd = () => {
  push(finetuneJob.value);
};

const toList = () => {
  router.push({
    name: 'FinetuneExperimentList',
  });
};

type ComponentRef = {
  validateEdit: () => Promise<boolean>;
} | null;

const jobsRef = ref<ElementRefType<ComponentRef>[]>([]);

const validateEdit = async () => {
  const jobsRes = await Promise.all(jobsRef.value.map((item) => (item as ComponentRef)?.validateEdit() ?? Promise.resolve(true)));

  return jobsRes.every((item) => item);
};

const onSubmit = async () => {
  const v = await validateEdit();

  if (v) {
    const valid = await validate();

    if (valid.valid) {
      try {
        await finetuneExperimentClient.create(namespace.value, values);
        toList();
      } catch (error) {
        nError('失败了', error);
      }
    }
  }
};
</script>

<template>
  <dao-modal-layout
    title="创建微调实验"
    @cancel="$router.back"
    @confirm="onSubmit"
  >
    <dao-form label-width="120px">
      <dao-form-group title="基本信息">
        <dao-form-item-validate
          label="实验名称"
          name="metadata.name"
          required
          :control-props="{
            class: 'input-form-width'
          }"
        />
        <dao-form-item-validate
          label="评估方式"
          name="spec.scoringConfig.name"
          :tag="DaoSelect"
          :control-props="{
            class: 'select-form-width'
          }"
        >
          <dao-option
            v-for="scoringConfig in scoringConfigs"
            :key="scoringConfig.metadata?.name"
            :label="scoringConfig.metadata?.name"
            :value="scoringConfig.metadata?.name"
          />
        </dao-form-item-validate>
      </dao-form-group>

      <dao-form-group title="配置">
        <dao-expansion type="box">
          <dao-expansion-item
            v-for="(job, idx) in jobs"
            :key="job.key"
            class="job-item relative"
            :name="`${job.key}`"
            :title="job.value.metadata?.name"
          >
            <FinetuneJobComponent
              :ref="($e: ElementRefType<ComponentRef>) => jobsRef[idx] = $e"
              v-model="job.value"
              :llms="largeLanguageModels"
              :datasets="datasets"
              :hyperparameters="hyperparameters"
            />
            <template #action>
              <dao-icon
                v-if="!job.value.valid"
                class="job-item-icon--error text-[18px] mr-[23px]"
                name="icon-sys-warning"
                use-font
              />
              <dao-icon
                class="mr-[3px] job-item__remove-btn"
                name="icon-close"
                use-font
                @click="remove(idx)"
              />
            </template>
          </dao-expansion-item>
        </dao-expansion>
        <dao-text-button
          class="mt-[20px]"
          :prop="{
            type:'action',
            iconLeft:'icon-add',
          }"
          @click="onAdd"
        >
          {{ $t('common.add') }}
        </dao-text-button>
      </dao-form-group>
    </dao-form>
  </dao-modal-layout>
</template>

<style lang="scss" scoped>
.job-item {
  &-icon--error {
    color: var(--dao-red-050);
    vertical-align: middle;
  }

  &-title {
    padding: 21px 0 11px;
    font-size: 14px;
    font-weight: 700;
    color: #363a42;

    &.port-title {
      padding-top: 11px;
    }
  }

  &__remove-btn {
    color: var(--dao-gray-blue-040);
  }
}
</style>
<style lang="scss" scoped>
$form-width: 400px;

:deep(.input-form-width.dao-input),
:deep(.select-form-width.dao-select) {
  width: $form-width;
}
</style>
