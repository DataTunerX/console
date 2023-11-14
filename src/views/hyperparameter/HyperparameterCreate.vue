<!-- eslint-disable camelcase -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {
  computed, watch, onMounted, markRaw,
} from 'vue';
import { useForm } from 'vee-validate';
import { storeToRefs } from 'pinia';
import { DaoSelect } from '@dao-style/core';
import { object, string, number } from 'yup';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';
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
import { nError, nSuccess } from '@/utils/useNoty';
import { useNamespaceStore } from '@/stores/namespace';
import { retrieveQuantization, useHyperparameter } from './composition/hyperparameter';

const { namespace } = storeToRefs(useNamespaceStore());
const router = useRouter();
const { query } = useRoute();
const isUpdate = computed(() => !!query.name as boolean);
const { t } = useI18n();
const title = computed(() => (isUpdate.value ? t('views.Hyperparameter.update') : t('views.Hyperparameter.create')));

// 定义表单验证模式
const schema = markRaw(
  object({
    metadata: object({
      name: string().required().RFC1123Label(253).label(t('views.Dataset.datasetName')),
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

  const keys: (keyof StringParameters)[] = ['learningRate', 'loRA_Alpha', 'loRA_Dropout', 'loRA_R', 'warmupRatio', 'weightDecay'];

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

const resetQuantization = () => {
  const { parameters } = hyperparameter.value.spec;

  setValues({
    spec: {
      parameters: {
        quantization: retrieveQuantization(parameters),
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
    resetQuantization();
  }
});
</script>

<template>
  <dao-modal-layout
    :title="title"
    type="custom"
    padding-x="40px"
    @cancel="$router.back"
    @confirm="onSubmit"
  >
    <dao-form label-width="120px">
      <dao-form-group :title="t('views.Dataset.basicInformation')">
        <dao-form-item-validate
          :label="t('views.Hyperparameter.hyperparameterGroupName')"
          name="metadata.name"
          required
          :control-props="{
            disabled: isUpdate,
            class: 'input-form-width',
          }"
        />

        <dao-form-item-validate
          :tag="DaoSelect"
          :label="t('views.Hyperparameter.fineTuningType')"
          name="spec.objective.type"
          required
          :control-props="{
            disabled: isUpdate,
            class: 'select-form-width',
          }"
        >
          <dao-option
            v-for="fineTuning in FineTuningType"
            :key="fineTuning"
            :label="fineTuning"
            :value="fineTuning"
          />
        </dao-form-item-validate>
      </dao-form-group>
    </dao-form>

    <dao-form
      type="vertical"
      class="mt-[20px]"
    >
      <dao-form-group :title="t('views.Hyperparameter.configuration')">
        <div class="flex flex-wrap flex-col items-start">
          <div class="parameter-card mb-6">
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

              <!-- <dao-form-item-validate
                class="w-[240px]"
                label-width="0px"
                name="spec.parameters.PEFT"
                :tag="DaoCheckbox"
              >
                PEFT
              </dao-form-item-validate> -->
            </div>

            <div class="flex space-x-5">
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

            <div class="flex space-x-5">
              <dao-form-item-validate
                :tag="DaoSelect"
                label="Int4/8"
                name="spec.parameters.quantization"
                required
              >
                <dao-option
                  :label="t('common.default')"
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

              <dao-form-item-validate
                label="BlockSize"
                name="spec.parameters.blockSize"
                required
                :control-props="{
                  type: 'number',
                }"
              />
            </div>

            <div class="flex space-x-5">
              <dao-form-item-validate
                label="BatchSize"
                name="spec.parameters.batchSize"
                required
                :control-props="{
                  type: 'number',
                  step: 1,
                }"
              />

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
        </div>
      </dao-form-group>
    </dao-form>
  </dao-modal-layout>
</template>

<style lang="scss" scoped>
$form-width: 400px;

:deep(.input-form-width.dao-input),
:deep(.select-form-width.dao-select) {
  width: $form-width;
}

.parameter-card {
  display: inline-flex;
  flex-direction: column;
  padding: 20px 20px 0;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
