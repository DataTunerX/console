<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import { useField, useForm } from 'vee-validate';
import { string, object } from 'yup';
import { markRaw, onMounted } from 'vue';
import { FinetuneJob } from '@/api/finetune-job';
import { useNamespaceStore } from '@/stores/namespace';
import { useDataset } from '@/views/dataset/composition/create';
import { storeToRefs } from 'pinia';
import { useFinetuneJob, useLargeLanguageModel } from '../composition/finetune';
import HyperparameterCreate from './HyperparameterCreate.vue';

const { namespace } = storeToRefs(useNamespaceStore());

const { datasets, fetchDatasets } = useDataset();

const { largeLanguageModels, fetchLargeLanguageModels } = useLargeLanguageModel();

onMounted(() => {
  Promise.all([
    fetchDatasets(namespace.value),
    fetchLargeLanguageModels(namespace.value),
  ]);
});

const { finetuneJob } = useFinetuneJob();

const validationSchema = markRaw(
  object({
    metadata: object({
      name: string().required('请输入名称'),
    }),
    spec: object({
      finetune: object({
        dataset: string().required('请输入数据集'),
        hyperparameter: string().required('请输入超参组'),
        llm: string().required('请输入大模型'),
      }),
      serveConfig: object({
        nodeSelector: string().required('请输入节点选择器'),
      }),
    }),
  }),
);

const { values, handleSubmit, handleReset } = useForm({
  initialValues: finetuneJob,
  validationSchema,
});

const hyperparameter = useField<string>('spec.finetune.hyperparameter');

const emit = defineEmits<{(e: 'add', value: FinetuneJob): void }>();

const addJob = handleSubmit(() => {
  emit('add', values);
  handleReset();
});
</script>

<template>
  <div class="fine-tune-job flex space-x-6">
    <dao-form class="flex-1">
      <div class="form-item__card mb-[20px]">
        <dao-form-item-validate
          label="基础大模型"
          label-width="100px"
          name="spec.finetune.llm"
          :tag="DaoSelect"
          required
          :control-props="{
            class: '!w-full',
          }"
        >
          <dao-option
            v-for="largeLanguageModel in largeLanguageModels"
            :key="largeLanguageModel.metadata?.name"
            :label="largeLanguageModel.metadata?.name"
            :value="largeLanguageModel.metadata?.name"
          />
        </dao-form-item-validate>
      </div>

      <div class="form-item__card flex flex-col mb-[20px]">
        <HyperparameterCreate v-model="hyperparameter.value.value" />
      </div>

      <dao-button
        block
        @click="addJob"
      >
        添加任务
      </dao-button>
    </dao-form>
    <div class="flex-1 flex flex-col">
      <div class="form-item__card mb-[20px]">
        <dao-form-item-validate
          label="数据集"
          label-width="80px"
          name="spec.finetune.dataset"
          :tag="DaoSelect"
          required
          :control-props="{
            class: '!w-full',
          }"
        >
          <dao-option
            v-for="dataset in datasets"
            :key="dataset.metadata?.name"
            :label="dataset.metadata?.name"
            :value="dataset.metadata?.name"
          />
        </dao-form-item-validate>
      </div>

      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fine-tune-job {
  // max-width: 1000px;
}
</style>
