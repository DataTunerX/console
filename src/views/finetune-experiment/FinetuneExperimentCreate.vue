<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import { useFieldArray, useForm } from 'vee-validate';
import { string, object } from 'yup';
import { computed, markRaw } from 'vue';
import { FinetuneJob } from '@/api/finetune-job';
import { finetuneExperimentClient } from '@/api/finetune-experiment';
import { useNamespaceStore } from '@/stores/namespace';
import { storeToRefs } from 'pinia';
import { nError } from '@/utils/useNoty';
import { useRouter } from 'vue-router';
import FinetuneJobComponent from './components/FinetuneJob.vue';
import { useFinetuneExperiment, useScoringConfig } from './composition/finetune';

const router = useRouter();

const { namespace } = storeToRefs(useNamespaceStore());

const { finetuneExperiment } = useFinetuneExperiment();

const { scoringConfigs, fetchScoringConfigs } = useScoringConfig();

fetchScoringConfigs(namespace.value);

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

const { values, handleSubmit } = useForm({
  initialValues: finetuneExperiment,
  validationSchema,
});

const { push, remove } = useFieldArray<FinetuneJob>('spec.finetuneJobs');

const onAdd = (val: FinetuneJob) => {
  push(val);
};

const jobs = computed(() => values.spec?.finetuneJobs.map((job) => {
  const { metadata, spec } = job;
  const name = metadata?.name;
  const finetune = spec?.finetune;
  const llm = finetune?.llm;
  const dataset = finetune?.dataset;
  const hyperparameter = finetune?.hyperparameter;

  return {
    name,
    llm,
    dataset,
    hyperparameter,
  };
}));

const columns = computed(() => [
  {
    id: 'name',
    header: '任务名称',
  },
  {
    id: 'llm',
    header: '基础大模型',
  },
  {
    id: 'dataset',
    header: '数据集',
  },
  {
    id: 'hyperparameter',
    header: '参数组',
  },
  {
    id: 'action',
    header: '',
    defaultWidth: '60px',
  },
]);

const toList = () => {
  router.push({
    name: 'FinetuneExperimentList',
  });
};

const onSubmit = handleSubmit(async () => {
  try {
    await finetuneExperimentClient.create(namespace.value, values);
    toList();
  } catch (error) {
    nError('失败了', error);
  }
});

</script>

<template>
  <dao-modal-layout
    title="创建微调实验"
    @cancel="$router.back"
    @confirm="onSubmit"
  >
    <dao-form>
      <dao-form-group title="基本信息">
        <dao-form-item-validate
          label="实验名称"
          name="metadata.name"
          required
        />
        <dao-form-item-validate
          label="评估方式"
          name="spec.scoringConfig.name"
          :tag="DaoSelect"
        >
          <dao-option
            v-for="scoringConfig in scoringConfigs"
            :key="scoringConfig.metadata?.name"
            :label="scoringConfig.metadata?.name"
            :value="scoringConfig.metadata?.name"
          />
        </dao-form-item-validate>
      </dao-form-group>

      <dao-form-group title="任务">
        <div class="flex space-x-6">
          <FinetuneJobComponent @add="onAdd" />
          <dao-table
            class="flex-1"
            :data="jobs"
            :columns="columns"
          >
            <template #td-action="{ rowIndex }">
              <dao-text-button
                :prop="{
                  type: 'default',
                  icon: 'icon-close',
                }"
                class="text-button__delete"
                @click="remove(rowIndex)"
              />
            </template>
          </dao-table>
        </div>
      </dao-form-group>
    </dao-form>
  </dao-modal-layout>
</template>
