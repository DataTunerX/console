<script setup lang="ts">
import { watch, markRaw, PropType } from 'vue';
import { useForm } from 'vee-validate';
import { DaoSelect } from '@dao-style/core';
import {
  type Hyperparameter,
  Scheduler,
  Optimizer,
  TrainerType,
  Quantization,
} from '@/api/hyperparameter';
import { object, string, number } from 'yup';

const props = defineProps({
  origin: {
    type: Object as PropType<Hyperparameter>,
    required: true,
  },
});

// const emits = defineEmits<{(e: 'update:modelValue', value: string): void }>();

// 定义表单验证模式
const schema = markRaw(
  object({
    metadata: object({
      name: string().required().RFC1123Label(253).label('数据集名称'),
    }),
    spec: object({
      objective: object({
        type: string().required(),
      }),
      parameters: object({
        loRA_Alpha: number().required().moreThan(0),
        loRA_R: number().required().integer().moreThan(2),
        loRA_Dropout: number().required().moreThan(0).lessThan(1),
        learningRate: number().required().moreThan(0).lessThan(1),
        epochs: number().required().integer().moreThan(1),
        blockSize: number().required().integer().moreThan(8),
        batchSize: number().required().integer().moreThan(1),
        warmupRatio: number().required().moreThan(0).lessThan(1),
        weightDecay: number().required().moreThan(0).lessThan(1),
        gradAccSteps: number().required().integer().min(1),
      }),
    }),
  }),
);

// 获取超参数相关信息
// 表单处理
const { values, setValues } = useForm<Hyperparameter>({
  initialValues: props.origin,
  validationSchema: schema,
});

const updateQuantization = (val?: string) => {
  const valuesToUpdate = {
    spec: {
      parameters: {
        int4: val === Quantization.int4,
        int8: val === Quantization.int8,
      },
    },
  };

  setValues(valuesToUpdate);
};

const retrieveQuantization = () => {
  const { parameters } = props.origin.spec;
  let quantizationValue = Quantization.default;

  if (parameters.int4) {
    quantizationValue = Quantization.int4;
  } else if (parameters.int8) {
    quantizationValue = Quantization.int8;
  }

  setValues({
    spec: {
      parameters: {
        quantization: quantizationValue,
      },
    },
  });
};

watch(
  () => values.spec.parameters.quantization,
  (val?: string) => updateQuantization(val),
);

watch(
  () => props.origin,
  (val) => {
    retrieveQuantization();
    setValues({
      ...val,
    });
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<template>
  <dao-form
    type="vertical"
    label-width="180px"
  >
    <div class="parameter-group">
      <dao-form-item-validate
        :tag="DaoSelect"
        label="Scheduler"
        name="spec.parameters.scheduler"
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
        name="spec.parameters.optimizer"
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
        name="spec.parameters.FP16"
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
        name="spec.parameters.loRA_Alpha"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        label="LoRA_R"
        name="spec.parameters.loRA_R"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        label="LoRA_Dropout"
        name="spec.parameters.loRA_Dropout"
        :control-props="{
          type: 'number',
          step: 0.01,
        }"
      />

      <dao-form-item-validate
        :tag="DaoSelect"
        label="Int4/8"
        name="spec.parameters.quantization"
      >
        <dao-option
          label="默认"
          :value="Quantization.default"
        />
        <dao-option
          label="int4"
          :value="Quantization.int4"
        />
        <dao-option
          label="int8"
          :value="Quantization.int8"
        />
      </dao-form-item-validate>
    </div>

    <div class="parameter-group mt-[15px]">
      <dao-form-item-validate
        label="LearningRate"
        name="spec.parameters.learningRate"
        :control-props="{
          type: 'number',
          step: 0.01,
        }"
      />
      <dao-form-item-validate
        label="Epochs"
        name="spec.parameters.epochs"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        label="BlockSize"
        name="spec.parameters.blockSize"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        label="BatchSize"
        name="spec.parameters.batchSize"
        :control-props="{
          type: 'number',
          step: 1,
        }"
      />
      <dao-form-item-validate
        label="WarmupRatio"
        name="spec.parameters.warmupRatio"
        :control-props="{
          type: 'number',
          step: 0.01,
        }"
      />

      <dao-form-item-validate
        label="WeightDecay"
        name="spec.parameters.weightDecay"
        :control-props="{
          type: 'number',
          step: 0.01,
        }"
      />

      <dao-form-item-validate
        label="GradAccSteps"
        name="spec.parameters.gradAccSteps"
        :control-props="{
          type: 'number',
        }"
      />

      <dao-form-item-validate
        :tag="DaoSelect"
        label="TrainerType"
        name="spec.parameters.trainerType"
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
