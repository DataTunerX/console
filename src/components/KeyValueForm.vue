<template>
  <dao-key-value-editor
    ref="editorRef"
    v-model="labels"
    :key-placeholder="$t('components.KeyValueEditor.key')"
    :value-placeholder="$t('components.KeyValueEditor.value')"
    :add-text="$t('components.KeyValueEditor.add')"
    :form-width="formWidth"
    :show-label="showLabel"
    v-bind="$attrs"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
import {
  defineEmits, defineProps, PropType, ref, watch,
} from 'vue';
import { formatKeyValueListToObj, formatLabelToKeyValueList } from '@/lib/util';
import isEqual from 'lodash/isEqual';
import { KeyValue, LabelType } from '@/types/common';

const props = defineProps({
  modelValue: {
    type: Object as PropType<KeyValue>,
    default: () => ({}),
  },
  formWidth: {
    type: String,
    default: '400px',
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  hiddenKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emits = defineEmits(['update:modelValue']);
const labels = ref<LabelType[]>([]);
const emitValue = ref<KeyValue>();

// 没有使用计算属性获取 props 最新的值
// 因为Object转换的时候，keys是无序的，直接使用更新后的props，每次添加排序的位置会很诡异
watch(() => props.modelValue, (newValue) => {
  if (!newValue && labels.value.length) {
    labels.value = [];
  }

  let filteredValue = newValue;

  if (props.hiddenKeys.length) {
    filteredValue = Object.keys(newValue)
      .reduce((acc, key) => {
        if (!props.hiddenKeys.includes(key)) {
          acc[key] = newValue[key];
        }

        return acc;
      }, {} as KeyValue);
  }

  if (!isEqual(filteredValue, emitValue.value)) {
    labels.value = formatLabelToKeyValueList(filteredValue);
  }
}, {
  deep: true,
  immediate: true,
});

const handleChange = () => {
  emitValue.value = formatKeyValueListToObj(labels.value);

  const realMv = {
    ...emitValue.value,
  };

  if (props.hiddenKeys.length > 0) {
    const currentkeys = Object.keys(props.modelValue);

    props.hiddenKeys.forEach((key) => {
      if (currentkeys.includes(key)) {
        realMv[key] = props.modelValue[key];
      }
    });
  }

  emits('update:modelValue', realMv);
};

const editorRef = ref();
const validate = async () => {
  const valid = await editorRef.value.valid();

  return valid;
};

defineExpose({
  validate,
});
</script>
