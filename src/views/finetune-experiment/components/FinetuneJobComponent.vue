<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import { Dataset } from '@/api/dataset';
import { Hyperparameter, Parameters } from '@/api/hyperparameter';
import { LargeLanguageModel } from '@/api/large-language-model';
import { PropType, watchEffect } from 'vue';
import { useField } from 'vee-validate';
import HyperParameterOverride from './HyperparameterOverride.vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  llms: {
    type: Array as PropType<Array<LargeLanguageModel>>,
    default: () => [],
    required: true,
  },
  datasets: {
    type: Array as PropType<Array<Dataset>>,
    default: () => [],
    required: true,
  },
  hyperparameters: {
    type: Array as PropType<Array<Hyperparameter>>,
    default: () => [],
    required: true,
  },
});

const hyperparametersMap = new Map();

watchEffect(() => {
  props.hyperparameters.forEach((hp) => {
    hyperparametersMap.set(hp.metadata.name, hp);
  });
});

const { value: overrides } = useField<Partial<Parameters>>(
  () => `${props.name}.spec.finetune.finetuneSpec.hyperparameter.overrides`,
);
const { value: hyperparameterRef } = useField<string>(
  () => `${props.name}.spec.finetune.finetuneSpec.hyperparameter.hyperparameterRef`,
);
</script>

<template>
  <dao-form-item-validate
    :label="$t('views.FinetuneExperiment.taskName')"
    :name="`${name}.name`"
    required
    :control-props="{
      class: 'input-form-width',
    }"
  />
  <dao-form-item-validate
    :label="$t('views.FinetuneExperiment.baseLargeModel')"
    :name="`${name}.spec.finetune.finetuneSpec.llm`"
    :tag="DaoSelect"
    required
    :control-props="{
      class: 'select-form-width',
    }"
  >
    <dao-option
      v-for="largeLanguageModel in props.llms"
      :key="largeLanguageModel.metadata?.name"
      :label="largeLanguageModel.metadata?.name"
      :value="largeLanguageModel.metadata?.name"
    />
  </dao-form-item-validate>
  <dao-form-item-validate
    :label="$t('views.FinetuneExperiment.dataset')"
    :name="`${name}.spec.finetune.finetuneSpec.dataset`"
    :tag="DaoSelect"
    required
    :control-props="{
      class: 'select-form-width',
    }"
  >
    <dao-option
      v-for="dataset in props.datasets"
      :key="dataset.metadata?.name"
      :label="dataset.metadata?.name"
      :value="dataset.metadata?.name"
    />
  </dao-form-item-validate>

  <dao-form-item-validate
    :label="$t('views.FinetuneExperiment.hyperparameter')"
    :name="`${name}.spec.finetune.finetuneSpec.hyperparameter.hyperparameterRef`"
    :tag="DaoSelect"
    required
    :control-props="{
      class: 'select-form-width',
    }"
  >
    <dao-option
      v-for="params in props.hyperparameters"
      :key="params.metadata.name"
      :label="params.metadata.name"
      :value="params.metadata.name"
    />
  </dao-form-item-validate>

  <dao-form-item v-if="hyperparameterRef">
    <HyperParameterOverride
      v-model:overrides="overrides"
      :name="`${name}.spec.finetune.finetuneSpec.hyperparameter.parameters`"
      :origin="hyperparametersMap.get(hyperparameterRef)"
    />
    <template #helper>
      <dao-helper-text>{{ $t('views.FinetuneExperiment.modifyHyperparameterGroup') }}</dao-helper-text>
    </template>
  </dao-form-item>
</template>

<style lang="scss" scoped>
$form-width: 400px;

:deep(.input-form-width.dao-input),
:deep(.select-form-width.dao-select) {
  width: $form-width;
}
</style>
