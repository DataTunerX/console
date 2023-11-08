<!-- eslint-disable camelcase -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {
  computed, watch, onMounted, markRaw,
} from 'vue';
import { useForm } from 'vee-validate';
import { useNamespaceStore } from '@/stores/namespace';
import { storeToRefs } from 'pinia';
import { nError, nSuccess } from '@/utils/useNoty';
import { DaoSelect } from '@dao-style/core';
import {
  type Hyperparameter,
  type StringParameters,
  FineTuningType,
  Scheduler,
  Optimizer,
  TrainerType,
  Quantization,
  hyperparameterClient,
} from '@/api/hyperparameter';
import { object, string, number } from 'yup';
import { cloneDeep } from 'lodash';
import { useHyperparameter } from '@/views/hyperparameter/composition/hyperparameter';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{(e: 'update:modelValue', value: string): void }>();

const { namespace } = storeToRefs(useNamespaceStore());
const router = useRouter();
const { query } = useRoute();
const isUpdate = computed(() => !!query.name as boolean);

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
const { hyperparameters, hyperparameter, fetchHyperparameters } = useHyperparameter();

// 表单处理
const {
  values: formModel,
  setValues,
  handleSubmit,
} = useForm<Hyperparameter>({
  initialValues: hyperparameter,
  validationSchema: schema,
});

const toList = () => {
  router.push({ name: 'HyperparameterList' });
};

const onSubmit = handleSubmit(async () => {
  const model: Hyperparameter = cloneDeep(formModel);

  const keys: (keyof StringParameters)[] = [
    'learningRate',
    'loRA_Alpha',
    'loRA_Dropout',
    'loRA_R',
    'warmupRatio',
    'weightDecay',
  ];

  keys.forEach((key) => {
    model.spec.parameters[key] = `${model.spec.parameters[key]}`;
  });

  try {
    if (isUpdate.value && model.metadata.name) {
      await hyperparameterClient.update(namespace.value, model.metadata.name, model);
    } else {
      await hyperparameterClient.create(namespace.value, model);
    }
    nSuccess('成功');
    toList();
  } catch (error) {
    nError('出错了', error);
  }
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
  const { parameters } = hyperparameter.value.spec;
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

// 监听表单字段 "quantization" 的变化
watch(
  () => formModel.spec.parameters.quantization,
  (val?: string) => updateQuantization(val),
);

watch(
  () => formModel.metadata.name,
  (val?: string) => emit('update:modelValue', val as string),
);

onMounted(async () => {
  fetchHyperparameters(namespace.value);
});
</script>

<template>
  <div class="flex space-x-6">
    <div class="flex-1">
      <dao-form-item-validate
        label="超参组"
        label-width="60px"
        name="metadata.name"
        :tag="DaoSelect"
        required
        :control-props="{
          class: '!w-full',
        }"
      >
        <dao-option
          v-for="params in hyperparameters"
          :key="params.metadata.name"
          :label="params.metadata.name"
          :value="params.metadata.name"
        />
      </dao-form-item-validate>
    </div>

    <div class="flex-1">
      <dao-form-item-validate
        label="超参组名称"
        label-width="90px"
        name="metadata.name"
        :control-props="{
          block: true
        }"
      />
    </div>
  </div>

  <dao-form type="vertical">
    <div class="flex flex-col">
      <div class="flex flex-1 space-x-5">
        <dao-form-item-validate
          :tag="DaoSelect"
          label="微调类型"
          name="spec.objective.type"
          required
          :control-props="{
            disabled: isUpdate,
          }"
        >
          <dao-option
            v-for="fineTuning in FineTuningType"
            :key="fineTuning"
            :label="fineTuning"
            :value="fineTuning"
          />
        </dao-form-item-validate>

        <dao-form-item-validate
          :tag="DaoSelect"
          label="Scheduler"
          name="spec.parameters.scheduler"
          required
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
          required
        >
          <dao-option
            v-for="n in Optimizer"
            :key="n"
            :label="n"
            :value="n"
          />
        </dao-form-item-validate>

        <!-- <dao-form-item-validate
                class="w-[240px]"
                label-width="0px"
                name="spec.parameters.PEFT"
                :tag="DaoCheckbox"
              >
                PEFT
              </dao-form-item-validate> -->
      </div>

      <div class="flex flex-1 space-x-5">
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
          required
          :control-props="{
            type: 'number',
          }"
        />

        <dao-form-item-validate
          label="LoRA_R"
          name="spec.parameters.loRA_R"
          required
          :control-props="{
            type: 'number',
          }"
        />
      </div>

      <div class="flex flex-1 space-x-5">
        <dao-form-item-validate
          label="LoRA_Dropout"
          name="spec.parameters.loRA_Dropout"
          required
          :control-props="{
            type: 'number',
            step: 0.01,
          }"
        />

        <dao-form-item-validate
          :tag="DaoSelect"
          label="Int4/8"
          name="spec.parameters.quantization"
          required
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

        <dao-form-item-validate
          label="LearningRate"
          name="spec.parameters.learningRate"
          required
          :control-props="{
            type: 'number',
            step: 0.01,
          }"
        />
      </div>

      <div class="flex flex-1 space-x-5">
        <dao-form-item-validate
          label="Epochs"
          name="spec.parameters.epochs"
          required
          :control-props="{
            type: 'number',
          }"
        />

        <dao-form-item-validate
          label="BlockSize"
          name="spec.parameters.blockSize"
          required
          :control-props="{
            type: 'number',
          }"
        />

        <dao-form-item-validate
          label="BatchSize"
          name="spec.parameters.batchSize"
          required
          :control-props="{
            type: 'number',
            step: 1,
          }"
        />
      </div>

      <div class="flex flex-1 space-x-5">
        <dao-form-item-validate
          label="WarmupRatio"
          name="spec.parameters.warmupRatio"
          required
          :control-props="{
            type: 'number',
            step: 0.01,
          }"
        />

        <dao-form-item-validate
          label="WeightDecay"
          name="spec.parameters.weightDecay"
          required
          :control-props="{
            type: 'number',
            step: 0.01,
          }"
        />

        <dao-form-item-validate
          label="GradAccSteps"
          name="spec.parameters.gradAccSteps"
          required
          :control-props="{
            type: 'number',
          }"
        />
      </div>

      <div class="flex flex-1 space-x-5">
        <dao-form-item-validate
          :tag="DaoSelect"
          label="TrainerType"
          name="spec.parameters.trainerType"
          required
        >
          <dao-option
            v-for="n in TrainerType"
            :key="n"
            :label="n"
            :value="n"
          />
        </dao-form-item-validate>

        <dao-form-item class="flex-1" />
        <dao-form-item class="flex-1" />
      </div>
    </div>
  </dao-form>
</template>

<style lang="scss" scoped>
:deep(.dao-form-item){
  flex: 1;
}

:deep(.dao-input-wrapper) {
  width: 100%;

  .dao-input-wrapper {
    width: 100%;
  }

  .dao-input-inner {
    width: 100%;
  }
}

:deep(.dao-input) ,
:deep(.dao-select) {
  width: 100%;
}
</style>
