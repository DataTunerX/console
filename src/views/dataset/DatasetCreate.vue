<!-- eslint-disable @typescript-eslint/no-shadow -->
<script setup lang="ts">
import {
  useForm, useFieldArray, useFieldError, useField,
} from 'vee-validate';
import { DaoFormItemValidate } from '@dao-style/extend';
import {
  computed, markRaw, reactive, onMounted,
} from 'vue';
import { DaoSelect, DaoSwitch } from '@dao-style/core';
import {
  LicenseType,
  SizeType,
  type Dataset,
  LanguageOptions,
  datasetClient,
  SubTask,
  Subset,
} from '@/api/dataset';
import {
  object, array, string, addMethod,
} from 'yup';
import { Plugin, dataPluginClient } from '@/api/plugin';
import { useNamespaceStore } from '@/stores/namespace';
import { useRoute, useRouter } from 'vue-router';
import { nError } from '@/utils/useNoty';
import { KubernetesError, HttpStatusCode } from '@/plugins/axios';
import { useDataset } from './composition/create';

const namespaceStore = useNamespaceStore();
const router = useRouter();

const { query } = useRoute();
const isUpdate = computed(() => !!query.name as boolean);
const title = computed(() => (isUpdate.value ? '更新数据集' : '创建数据集'));

const state = reactive({
  plugins: [] as Plugin[],
});

const fetchPlugins = () => {
  dataPluginClient.list(namespaceStore.namespace).then((res) => {
    state.plugins = res.data.items;
  });
};

fetchPlugins();

addMethod(array, 'unique', function unique(message, mapper = (a: string) => a) {
  return this.test('unique', message, (list) => list?.length === new Set(list?.map(mapper)).size);
});

// addMethod(array, 'unique', function a(message) {
//   return this.test('unique', message, function b(list) {
//     const mapper = (x: any) => x;
//     const set = [...new Set(list?.map(mapper))];
//     const isUnique = list?.length === set.length;

//     if (isUnique) {
//       return true;
//     }
//     const idx = list?.findIndex((l, i) => mapper(l) !== set[i]);

//     return this.createError({
//       path: `spec.datasetMetadata.tags[${idx}]`,
//       message,
//     });
//   });
// });

