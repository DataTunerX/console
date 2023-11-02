<!-- eslint-disable @typescript-eslint/no-shadow -->
<script setup lang="ts">
import { useForm, useFieldArray, useFieldError } from 'vee-validate';
import { DaoFormItemValidate } from '@dao-style/extend';
import {
  computed, markRaw, reactive, onMounted, watch,
} from 'vue';
import { DaoSelect, DaoSwitch } from '@dao-style/core';
import {
  LicenseType,
  SizeType,
  type Dataset,
  LanguageOptions,
  datasetClient,
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
        languages: array().when('plugin.loadPlugin', {
          is: false,
          then: (schema) => schema.min(1),
        }),

        license: string().when('plugin.loadPlugin', {
          is: false,
          then: (schema) => schema.required(),
          otherwise: (schema) => schema.notRequired(),
        }),

        size: string().when('plugin.loadPlugin', {
          is: false,
          then: (schema) => schema.required(),
          otherwise: (schema) => schema.notRequired(),
        }),

        task: object({
          name: string()
            .max(63)
            .when('plugin.loadPlugin', {
              is: false,
              then: (schema) => schema.required(),
              otherwise: (schema) => schema.notRequired(),
            }),
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
  fields,
} = useFieldArray('spec.datasetMetadata.tags');

const addTag = async () => pushToTags('');
const removeTag = (index: number) => removeFromTags(index);

const { remove: removeFromSubtasks, push: pushToSubtasks } = useFieldArray(
  'spec.datasetMetadata.task.subTasks',
);
const addSubtask = () => pushToSubtasks({ name: '' });
const removeSubtask = (index: number) => removeFromSubtasks(index);

const { remove: removeFromRules, push: pushToRules } = useFieldArray(
  'spec.datasetMetadata.datasetInfo.subsets',
);
const handleAddRule = () => pushToRules({});
const handleDeleteRule = (index: number) => removeFromRules(index);

const canRemove = computed(() => (formModel.spec?.datasetMetadata.datasetInfo?.subsets?.length ?? 0) > 1);

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
        // (error as KubernetesError).message,
      );
    } else {
      nError('创建失败', error);
    }
  }
});

watch(
  () => formModel.spec?.datasetMetadata.plugin?.loadPlugin,
  (val) => {
    if (!val) {
      resetForm();
    }
  },
);
</script>

<template>
  <dao-modal-layout
    :title="title"
    @cancel="$router.back"
    @confirm="onSubmit"
  >
    <dao-form>
      <dao-form-item-validate
        label="数据集名称"
        name="metadata.name"
        required
        :control-props="{
          class: '!w-[400px]',
          disabled: isUpdate,
        }"
      />

      <dao-form-item-validate
        label="数据集插件配置"
        name="spec.datasetMetadata.plugin.loadPlugin"
        :tag="DaoSwitch"
      />

      <dao-form-item-validate
        v-if="formModel.spec?.datasetMetadata.plugin?.loadPlugin"
        label="插件名称"
        :tag="DaoSelect"
        required
        name="spec.datasetMetadata.plugin.name"
      >
        <dao-option
          label="AAA"
          value="AAA"
        />
        <dao-option
          v-for="plugin in state.plugins"
          :key="plugin.metadata.name"
          :label="plugin.metadata.name"
          :value="plugin.metadata.name"
        />
      </dao-form-item-validate>

      <template v-else>
        <dao-form-item :label="'标签'">
          <div
            v-for="(field, index) in fields"
            :key="field.key"
            class="flex"
          >
            <dao-form-item-validate
              label-width="0px"
              :name="`spec.datasetMetadata.tags[${index}]`"
              class="no-padding"
              required
              :control-props="{
                class: '!w-[400px]',
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
        />

        <dao-form-item>
          <dao-form-item
            :label="'子任务类型'"
            label-width="85px"
          >
            <div
              v-for="(tag, index) in formModel.spec?.datasetMetadata.task?.subTasks"
              :key="index"
              class="flex"
            >
              <dao-form-item-validate
                label-width="0px"
                :name="`spec.datasetMetadata.task.subTasks[${index}].name`"
                class="no-padding"
                :control-props="{
                  class: '!w-[400px]',
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
            <div
              v-for="(rule, index) in formModel.spec?.datasetMetadata.datasetInfo?.subsets"
              :key="index"
              class="kpd-form-block__item"
            >
              <dao-form-item-validate
                label="子数据集名称"
                :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].name`"
                required
                :control-props="{
                  class: 'input-form-width',
                }"
              />
              <dao-form-item-validate
                label="训练数据集地址"
                :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].splits.train.file`"
                required
                :control-props="{
                  class: 'input-form-width',
                }"
              />
              <dao-form-item-validate
                label="测试数据集地址"
                :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].splits.test.file`"
                :control-props="{
                  class: 'input-form-width',
                }"
              />
              <dao-form-item-validate
                label="验证数据集地址"
                :name="`spec.datasetMetadata.datasetInfo.subsets[${index}].splits.validate.file`"
                required
                :control-props="{
                  class: 'input-form-width',
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

            <div>
              <span
                class="kpd-form-block__add-btn text-btn"
                @click="handleAddRule"
                @keydown="handleAddRule"
              >
                <dao-icon
                  class="align-middle"
                  name="icon-add-in-circle"
                  use-font
                />
                <span class="align-middle"> 添加数据集信息配置 </span>
              </span>
            </div>
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

            <!-- <dao-text-button
              :prop="{
                type: 'default',
                icon: 'icon-close',
              }"
              class="text-button__delete"
              @click="remove(index)"
            /> -->
          </div>

          <!-- <dao-text-button
            :prop="{
              type: 'action',
              icon: 'icon-add',
            }"
            class="text-button__add"
            @click="push"
          >
            添加
          </dao-text-button> -->
        </dao-form-item>

        <dao-form-item-validate
          label="数据源信息"
          name="spec.datasetFiles.source"
          :control-props="{
            class: '!w-[400px]',
          }"
        />
      </template>
    </dao-form>
  </dao-modal-layout>
</template>

<style lang="scss" scoped>
$form-width: 400px;

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

.text-button__delete {
  margin-top: -20px;
  margin-left: 10px;
  font-size: 16px;
}

.text-button__add {
  margin-top: 10px;
}
</style>
