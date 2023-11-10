<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import { useForm } from 'vee-validate';
import { string, object } from 'yup';
import {
  PropType, markRaw, watch, onBeforeMount,
} from 'vue';
import { Dataset } from '@/api/dataset';
import { LargeLanguageModel } from '@/api/large-language-model';
import { Hyperparameter } from '@/api/hyperparameter';
import { FinetuneJob } from '@/api/finetune-job';
import { isEqual } from 'lodash';
import { randomStr } from '@/utils/uid';
import HyperParameterOverride from './HyperparameterOverride.vue';

const props = defineProps({
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
  modelValue: {
    type: Object as PropType<FinetuneJob>,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue']);

const hyperparametersMap = new Map();

// eslint-disable-next-line no-restricted-syntax
for (const hp of props.hyperparameters) {
  hyperparametersMap.set(hp.metadata.name, hp);
}

const validationSchema = markRaw(
  object({
    metadata: object({
      name: string().required('请输入名称'),
    }),
    spec: object({
      finetune: object({
        finetuneSpec: object({
          llm: string().required(),
          hyperparameter: object({
            hyperparameterRef: string().required(),
          }),
          dataset: string().required(),
        }),
      }),
    }),
  }),
);

const { values, validate, setValues } = useForm<FinetuneJob>({
  initialValues: props.modelValue,
  validationSchema,
});

onBeforeMount(() => {
  setValues({
    metadata: {
      name: `finetune-job-${randomStr(5)}`,
    },
  });
});

watch(() => values, (newV) => {
  if (!isEqual(newV, props.modelValue)) {
    emits('update:modelValue', newV);
  }
}, {
  deep: true,
});

const validateEdit = async () => {
  const valid = await validate();

  setValues({
    valid: valid.valid,
  });

  return valid.valid;
};

defineExpose({
  validateEdit,
});
</script>

<template>
  <dao-form>
    <dao-form-item-validate
      label="任务名称"
      name="metadata.name"
      required
      :control-props="{
        class: 'input-form-width'
      }"
    />
    <dao-form-item-validate
      label="基础大模型"
      name="spec.finetune.finetuneSpec.llm"
      :tag="DaoSelect"
      required
      :control-props="{
        class: 'select-form-width'
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
      name="spec.finetune.finetuneSpec.dataset"
      :tag="DaoSelect"
      required
      :control-props="{
        class: 'select-form-width'
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
      name="spec.finetune.finetuneSpec.hyperparameter.hyperparameterRef"
      :tag="DaoSelect"
      required
      :control-props="{
        class: 'select-form-width'
      }"
    >
      <dao-option
        v-for="params in props.hyperparameters"
        :key="params.metadata.name"
        :label="params.metadata.name"
        :value="params.metadata.name"
      />
    </dao-form-item-validate>

    <dao-form-item v-if="values.spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef">
      <HyperParameterOverride
        :origin="hyperparametersMap.get(values.spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef)"
      />
      <template #helper>
        <dao-helper-text>
          修改超参组后，将会覆盖原有超参组的超参值。
        </dao-helper-text>
      </template>
    </dao-form-item>
  </dao-form>
</template>

<style lang="scss" scoped>
$form-width: 400px;

:deep(.input-form-width.dao-input),
:deep(.select-form-width.dao-select) {
  width: $form-width;
}
</style>