const schema = markRaw(
  object({
    metadata: object({
      name: string().required().RFC1123Label(253).max(64)
        .label('数据集名称'),
    }),
    spec: object().shape({
      datasetMetadata: object().shape({
        tags: array().of(string().required()).unique('标签重复'),
        languages: array().min(1),
        license: string().required(),
        size: string().required(),
        task: object({
          name: string().max(63).required(),
          subTasks: array()
            .of(
              object({
                name: string().max(63).required(),
              }),
            )
            .unique('子任务名称重复', (obj: { name: string }) => obj.name),
        }),

        datasetInfo: object({
          subsets: array()
            .of(
              object({
                name: string().required().max(63),
                splits: object({
                  train: object({
                    file: string().required(),
                  }),
                  validate: object({
                    file: string().required(),
                  }),
                }),
              }),
            )
            .unique('子数据集名称重复', (obj: { name: string }) => obj.name),
        }),

        plugin: object({
          name: string().when('loadPlugin', {
            is: true,
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.notRequired(),
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
} = useForm<Dataset>({
  initialValues: dataset,
  validationSchema: schema,
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
} = useFieldArray<SubTask>('spec.datasetMetadata.task.subTasks');
const addSubtask = () => pushToSubtasks({ name: '' });
const removeSubtask = (index: number) => removeFromSubtasks(index);

const { remove: removeFromRules, push: pushToRules, fields: subsets } = useFieldArray<Subset>(
  'spec.datasetMetadata.datasetInfo.subsets',
);
const handleAddRule = () => pushToRules({});
const handleDeleteRule = (index: number) => removeFromRules(index);

const { value: loadPlugin } = useField<boolean>('spec.datasetMetadata.plugin.loadPlugin');

const canRemove = computed(
  () => (formModel.spec?.datasetMetadata.datasetInfo?.subsets?.length ?? 0) > 1,
);

const toList = () => {
  router.push({
    name: 'DatasetList',
  });
};

// const onSubmit = () => {
//   validate().then((valid) => {
//     console.log(valid);
//   });
// };

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isUpdate.value && values.metadata?.name) {
      await datasetClient.update(namespaceStore.namespace, values.metadata?.name, values);
    } else {
      await datasetClient.create(namespaceStore.namespace, values);
    }
    toList();
  } catch (error) {
    const err = error as KubernetesError;

    if (err.code === HttpStatusCode.Conflict) {
      setFieldError(
        'metadata.name',
        '该名称的数据集已存在',
      );
    } else {
      nError('创建失败', error);
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
    <dao-form label-width="170px">
      <dao-form-item-validate
        label="数据集名称"
        name="metadata.name"
        required
        :control-props="{
          disabled: isUpdate,
          class: 'input-form-width',
        }"
      />
      <dao-form-item
        :label="'标签'"
        class="multi-row-block"
        :padding-bottom="10"
      >
        <div
          v-for="(field, index) in tags"
          :key="field.key"
          class="multi-row-block__item"
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
          添加
        </dao-text-button>

        <template #error>
          <dao-error-text>
            {{ duplicateTag }}
          </dao-error-text>
        </template>
      </dao-form-item>

      <dao-form-item-validate
        required
        label="语言"
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
          :label="$t(`views.dataset.${language}`)"
          :value="language"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        label="授权协议"
        name="spec.datasetMetadata.license"
        :tag="DaoSelect"
        required
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
        :label="'词条数目'"
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
        label="任务类型"
        name="spec.datasetMetadata.task.name"
        required
        :control-props="{
          class: 'input-form-width',
        }"
      />

      <dao-form-item v-if="!subTasks?.length">
        <dao-text-button
          :prop="{
            type: 'action',
            icon: 'icon-add',
          }"
          @click="addSubtask"
        >
          添加子任务类型
        </dao-text-button>
      </dao-form-item>

      <dao-form-item v-else>
        <dao-form-item
          :label="'子任务类型'"
          label-width="85px"
          class="multi-row-block background"
          :padding-bottom="0"
        >
          <div
            v-for="(field, index) in subTasks"
            :key="field.key"
            class="multi-row-block__item"
          >
            <dao-form-item-validate
              label-width="0px"
              :name="`spec.datasetMetadata.task.subTasks[${index}].name`"
              class="no-padding flex-1"
              :padding-bottom="field.isLast ? 0 : 10"
              :control-props="{
                block: true,
              }"
            />

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
            添加
          </dao-text-button>

          <template #error>
            <dao-error-text>
              {{ duplicateSubTask }}
            </dao-error-text>
          </template>
        </dao-form-item>
      </dao-form-item>

      <dao-form-item :label="'数据集信息'">
        <div class="kpd-form-block">
          <dao-form-item-validate
            label-width="80px"
            label="插件配置"
            name="spec.datasetMetadata.plugin.loadPlugin"
            :tag="DaoSwitch"
          />

          <dao-form-item-validate
            v-if="loadPlugin"
            label-width="80px"
            label="插件名称"
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

          <div
            v-for="(field, index) in subsets"
            :key="field.key"
            class="kpd-form-block__item"
          >
            <dao-form-item-validate
              label="子数据集名称"
              :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].name`"
              required
              :control-props="{
                class: 'input-form-width',
                disabled: loadPlugin
              }"
            />
            <dao-form-item-validate
              label="训练数据集地址"
              :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].splits.train.file`"
              required
              :control-props="{
                class: 'input-form-width',
                disabled: loadPlugin
              }"
            />
            <dao-form-item-validate
              label="测试数据集地址"
              :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].splits.test.file`"
              :control-props="{
                class: 'input-form-width',
                disabled: loadPlugin
              }"
            />
            <dao-form-item-validate
              label="验证数据集地址"
              :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].splits.validate.file`"
              required
              :control-props="{
                class: 'input-form-width',
                disabled: loadPlugin
              }"
            />
            <dao-icon
              v-if="canRemove"
              class="kpd-form-block__remove-btn"
              name="icon-remove"
              use-font
              @click="handleDeleteRule(index)"
            />
          </div>

          <dao-text-button
            :disabled="loadPlugin"
            :prop="{
              type: 'action',
              icon: 'icon-add',
            }"
            class="kpd-form-block__add-btn"
            @click="handleAddRule"
          >
            添加数据集信息配置
          </dao-text-button>
        </div>
        <template #error>
          <dao-error-text>
            {{ duplicateSubset }}
          </dao-error-text>
        </template>
      </dao-form-item>

      <dao-form-item label="特征映射">
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
        label="数据源信息"
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

:deep(.kpd-form-block) {
  display: inline-block;

  .kpd-form-block__item {
    padding-right: 20px;
  }
}

:deep(.input-form-width.dao-input),
:deep(.select-form-width.dao-select) {
  width: $form-width;
}

:deep {
  .no-padding {
    .dao-form-item__label {
      padding: 0;
    }
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

.multi-row-block {
  &.background {
    width: $form-width;
    padding: 20px;
    background: #f8fafc;
    border: 1px solid #aab0b8;
    border-radius: 4px;
  }

  &__item {
    display: flex;
  }
}
</style>
