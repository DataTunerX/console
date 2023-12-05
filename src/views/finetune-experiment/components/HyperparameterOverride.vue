<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import {
  type Hyperparameter,
  type Parameters,
  Scheduler,
  Optimizer,
  TrainerType,
  Quantization,
  StringParameters,
} from '@/api/hyperparameter';
import { retrieveQuantization } from '@/views/hyperparameter/composition/hyperparameter';
import { diff } from '@/utils/diff';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  origin: {
    type: Object as PropType<Hyperparameter>,
    required: true,
  },

  overrides: {
    type: Object as PropType<Partial<Parameters>>,
    required: true,
  },
});

const { resetField, value } = useField<Parameters>(() => props.name);

const { setValue: setInt4Value } = useField(() => `${props.name}.int4`);
const { setValue: setInt8Value } = useField(() => `${props.name}.int8`);

// const { meta } = useField(() => `${props.name}.scheduler`);
const schedulerRef = ref();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateQuantization = (val: any) => {
  const q = val as Quantization;

  setInt4Value(q === Quantization.int4);
  setInt8Value(q === Quantization.int8);
};

watch(
  () => props.origin,
  (val) => {
    resetField({
      value: {
        ...val?.spec.parameters,
        quantization: retrieveQuantization(val.spec.parameters),
      },
    });
  },
  {
    deep: true,
    immediate: true,
  },
);

const emits = defineEmits(['update:overrides']);

watch(
  () => value.value,
  (newParams) => {
    const overrides = diff(props.origin.spec.parameters, newParams);

    const keys: (keyof StringParameters)[] = [
      'learningRate',
      'loRA_Alpha',
      'loRA_Dropout',
      'loRA_R',
      'warmupRatio',
      'weightDecay',
    ];

    keys
      .filter((k) => overrides[k])
      .forEach((key) => {
        overrides[key] = `${overrides[key]}`;
      });

    emits('update:overrides', overrides);
  },
  {
    deep: true,
  },
);
</script>

<template>
  <dao-form type="vertical">
    <div class="parameter-group">
      <dao-form-item-validate
        ref="schedulerRef"
        :tag="DaoSelect"
        label="Scheduler"
        :name="`${name}.scheduler`"
      >
        <dao-option
          v-for="n in Scheduler"
          :key="n"
          :label="n"
          :value="n"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        :tag="DaoSelect"
        label="Optimizer"
        :name="`${name}.optimizer`"
      >
        <dao-option
          v-for="n in Optimizer"
          :key="n"
          :label="n"
          :value="n"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        label="FP16"
        :name="`${name}.FP16`"
        :tag="DaoSelect"
      >
        <dao-option
          :value="true"
          label="True"
        >
          True
        </dao-option>
        <dao-option
          :value="false"
          label="False"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        label="LoRA_Alpha"
        :name="`${name}.loRA_Alpha`"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        label="LoRA_R"
        :name="`${name}.loRA_R`"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        label="LoRA_Dropout"
        :name="`${name}.loRA_Dropout`"
        :control-props="{
          type: 'number',
          step: 0.01,
        }"
      />

      <dao-form-item-validate
        :tag="DaoSelect"
        label="Int4/8"
        :name="`${name}.quantization`"
        @change="updateQuantization"
      >
        <dao-option
          v-for="q in Quantization"
          :key="q"
          :label="q"
          :value="q"
        />
      </dao-form-item-validate>
    </div>

    <div class="parameter-group mt-[15px]">
      <dao-form-item-validate
        label="Learning Rate"
        :name="`${name}.learningRate`"
        :control-props="{
          type: 'number',
          step: 0.01,
        }"
      />
      <dao-form-item-validate
        label="Epochs"
        :name="`${name}.epochs`"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        label="BlockSize"
        :name="`${name}.blockSize`"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        label="BatchSize"
        :name="`${name}.batchSize`"
        :control-props="{
          type: 'number',
          step: 1,
        }"
      />
      <dao-form-item-validate
        label="WarmupRatio"
        :name="`${name}.warmupRatio`"
        :control-props="{
          type: 'number',
          step: 0.01,
        }"
      />

      <dao-form-item-validate
        label="WeightDecay"
        :name="`${name}.weightDecay`"
        :control-props="{
          type: 'number',
          step: 0.01,
        }"
      />

      <dao-form-item-validate
        label="GradAccSteps"
        :name="`${name}.gradAccSteps`"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        :tag="DaoSelect"
        label="TrainerType"
        :name="`${name}.trainerType`"
      >
        <dao-option
          v-for="n in TrainerType"
          :key="n"
          :label="n"
          :value="n"
        />
      </dao-form-item-validate>
    </div>
  </dao-form>
</template>

<style lang="scss" scoped>
:deep(.dao-form-item) {
  margin-left: 20px;
}

.parameter-group {
  display: flex;
  flex-wrap: wrap;
  padding-top: 15px;
  border: 1px dashed var(--dao-gray-blue-050);
  border-radius: 10px;
}
</style>
