<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import { Dataset } from '@/api/dataset';
import { FinetuneJob } from '@/api/finetune-job';
import { Hyperparameter, Parameters } from '@/api/hyperparameter';
import { LargeLanguageModel } from '@/api/large-language-model';
import { PropType } from 'vue';
import { useField } from 'vee-validate';
import HyperParameterOverride from './HyperparameterOverride.vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object as PropType<FinetuneJob>,
    required: true,
  },
  llms: {
    type: Array as PropType<Array<LargeLanguageModel>>,
    required: true,
  },
  datasets: {
    type: Array as PropType<Array<Dataset>>,
    required: true,
  },
  hyperparameters: {
    type: Array as PropType<Array<Hyperparameter>>,
    required: true,
  },

});

const hyperparametersMap = new Map();

// eslint-disable-next-line no-restricted-syntax
for (const hp of props.hyperparameters) {
  hyperparametersMap.set(hp.metadata.name, hp);
}

const { value: overrides } = useField<Partial<Parameters>>(() => `${props.name}.spec.finetune.finetuneSpec.hyperparameter.overrides`);

</script>

<template>
  <dao-form-item-validate
    label="任务名称"
    :name="`${name}.metadata.name`"
    required
    :control-props="{
      class: 'input-form-width',
    }"
  />
  <dao-form-item-validate
    label="基础大模型"
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
    label="数据集"
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
    label="超参组"
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

  <dao-form-item v-if="props.modelValue.spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef">
    <HyperParameterOverride
      v-model:overrides="overrides"
      :name="`${name}.spec.finetune.finetuneSpec.hyperparameter.parameters`"
      :origin="
        hyperparametersMap.get(
          props.modelValue.spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef
        )
      "
    />
    <template #helper>
      <dao-helper-text> 修改超参组后，将会覆盖原有超参组的超参值。 </dao-helper-text>
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
