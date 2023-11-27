<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import { useFieldArray, useFieldError, useForm } from 'vee-validate';
import {
  string, object, array, number,
} from 'yup';
import {
  markRaw, ref, computed, watch,
  onBeforeMount,
} from 'vue';
import { FinetuneJobWithName, finetuneExperimentClient } from '@/api/finetune-experiment';
import { useNamespaceStore } from '@/stores/namespace';
import { storeToRefs } from 'pinia';
import { nError } from '@/utils/useNoty';
import { useRouter } from 'vue-router';
import KeyValueForm from '@/components/KeyValueForm.vue';
import { FinetuneExperimentForRender, convertFinetuneExperimentForPost } from '@/api/finetune-experiment-for-render';
import { BuildInScoringPlugin } from '@/api/scoring-plugin';
import { useI18n } from 'vue-i18n';
import FinetuneJobComponent from './components/FinetuneJobComponent.vue';

import {
  useFinetuneExperiment,
  useFinetuneJob,
  useLargeLanguageModel,
  useScoringConfig,
} from './composition/finetune';
import { useDataset } from '../dataset/composition/dataset';
import { useHyperparameter } from '../hyperparameter/composition/hyperparameter';

const { t } = useI18n();

const router = useRouter();

const { namespace } = storeToRefs(useNamespaceStore());

const { datasets, fetchDatasets } = useDataset();

const { largeLanguageModels, fetchLargeLanguageModels } = useLargeLanguageModel();

const { hyperparameters, fetchHyperparameters } = useHyperparameter();

const { finetuneExperiment } = useFinetuneExperiment();

const { scoringConfigs, fetchScoringConfigs } = useScoringConfig();

const { finetuneJob } = useFinetuneJob();

const componentRef = ref<typeof KeyValueForm >();

const validationSchema = markRaw(
  object({
    metadata: object({
      name: string().RFC1123Label().required().label(t('views.FinetuneExperiment.experimentName')),
    }),
    spec: object({
      finetuneJobs: array<FinetuneJobWithName>().of(
        object({
          name: string().RFC1123Label().label(t('views.FinetuneExperiment.taskName')),
          spec: object({
            finetune: object({
              finetuneSpec: object({
                llm: string().required().label(t('views.FinetuneExperiment.baseLargeModel')),
                dataset: string().required().label(t('views.FinetuneExperiment.dataset')),
                hyperparameter: object({
                  hyperparameterRef: string().required().label(t('views.FinetuneExperiment.hyperparameter')),
                  parameters: object({
                    loRA_Alpha: number().moreThan(0),
                    loRA_R: number().integer().moreThan(2),
                    loRA_Dropout: number().moreThan(0).lessThan(1),
                    learningRate: number().moreThan(0).lessThan(1),
                    epochs: number().integer().moreThan(1),
                    blockSize: number().integer().moreThan(8),
                    batchSize: number().integer().moreThan(1),
                    warmupRatio: number().moreThan(0).lessThan(1),
                    weightDecay: number().moreThan(0).lessThan(1),
                    gradAccSteps: number().integer().min(1),
                  }),
                }),
              }),
            }),
          }),
        }),
      ).min(1).unique((job) => job.name, t('views.FinetuneExperiment.taskName')),
      scoringConfig: object({
        name: string().required().label(t('views.FinetuneExperiment.scoringConfig')),
        parameters: object().test('parameters', '', async () => {
          if (componentRef.value) {
            const valid = await componentRef.value?.validate();

            return valid.valid;
          }

          return true;
        }),
      }),
    }),
  }),
);

const {
  validate, errorBag, values, defineComponentBinds,
} = useForm<FinetuneExperimentForRender>({
  initialValues: finetuneExperiment.value,
  validationSchema,
});

const parameters = defineComponentBinds('spec.scoringConfig.parameters', {
  validateOnModelUpdate: false,
});

const useBuildInPlugin = computed(() => !values.spec.scoringConfig.name || values.spec.scoringConfig.name === BuildInScoringPlugin);

const hasError = (index: number) => Object.keys(errorBag.value).some((key) => key.startsWith(`spec.finetuneJobs[${index}]`));

const { push, remove, fields: jobs } = useFieldArray<FinetuneJobWithName>('spec.finetuneJobs');

const onAdd = () => {
  push(finetuneJob.value);
};

const onlyOneJob = computed(() => jobs.value.length === 1);

