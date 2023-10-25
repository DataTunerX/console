<template>
  <dao-modal-layout
    title="创建参数组"
    @cancel="$router.back"
  >
    <dao-form>
      <dao-form-group
        title="基本信息"
      >
        <div class="flex">
          <dao-form-item-validate
            label="参数组名称"
            name="name"
            required
          />

          <dao-form-item-validate
            :tag="DaoSelect"
            label="微调类型"
            name="name"
            required
          />
        </div>
      </dao-form-group>

      <dao-form-group title="参数配置">
        <div class="flex flex-wrap">
          <dao-form-item-validate
            label="batchSize"
            name="batchSize"
            required
            :control-props="{
              type: 'number',
              step: 1
            }"
          />

          <dao-form-item-validate
            label="learningRate"
            name="learningRate"
            required
            :control-props="{
              type: 'number',
            }"
          />

          <dao-form-item-validate
            label="blockSize"
            name="blockSize"
            required
            :control-props="{
              type: 'number',
            }"
          />

          <dao-form-item-validate
            label="epochs"
            name="epochs"
            required
            :control-props="{
              type: 'number',
            }"
          />

          <dao-form-item-validate
            :tag="DaoSelect"
            label="scheduler"
            name="scheduler"
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
            label="optimizer"
            name="optimizer"
            required
          >
            <dao-option
              v-for="n in OptimizerType"
              :key="n"
              :label="n"
              :value="n"
            />
          </dao-form-item-validate>

          <dao-form-item-validate
            :tag="DaoSelect"
            label="int4/8"
            name="int4/8"
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
            label="loRA_R"
            name="loRA_R"
            required
            :control-props="{
              type: 'number',
            }"
          />

          <dao-form-item-validate
            label="loRA_Alpha"
            name="loRA_Alpha"
            required
            :control-props="{
              type: 'number',
            }"
          />

          <dao-form-item-validate
            label="loRA_Dropout"
            name="loRA_Dropout"
            required
            :control-props="{
              type: 'number',
            }"
          />

          <dao-form-item-validate
            label="warmupRatio"
            name="warmupRatio"
            required
            :control-props="{
              type: 'number',
            }"
          />

          <dao-form-item-validate
            label="weightDecay"
            name="weightDecay"
            required
            :control-props="{
              type: 'number',
            }"
          />

          <dao-form-item-validate
            label="gradAccSteps"
            name="gradAccSteps"
            required
            :control-props="{
              type: 'number',
            }"
          />

          <dao-form-item-validate
            :tag="DaoSelect"
            label="trainerType"
            name="trainerType"
            required
          >
            <dao-option
              v-for="n in TrainerType"
              :key="n"
              :label="n"
              :value="n"
            />
          </dao-form-item-validate>

          <dao-form-item
            label="PEFT"
            name="trainerType"
            required
          >
            <dao-switch />
          </dao-form-item>

          <dao-form-item
            label="FP16"
            name="trainerType"
            required
          >
            <dao-switch />
          </dao-form-item>
        </div>
      </dao-form-group>
    </dao-form>
  </dao-modal-layout>
</template>

<script lang="ts" setup>
import { yup } from '@/plugins/vee-validate';
import { DaoSelect } from '@dao-style/core';
import { useForm } from 'vee-validate';
import { SchedulerType, OptimizerType, TrainerType } from '@/types/createHyperparameter';

const schema = yup.object({
  name: yup.string().required().RFC1123Label(253).label('数据集名称'),
  learningRate: yup.number().required().min(0).max(1),
});

const initialValue = {
  scheduler: SchedulerType.COSINE,
  optimizer: OptimizerType.ADAM,
  int4: false,
  int8: false,
  loRA_R: 4,
  loRA_Alpha: 32.0,
  loRA_Dropout: 0.1,
  learningRate: 0.001,
  epochs: 10,
  blockSize: 512,
  batchSize: 32,
  warmupRatio: 0.1,
  weightDecay: 0.0001,
  gradAccSteps: 1,
  trainerType: TrainerType.STANDARD,
  PEFT: false,
  FP16: false,

};

type HyperparameterInfo = typeof initialValue;

useForm<HyperparameterInfo>({
  initialValues: initialValue,
  validationSchema: schema,
});
</script>
