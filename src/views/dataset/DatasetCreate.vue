<script setup lang="ts">
import {
  useForm, useFieldArray, useFieldError, useField,
} from 'vee-validate';

import { DaoSwitch, DaoSelect } from '@dao-style/core';
import {
  computed, markRaw, reactive, onMounted, ref, watch,
} from 'vue';
import { object, array, string } from 'yup';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  LicenseType,
  SizeType,
  LanguageOptions,
  SubTask,
  Subset,
  taskCategories,
  datasetClient,
  SubTaskName,
} from '@/api/dataset';
import { Plugin, dataPluginClient } from '@/api/plugin';
import { useNamespaceStore } from '@/stores/namespace';
import { nError, nSuccess } from '@/utils/useNoty';
import { HttpStatusCode, KubernetesError } from '@/plugins/axios';
import KeyValueForm from '@/components/KeyValueForm.vue';
import { type DatasetForRender, convertDatasetForPost } from '@/api/dataset-for-render';

import { useDataset } from './composition/dataset';

const { t } = useI18n();

const namespaceStore = useNamespaceStore();
const router = useRouter();

const { query } = useRoute();
const isUpdate = computed(() => !!query.name as boolean);
const title = computed(() => (isUpdate.value ? t('views.Dataset.update') : t('views.Dataset.create')));

const state = reactive({
  plugins: [] as Plugin[],
});

const fetchPlugins = () => {
  dataPluginClient.list(namespaceStore.namespace).then(({ data }) => {
    state.plugins = data.items;
  });
};

fetchPlugins();

const componentRef = ref<typeof KeyValueForm>();

const schema = markRaw(
  object({
    metadata: object({
      name: string().required().RFC1123Label(253).max(64)
        .label(t('views.Dataset.datasetName')),
    }),
    spec: object({
      datasetMetadata: object().shape({
        tags: array()
          .of(string().required())
          .unique((n) => n, t('views.Dataset.tag'))
          .label(t('views.Dataset.tag')),
        languages: array().min(1),
        size: string().required(),
        task: object({
          name: string().max(63).required(),
          subTasks: array()
            .of(
              object({
                name: string().max(63).required(),
              }),
            )
            .unique((item) => item.name, t('views.Dataset.subtaskType')),
        }),

        datasetInfo: object({
          subsets: array()
            .of(
              object({
                name: string().required().max(63),
                splits: object({
                  train: object({
                    file: string().s3().required(),
                  }),
                  test: object({
                    file: string().s3().required(),
                  }),
                  validate: object({
                    file: string().s3().required(),
                  }),
                }),
              }),
            )
            .unique((item) => item.name, t('views.Dataset.subsetName')),
        }),

        plugin: object({
          name: string().when('loadPlugin', {
            is: true,
            then: (schemaCopy) => schemaCopy.required(),
            otherwise: (schemaCopy) => schemaCopy.notRequired(),
          }),
          parameters: object().test('labels', 'labels is required', async () => {
            if (componentRef.value) {
              const valid = await componentRef.value?.validate();

              return valid.valid;
            }

            return true;
          }),
        }),
      }),
    }),
  }),
);

const { dataset, fetchDataset } = useDataset();

const {
  values: formModel,
  handleSubmit,
  resetForm,
  setFieldError,
  defineField,
} = useForm<DatasetForRender>({
  initialValues: dataset.value,
  validationSchema: schema,
});

const parameters = defineField('spec.datasetMetadata.plugin.parameters', {
  validateOnModelUpdate: false,
});

const duplicateTag = useFieldError('spec.datasetMetadata.tags');
const duplicateSubTask = useFieldError('spec.datasetMetadata.task.subTasks');
const duplicateSubset = useFieldError('spec.datasetMetadata.datasetInfo.subsets');

onMounted(() => {
  if (isUpdate.value) {
    fetchDataset(namespaceStore.namespace, query.name as string).then(() => {
      resetForm({ values: dataset.value });
    });
  }
});

const {
  remove: removeFromTags,
  push: pushToTags,
  fields: tags,
} = useFieldArray<string>('spec.datasetMetadata.tags');

const addTag = async () => pushToTags('');
const removeTag = (index: number) => removeFromTags(index);

const {
  remove: removeFromSubtasks,
  push: pushToSubtasks,
  fields: subTasks,
  replace: replaceSubTask,
} = useFieldArray<SubTask>('spec.datasetMetadata.task.subTasks');
const addSubtask = () => pushToSubtasks({ name: '' as SubTaskName });
const removeSubtask = (index: number) => removeFromSubtasks(index);

const {
  remove: removeFromRules,
  push: pushToRules,
  fields: subsets,
  replace,
} = useFieldArray<Subset>('spec.datasetMetadata.datasetInfo.subsets');
const handleAddRule = () => pushToRules({});
const handleDeleteRule = (index: number) => removeFromRules(index);

const { value: loadPlugin } = useField<boolean>('spec.datasetMetadata.plugin.loadPlugin');

