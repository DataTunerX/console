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
import { DaoCheckbox, DaoSelect } from '@dao-style/core';
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
import { useHyperparameter } from './composition/hyperparameter';

const { namespace } = storeToRefs(useNamespaceStore());
const router = useRouter();
const { query } = useRoute();
const isUpdate = computed(() => !!query.name as boolean);
const title = computed(() => (isUpdate.value ? '更新参数组' : '创建参数组'));

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
const { hyperparameter, fetchHyperparameter } = useHyperparameter();

// 表单处理
const {
  values: formModel,
  setValues,
  handleSubmit,
  resetForm,
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

// 处理更新和创建超参数的逻辑
onMounted(async () => {
  if (isUpdate.value) {
    await fetchHyperparameter(namespace.value, query.name as string);
    resetForm({ values: hyperparameter.value });
    retrieveQuantization();
  }
});
</script>

<template>
  <dao-modal-layout
    :title="title"
    @cancel="$router.back"
    @confirm="onSubmit"
  >
    <dao-form>
      <dao-form-group title="基本信息">
        <div class="flex space-x-6">
          <dao-form-item-validate
            label="参数组名称"
            name="metadata.name"
            required
            :control-props="{
              disabled: isUpdate,
            }"
          />

          <dao-form-item-validate
            :tag="DaoSelect"
            label="微调类型"
            name="spec.objective.type"
            required
          >
            <dao-option
              v-for="fineTuning in FineTuningType"
              :key="fineTuning"
              :label="fineTuning"
              :value="fineTuning"
            />
          </dao-form-item-validate>
        </div>
      </dao-form-group>
    </dao-form>

    <dao-form
      type="vertical"
      class="mt-[20px]"
    >
      <dao-form-group title="参数配置">
        <div class="parameter-card mr-6 mb-6">
          <div class="flex space-x-5">
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
          </div>

          <div class="flex space-x-5">
            <!-- <dao-form-item-validate
              class="w-[240px]"
              label-width="0px"
              name="spec.parameters.PEFT"
              :tag="DaoCheckbox"
            >
              PEFT
            </dao-form-item-validate> -->

            <dao-form-item-validate
              label-width="0px"
              name="spec.parameters.FP16"
              :tag="DaoCheckbox"
            >
              FP16
            </dao-form-item-validate>
          </div>

          <div class="flex space-x-5">
            <dao-form-item-validate
              :tag="DaoSelect"
              label="int4/8"
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
              label="LoRA_Alpha"
              name="spec.parameters.loRA_Alpha"
              required
              :control-props="{
                type: 'number',
              }"
            />
          </div>

          <div class="flex space-x-5">
            <dao-form-item-validate
              label="LoRA_R"
              name="spec.parameters.loRA_R"
              required
              :control-props="{
                type: 'number',
              }"
            />

            <dao-form-item-validate
              label="LoRA_Dropout"
              name="spec.parameters.loRA_Dropout"
              required
              :control-props="{
                type: 'number',
                step: 0.01,
              }"
            />
          </div>
        </div>

        <div class="parameter-card">
          <div class="flex space-x-5">
            <dao-form-item-validate
              label="LearningRate"
              name="spec.parameters.learningRate"
              required
              :control-props="{
                type: 'number',
                step: 0.01,
              }"
            />

            <dao-form-item-validate
              label="Epochs"
              name="spec.parameters.epochs"
              required
              :control-props="{
                type: 'number',
              }"
            />
          </div>
          <div class="flex space-x-5">
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

          <div class="flex space-x-5">
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
          </div>

          <div class="flex space-x-5">
            <dao-form-item-validate
              label="GradAccSteps"
              name="spec.parameters.gradAccSteps"
              required
              :control-props="{
                type: 'number',
              }"
            />

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
          </div>
        </div>
      </dao-form-group>
    </dao-form>
  </dao-modal-layout>
</template>

<style lang="scss" scoped>
.parameter-card {
  display: inline-flex;
  flex-direction: column;
  padding: 20px 20px 0;
  border: 1px solid #aab0b8;
  border-radius: 15px;
}
</style>
