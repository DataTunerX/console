<template>
  <dao-dialog
    size="md"
    :model-value="modelValue"
    :header="header"
    @cancel="$emit('reject')"
  >
    {{ content }}

    <template #footer>
      <dao-confirm-dialog-footer
        :text="name"
        :confirm-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
        :confirm-loading="isPosting"
        @confirm="handleConfirm"
        @cancel="$emit('reject')"
      />
    </template>
  </dao-dialog>
</template>
<script lang="ts" setup>
import { PropType, ref } from 'vue';
import { DaoConfirmDialogFooter } from '@dao-style/extend';
import { noty } from '@/plugins/dao-style';
import { useI18n } from 'vue-i18n';
import { nError } from '@/utils/useNoty';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  header: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  deleteFn: {
    // 这里的必填参数，实际没怎么使用，主要为了绕过 ExtractPropTypes 的bug
    type: Function as PropType<(name: string) => Promise<unknown>>,
    default: () => Promise.resolve(true),
  },
  noty: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(['reject', 'resolve']);

const { t } = useI18n();
const isPosting = ref(false);

const handleConfirm = async () => {
  if (!(props.deleteFn instanceof Function)) {
    return;
  }

  try {
    isPosting.value = true;
    await props.deleteFn(props.name);

    if (props.noty) {
      noty.success({ content: t('common.deleteSucceed') });
    }

    emits('resolve');
  } catch (error) {
    isPosting.value = false;

    if (props.noty) {
      nError(t('common.deleteFailed'));
    }
  }
};

</script>
