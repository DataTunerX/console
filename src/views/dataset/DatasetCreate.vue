<script setup lang="ts">
import { useForm, useFieldArray } from 'vee-validate';
import { DaoModalLayout, DaoFormItemValidate } from '@dao-style/extend';
import { ref, computed } from 'vue';
import { yup } from '@/plugins/vee-validate';
import { DaoSelect } from '@dao-style/core';

const confirmLoading = ref(true);
const confirmDisabled = ref(true);

const schema = yup.object({
  name: yup.string().required().RFC1123Label(253).label('数据集名称'),
  tags: yup.array(yup.string().required().max(10)),
});

const initialValue = {
  name: 'Max',
  tags: ['tag2', 'tag1'] as Array<string >,
  license: '',
  size: '',
  task: '',
  subtasks: [] as Array<string>,
  rules: [{
    name: 'default',
  }] as Array<{ name: string, train?: string, test?:string, valid?:string }>,
  columnNames: [],
};

const classInfo = ref<string[]>([
  '一班',
  '二班',
  '三班',
  '四班',
  '十五班',
]);

const sizeInfo = ref<string[]>([
  '0-10k',
  '20-100k',
]);

type ReqDatasetInfo = typeof initialValue;

const {
  validate,
  values: formModel,
  setValues,
} = useForm<ReqDatasetInfo>({
  initialValues: initialValue,
  validationSchema: schema,
});

const { remove: removeFromTags, push: pushToTags } = useFieldArray('tags');
const addTag = () => pushToTags('qwer');
const removeTag = (index: number) => removeFromTags(index);

const { remove: removeFromSubtasks, push: pushToSubtasks } = useFieldArray('subtasks');
const addSubtask = () => pushToSubtasks('qwer');
const removeSubtask = (index: number) => removeFromSubtasks(index);

const { remove: removeFromRules, push: pushToRules } = useFieldArray('rules');
const handleAddRule = () => pushToRules({});
const handleDeleteRule = (index : number) => removeFromRules(index);

const { remove, push } = useFieldArray('columnNames');

const onHandleChange = () => {
  console.log('onHandleChange');
};

const showIconRemove = computed(() => formModel.rules.length > 1);

</script>

<template>
  <dao-modal-layout
    title="上传数据集"
    :confirm-loading="confirmLoading"
    :confirm-disabled="confirmDisabled"
    @cancel="$router.back"
  >
    <dao-form
      v-slot="{ classNames }"
    >
      <dao-form-item-validate
        label="数据集名称"
        name="name"
        required
        :control-props="{
          class: '!w-[400px]',
        }"
      />

      <dao-form-item
        :label="'朋友们'"
      >
        <template
          v-for="(tag, index) in formModel.tags"
          :key="index"
        >
          <dao-form-item-validate
            label-width="0px"
            :name="`tags[${index}]`"
            required
            :control-props="{
              trim: true,
              class: '!w-[400px]',
            }"
          />
        </template>
        <dao-form-item>
          <div :class="classNames.wrapper.footer">
            <dao-button @click="addTag">
              加个朋友
            </dao-button>
          </div>
        </dao-form-item>
      </dao-form-item>

      <dao-form-item-validate
        :label="'License'"
        name="license"
        :tag="DaoSelect"
        helper="班级长度不能超过2，并且不能是二班"
        required
      >
        <dao-option
          v-for="n in classInfo"
          :key="n"
          :label="n"
          :value="n"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        :label="'Size'"
        name="size"
        :tag="DaoSelect"
        required
      >
        <dao-option
          v-for="n in sizeInfo"
          :key="n"
          :label="n"
          :value="n"
        />
      </dao-form-item-validate>

      <dao-form-item-validate
        label="Task"
        name="task"
        required
      />

      <dao-form-item
        :label="'sub task'"
      >
        <template
          v-for="(tag, index) in formModel.subtasks"
          :key="index"
        >
          <dao-form-item-validate
            label-width="0px"
            :name="`subtasks[${index}]`"
            required
            :control-props="{
              trim: true
            }"
          />
        </template>
        <dao-form-item>
          <div :class="classNames.wrapper.footer">
            <dao-button @click="addSubtask">
              加个朋友
            </dao-button>
          </div>
        </dao-form-item>
      </dao-form-item>

      <dao-form-item
        class="ingress-rules"
        :label="'数据集信息配置'"
      >
        <div class="kpd-form-block">
          <div
            v-for="(rule, index) in formModel.rules"
            :key="index"
            class="kpd-form-block__item"
          >
            <dao-form-item-validate
              label="子数据集名称"
              :name="`rules[${index}].name`"
              required
              :control-props="{
                class: 'input-form-width'
              }"
            />
            <dao-form-item-validate
              label="训练数据集数据包地址"
              :name="`rules[${index}].train`"
              required
              :control-props="{
                class: 'input-form-width'
              }"
            />
            <dao-form-item-validate
              label="测试数据集数据包地址"
              :name="`rules[${index}].test`"
              required
              :control-props="{
                class: 'input-form-width'
              }"
            />
            <dao-form-item-validate
              label="验证数据集数据包地址"
              :name="`rules[${index}].valid`"
              required
              :control-props="{
                class: 'input-form-width'
              }"
            />
            <dao-icon
              v-if="showIconRemove"
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
              <span class="align-middle">
                添加
              </span>
            </span>
          </div>
        </div>
      </dao-form-item>

      <dao-form-item label="列名配置">
        <dao-key-value-editor
          form-width="400px"
          @add="push"
          @remove="remove"
        />
      </dao-form-item>

      <dao-form-item label="数据集插件配置">
        <dao-switch />
      </dao-form-item>

      <dao-form-item label="插件名称">
        <dao-select>
          <dao-option
            label="boy"
            :value="true"
          />
          <dao-option
            label="girl"
            :value="false"
          />
          <dao-option
            label="who?"
            value="ha"
          >
            The third gender
          </dao-option>
          <dao-option
            v-for="i in 1000"
            :key="i"
            :value="i"
          />
        </dao-select>
      </dao-form-item>

      <dao-form-item-validate
        label="数据源信息"
        name="name"
        required
        :control-props="{
          class: '!w-[400px]',
        }"
      />
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

// :deep(.multi-row-editor__row) {
//   .multi-row-editor__column:first-of-type {
//     flex: 0 0 180px;
//   }

//   .multi-row-editor__column:last-of-type {
//     flex: 0.7;
//   }
// }

// :deep(.multi-row-editor__column) {
//   overflow: hidden;

//   .dao-select {
//     width: 100%;
//   }
// }

.ingress-rules {
  &__create-secret-btn {
    flex-direction: row-reverse;

    :deep(.dao-text-button__slot) {
      margin-right: 5px;
      margin-left: 0;
    }
  }
}
</style>
