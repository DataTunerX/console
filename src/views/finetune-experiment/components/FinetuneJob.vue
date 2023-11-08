<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import { useForm } from 'vee-validate';
import { string, object } from 'yup';
import { markRaw, onMounted } from 'vue';
import { FinetuneJob } from '@/api/finetune-job';
import { useNamespaceStore } from '@/stores/namespace';
import { useDataset } from '@/views/dataset/composition/create';
import { useHyperparameter } from '@/views/hyperparameter/composition/hyperparameter';
import { storeToRefs } from 'pinia';
import { useFinetuneJob, useLargeLanguageModel } from '../composition/finetune';

const { namespace } = storeToRefs(useNamespaceStore());

const { datasets, fetchDatasets } = useDataset();
const { hyperparameters, fetchHyperparameters } = useHyperparameter();

const { largeLanguageModels, fetchLargeLanguageModels } = useLargeLanguageModel();

onMounted(() => {
  Promise.all([fetchDatasets(namespace.value), fetchHyperparameters(namespace.value), fetchLargeLanguageModels(namespace.value)]);
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
        hyperparameter: string().required('请输入参数组'),
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

const emit = defineEmits<{(e: 'add', value: FinetuneJob): void }>();

const addJob = handleSubmit(() => {
  emit('add', values);
  handleReset();
});
</script>

<template>
  <div class="flex space-x-6">
    <dao-form>
      <dao-form-item-validate
        label="基础大模型"
        name="spec.finetune.llm"
        :tag="DaoSelect"
        required
      >
        <dao-option
          v-for="largeLanguageModel in largeLanguageModels"
          :key="largeLanguageModel.metadata?.name"
          :label="largeLanguageModel.metadata?.name"
          :value="largeLanguageModel.metadata?.name"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        label="数据集"
        name="spec.finetune.dataset"
        :tag="DaoSelect"
        required
      >
        <dao-option
          v-for="dataset in datasets"
          :key="dataset.metadata?.name"
          :label="dataset.metadata?.name"
          :value="dataset.metadata?.name"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        label="参数组"
        name="spec.finetune.hyperparameter"
        :tag="DaoSelect"
        required
      >
        <dao-option
          v-for="params in hyperparameters"
          :key="params.metadata.name"
          :label="params.metadata.name"
          :value="params.metadata.name"
        />
      </dao-form-item-validate>

      <dao-form-item>
        <dao-button
          block
          @click="addJob"
        >
          加个朋友
        </dao-button>
      </dao-form-item>
    </dao-form>
  </div>
</template>
