<script lang="ts" setup>
import { vLoading } from '@dao-style/extend';
import { nError } from '@/utils/useNoty';

const props = defineProps({
  fileListType: {
    type: String,
    default: 'text/plain',
  },

  fileSize: {
    type: Number,
    default: 1000,
  },

  isMultiple: {
    type: Boolean,
    default: true,
  },

  handleUpload: {
    type: Function,
    default: () => Promise.resolve(true),
  },
});

const { t } = useI18n();

const emit = defineEmits(['beforeUpload', 'onUpload', 'afterUpload']);

const isLoading = ref(false);

const uploadInput = ref<HTMLElement| null>(null);

const dealFilechange = (e:Event) => {
  const input = e.target as HTMLInputElement;

  const { files } = input;

  if (files?.length) {
    for (let index = 0; index < files.length; index += 1) {
      const element = files[index];
      const splitResult = element.name.split('.');

      if (props.fileListType.indexOf(splitResult[splitResult.length - 1]) === -1) {
        nError(t('common.unsupportedFileTypes'));
      }
    }
    emit('beforeUpload', files);
    input.value = '';
  }
};

const clickUploadBtn = () => {
  const oBtn = uploadInput.value as HTMLInputElement;

  oBtn.click();
};

</script>

<template>
  <input
    ref="uploadInput"
    type="file"
    name="icon"
    aria-labelledby="temperature low"
    hidden
    :accept="props.fileListType"
    :multiple="props.isMultiple"
    @change="dealFilechange"
  >
  <span
    v-loading="isLoading"
    class="inline-block"
    @click="clickUploadBtn"
  >
    <slot />
  </span>
</template>