const jobDuplicateError = useFieldError('spec.finetuneJobs');

const init = () => {
  Promise.all([
    fetchLargeLanguageModels(namespace.value),
    fetchDatasets(namespace.value),
    fetchHyperparameters(namespace.value),
    fetchScoringConfigs(namespace.value),
  ]);
};

onBeforeMount(() => {
  init();
});

const activeSection = ref([`${jobs.value[0].key}`]);

const toList = () => {
  router.push({
    name: 'FinetuneExperimentList',
  });
};

watch(namespace, toList);

const onSubmit = async () => {
  const { valid } = await validate();

  if (valid) {
    try {
      await finetuneExperimentClient.create(namespace.value, convertFinetuneExperimentForPost(values));
      toList();
    } catch (error) {
      nError(t('common.createFailed'), error);
    }
  }
};
</script>

<template>
  <dao-modal-layout
    :title="$t('views.FinetuneExperiment.createFineTuningExperiment')"
    @cancel="$router.back"
    @confirm="onSubmit"
  >
    <dao-form>
      <dao-form-group :title="$t('common.basicInfo')">
        <dao-form-item-validate
          :label="$t('views.FinetuneExperiment.experimentName')"
          name="metadata.name"
          required
          :control-props="{
            class: 'input-form-width',
          }"
        />
        <dao-form-item-validate
          :label="$t('views.FinetuneExperiment.scoringConfig')"
          name="spec.scoringConfig.name"
          :tag="DaoSelect"
          :padding-bottom="10"
          :control-props="{
            class: 'select-form-width',
          }"
        >
          <dao-option
            :label="$t('views.FinetuneExperiment.buildInScoringPlugin')"
            :value="BuildInScoringPlugin"
          />
          <dao-option
            v-for="scoringConfig in scoringConfigs"
            :key="scoringConfig.metadata?.name"
            :label="scoringConfig.metadata?.name"
            :value="scoringConfig.metadata?.name"
          />
        </dao-form-item-validate>

        <dao-form-item
          v-if="!useBuildInPlugin"
        >
          <dao-form-item
            padding-bottom="0"
            :label="$t('views.FinetuneExperiment.parameters')"
            class="form-item--block"
          >
            <key-value-form
              ref="componentRef"
              name="spec.datasetMetadata.plugin.parameters"
              v-bind="parameters"
            />
          </dao-form-item>
        </dao-form-item>
      </dao-form-group>

      <dao-form-group :title="$t('views.FinetuneExperiment.configuration')">
        <dao-expansion
          :model-value="activeSection"
          type="box"
          class="mb-[20px]"
        >
          <dao-expansion-item
            v-for="(job, idx) in jobs"
            :key="job.key"
            class="job-item relative"
            :name="`${job.key}`"
            :title="job.value.name"
          >
            <finetune-job-component
              :llms="largeLanguageModels"
              :datasets="datasets"
              :hyperparameters="hyperparameters"
              :name="`spec.finetuneJobs[${idx}]`"
            />
            <template #action>
              <dao-icon
                v-if="hasError(idx)"
                class="job-item-icon--error text-[18px] mr-[23px]"
                name="icon-sys-warning"
                use-font
              />
              <dao-icon
                v-if="!onlyOneJob"
                class="mr-[3px] job-item__remove-btn"
                name="icon-close"
                use-font
                @click="remove(idx)"
              />
            </template>
          </dao-expansion-item>
          <dao-error-text class="mt-[10px]">
            {{ jobDuplicateError }}
          </dao-error-text>
        </dao-expansion>
        <dao-text-button
          :prop="{
            type: 'action',
            iconLeft: 'icon-add',
          }"
          @click="onAdd"
        >
          {{ $t("views.FinetuneExperiment.add") }}
        </dao-text-button>
      </dao-form-group>
    </dao-form>
  </dao-modal-layout>
</template>

<style lang="scss" scoped>
.job-item {
  &-icon--error {
    color: var(--dao-red-050);
    vertical-align: middle;
  }

  &-title {
    padding: 21px 0 11px;
    font-size: 14px;
    font-weight: 700;
    color: #363a42;

    &.port-title {
      padding-top: 11px;
    }
  }

  &__remove-btn {
    color: var(--dao-gray-blue-040);
  }
}
$form-width: 400px;

:deep(.input-form-width.dao-input),
:deep(.select-form-width.dao-select) {
  width: $form-width;
}
</style>
