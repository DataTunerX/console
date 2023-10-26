<script lang="ts" setup>
import { DaoCheckbox, DaoSelect } from '@dao-style/core';
import { useForm } from 'vee-validate';
import { SchedulerType, OptimizerType, TrainerType } from '@/types/createHyperparameter';
import { type Hyperparameter } from '@/api/hyperparameter';
import { object, string, number } from 'yup';
import { markRaw } from 'vue';
import { useHyperparameter } from './composition/hyperparameter';

const schema = markRaw(object({
  metadata: object({
    name: string().required().RFC1123Label(253).label('数据集名称'),
  }),
  spec: object({
    objective: object({
      type: string().required(),
    }),
    parameters: object({
      loRA_Alpha: number().required().min(0),
      loRA_R: number().required().integer().min(3),
      loRA_Dropout: number().required().min(0)
        .max(1),
      learningRate: number().required().min(0)
        .max(1),
      epochs: number().required().integer().min(2),
      blockSize: number().required().integer().min(9),
      batchSize: number().required().integer().min(2),
      warmupRatio: number().required().min(0).max(1),
      weightDecay: number().required().min(0).max(1),
      gradAccSteps: number().required().integer().min(1),
    }),
  }),
}));

const { hyperparameter } = useHyperparameter();

useForm<Hyperparameter>({
  initialValues: hyperparameter,
  validationSchema: schema,
});

// const onSubmit = handleSubmit(async () => {
//   console.log('onSubmit');
// });

</script>

<template>
  <dao-modal-layout
    title="创建参数组"
    @cancel="$router.back"
  >
    <dao-form>
      <dao-form-group title="基本信息">
        <div class="flex space-x-6">
          <dao-form-item-validate
            label="参数组名称"
            name="metadata.name"
            required
          />

          <dao-form-item-validate
            :tag="DaoSelect"
            label="微调类型"
            name="spec.objective.type"
            required
          />
        </div>
      </dao-form-group>
    </dao-form>

    <dao-form
      type="vertical"
      class="mt-[20px]"
    >
      <dao-form-group
        title="参数配置"
      >
        <div class="parameter-card mr-6 mb-6">
          <div class="flex space-x-5">
            <dao-form-item-validate
              :tag="DaoSelect"
              label="Scheduler"
              name="spec.parameters.scheduler"
              required
            >
              <dao-option
                v-for="n in SchedulerType"
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
                v-for="n in OptimizerType"
                :key="n"
                :label="n"
                :value="n"
              />
            </dao-form-item-validate>
          </div>

          <div class="flex space-x-5">
            <dao-form-item-validate
              class="w-[240px]"
              label-width="0px"
              name="spec.parameters.PEFT"
              :tag="DaoCheckbox"
            >
              PEFT
            </dao-form-item-validate>

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
              name="spec.parameters.int4/8"
              required
            >
              <dao-option
                label="int4"
                value="int4"
              />
              <dao-option
                label="int8"
                value="int8"
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
              }"
            />

            <dao-form-item-validate
              label="Epochs"
              name="epochs"
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
              }"
            />

            <dao-form-item-validate
              label="WeightDecay"
              name="spec.parameters.weightDecay"
              required
              :control-props="{
                type: 'number',
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
  border: 1px solid #AAB0B8;
  border-radius: 15px;
}
</style>