watch(
  () => formModel.spec.datasetMetadata.task?.name,
  () => {
    replaceSubTask([]);
  },
);

watch(
  () => loadPlugin.value,
  (val) => {
    replace(val ? [] : [{ name: 'Default' }]);
  },
);

const canRemove = computed(() => {
  if (loadPlugin.value) {
    return false;
  }

  return (formModel.spec?.datasetMetadata.datasetInfo?.subsets?.length ?? 0) > 1;
});

const hasMarginBottom = computed(() => {
  if (loadPlugin.value) {
    if (subsets.value.length) {
      return true;
    }
  }

  return false;
});

const toList = () => {
  router.push({
    name: 'DatasetList',
  });
};

// const onSubmit = () => {
//   validate().then((valid) => {
//     console.log('valid', valid);
//   });
// };

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isUpdate.value && values.metadata?.name) {
      await datasetClient.update(
        namespaceStore.namespace,
        values.metadata?.name,
        convertDatasetForPost(values),
      );
    } else {
      await datasetClient.create(namespaceStore.namespace, convertDatasetForPost(values));
    }
    nSuccess(
      t('common.notySuccess', {
        name: !isUpdate.value ? t('common.create') : t('common.update'),
      }),
    );
    toList();
  } catch (error) {
    const err = error as KubernetesError;

    if (err.code === HttpStatusCode.Conflict) {
      setFieldError('metadata.name', t('views.Dataset.datasetNameExists'));
    } else {
      nError(
        t('common.notyError', {
          name: t('common.fail'),
        }),
        error,
      );
    }
  }
});
</script>

<template>
  <dao-modal-layout
    type="custom"
    padding-x="40px"
    :title="title"
    @cancel="$router.back"
    @confirm="onSubmit"
  >
    <dao-form>
      <dao-form-item-validate
        :label="$t('views.Dataset.datasetName')"
        name="metadata.name"
        required
        :control-props="{
          disabled: isUpdate,
          class: 'input-form-width',
        }"
      />

      <dao-form-item
        :label="$t('views.Dataset.tag')"
        :padding-bottom="10"
      >
        <div
          v-for="(field, index) in tags"
          :key="field.key"
          class="flex"
        >
          <dao-form-item-validate
            label-width="0px"
            :name="`spec.datasetMetadata.tags[${index}]`"
            class="no-padding"
            :padding-bottom="field.isLast ? 3 : 10"
            required
            :control-props="{
              class: 'input-form-width',
            }"
          />

          <dao-text-button
            :prop="{
              type: 'default',
              icon: 'icon-close',
            }"
            class="text-button__delete"
            @click="removeTag(index)"
          />
        </div>

        <dao-text-button
          class="text-button__add"
          :prop="{
            type: 'action',
            icon: 'icon-add',
          }"
          @click="addTag"
        >
          {{ $t("common.add") }}
        </dao-text-button>

        <template #error>
          <dao-error-text>
            {{ duplicateTag }}
          </dao-error-text>
        </template>
      </dao-form-item>

      <dao-form-item-validate
        required
        :label="$t('views.Dataset.language')"
        name="spec.datasetMetadata.languages"
        :tag="DaoSelect"
        :control-props="{
          multiple: true,
          class: 'select-form-width',
        }"
      >
        <dao-option
          v-for="language in LanguageOptions"
          :key="language"
          :label="$t(`views.Dataset.${language}`)"
          :value="language"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        :label="$t('views.Dataset.licenseType')"
        name="spec.datasetMetadata.license"
        :tag="DaoSelect"
        :control-props="{
          class: 'select-form-width',
        }"
      >
        <dao-option
          v-for="n in LicenseType"
          :key="n"
          :label="n"
          :value="n"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        :label="$t('views.Dataset.size')"
        name="spec.datasetMetadata.size"
        :tag="DaoSelect"
        required
        :control-props="{
          class: 'select-form-width',
        }"
      >
        <dao-option
          v-for="n in SizeType"
          :key="n"
          :label="n"
          :value="n"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        :label="$t('views.Dataset.taskType')"
        name="spec.datasetMetadata.task.name"
        padding-bottom="10"
        required
        :control-props="{
          class: 'select-form-width',
        }"
        :tag="DaoSelect"
      >
        <dao-option
          v-for="(_, category) in taskCategories"
          :key="category"
          :label="category"
          :value="category"
        />
      </dao-form-item-validate>

      <dao-form-item>
        <dao-form-item
          :label="$t('views.Dataset.subtaskType')"
          label-width="85px"
          class="form-item--block w-[500px]"
          :padding-bottom="0"
        >
          <div
            v-for="(field, index) in subTasks"
            :key="field.key"
            class="flex"
          >
            <dao-form-item-validate
              label-width="0px"
              :name="`spec.datasetMetadata.task.subTasks[${index}].name`"
              class="no-padding flex-1"
              :padding-bottom="field.isLast ? 0 : 10"
              :tag="DaoSelect"
              :control-props="{
                style: 'width: 100%',
              }"
            >
              <dao-option
                v-for="subTask in taskCategories[formModel.spec?.datasetMetadata.task?.name as keyof typeof taskCategories]"
                :key="subTask"
                :label="subTask"
                :value="subTask"
              />
            </dao-form-item-validate>

            <dao-text-button
              :prop="{
                type: 'default',
                icon: 'icon-close',
              }"
              class="text-button__delete"
              @click="removeSubtask(index)"
            />
          </div>

          <dao-text-button
            :prop="{
              type: 'action',
              icon: 'icon-add',
            }"
            class="text-button__add"
            @click="addSubtask"
          >
            {{ $t("common.add") }}
          </dao-text-button>

          <template #error>
            <dao-error-text>
              {{ duplicateSubTask }}
            </dao-error-text>
          </template>
        </dao-form-item>
      </dao-form-item>

      <dao-form-item :label="$t('views.Dataset.datasetInformation')">
        <div class="datatunerx-form-block">
          <dao-form-item-validate
            :label="$t('views.Dataset.pluginConfiguration')"
            name="spec.datasetMetadata.plugin.loadPlugin"
            :tag="DaoSwitch"
          />

          <template v-if="loadPlugin">
            <dao-form-item-validate
              :label="$t('views.Dataset.pluginName')"
              :tag="DaoSelect"
              required
              name="spec.datasetMetadata.plugin.name"
            >
              <dao-option
                v-for="plugin in state.plugins"
                :key="plugin.metadata.name"
                :label="plugin.metadata.name"
                :value="plugin.metadata.name"
              />
            </dao-form-item-validate>

            <dao-form-item :label="$t('views.Dataset.pluginParameters')">
              <key-value-form
                ref="componentRef"
                name="spec.datasetMetadata.plugin.parameters"
                v-bind="parameters"
              />
            </dao-form-item>
          </template>

          <div
            v-for="(field, index) in subsets"
            :key="field.key"
            class="datatunerx-form-block__item"
            :class="{ 'mb-[20px]': field.isLast && hasMarginBottom }"
          >
            <dao-form-item-validate
              :label="$t('views.Dataset.subsetName')"
              :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].name`"
              required
              :control-props="{
                class: 'input-form-width',
                disabled: loadPlugin,
              }"
            />
            <dao-form-item-validate
              :label="$t('views.Dataset.trainingDataFile')"
              :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].splits.train.file`"
              required
              :control-props="{
                class: 'input-form-width',
                disabled: loadPlugin,
                placeholder: 's3://mybucket/myfile.txt'
              }"
            />
            <dao-form-item-validate
              :label="$t('views.Dataset.validationDataFile')"
              :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].splits.validate.file`"
              required
              :control-props="{
                class: 'input-form-width',
                disabled: loadPlugin,
              }"
            />
            <dao-form-item-validate
              :label="$t('views.Dataset.testingDataFile')"
              :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].splits.test.file`"
              required
              :control-props="{
                class: 'input-form-width',
                disabled: loadPlugin,
              }"
            />
            <dao-icon
              v-if="canRemove"
              class="datatunerx-form-block__remove-btn"
              name="icon-remove"
              use-font
              @click="handleDeleteRule(index)"
            />
          </div>

          <dao-text-button
            v-if="!loadPlugin"
            :prop="{
              type: 'action',
              icon: 'icon-add',
            }"
            class="datatunerx-form-block__add-btn"
            @click="handleAddRule"
          >
            {{ $t("views.Dataset.addDatasetInfoConfig") }}
          </dao-text-button>
        </div>
        <template #error>
          <dao-error-text>
            {{ duplicateSubset }}
          </dao-error-text>
        </template>
      </dao-form-item>

      <dao-form-item :label="$t('views.Dataset.featureMapping')">
        <div
          v-for="(tag, index) in formModel.spec?.datasetMetadata.datasetInfo?.features"
          :key="index"
          class="flex"
        >
          <dao-form-item-validate
            class="no-padding"
            label-width="0px"
            :name="`spec.datasetMetadata.datasetInfo.features[${index}].name`"
            :control-props="{
              disabled: true,
            }"
          />

          <dao-form-item-validate
            label-width="0px"
            :name="`spec.datasetMetadata.datasetInfo.features[${index}].mapTo`"
          />
        </div>
      </dao-form-item>

      <dao-form-item-validate
        :label="$t('views.Dataset.dataSourceInformation')"
        name="spec.datasetFiles.source"
        :control-props="{
          class: 'input-form-width',
        }"
      />
    </dao-form>
  </dao-modal-layout>
</template>

<style lang="scss" scoped>
$form-width: 500px;

:deep(.input-form-width.dao-input),
:deep(.select-form-width.dao-select) {
  width: $form-width;
}

.no-padding {
  :deep(.dao-form-item__label) {
    padding: 0;
  }
}

.text-button__add {
  margin-top: 7px;
}

.text-button__delete {
  height: 30px;
  margin-left: 10px;
  font-size: 16px;
}
</style>
