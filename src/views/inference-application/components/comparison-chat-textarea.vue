<script lang="ts" setup>

const props = defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  maxlength: {
    type: Number,
    default: 100,
  },
  rows: {
    type: Number,
    default: 1,
  },
  modelValue: {
    type: String as PropType<string>,
    default: () => (''),
  },
  sendQuestionFn: {
    type: Function as PropType<() => Promise<unknown>>,
    default: () => Promise.resolve(true),
  },
});

const emit = defineEmits(['update:modelValue']);

const chatInput = computed({
  get() {
    return props.modelValue;
  },

  set(value) {
    emit('update:modelValue', value);
  },
});

const chatInputLength = computed(() => chatInput.value.length);

const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
const lineHeight = 2.1 * remInPixels;
const padding = 2.8 * remInPixels;
const height = ref<number>(lineHeight + padding);
// const height = computed(() => textLines.value * lineHeight + padding);

watch(
  () => chatInput.value,
  () => {
    height.value = 0;
    nextTick(() => {
      height.value = document.querySelector('.dao-textarea')?.scrollHeight || lineHeight;
    });
  },
);

const isOverflow = computed(() => height.value > 200);
</script>

<template>
  <div class="dao-textarea-container">
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <textarea
      v-model="chatInput"
      class="dao-textarea"
      :class="{ 'is-overflow': isOverflow }"
      :rows="props.rows"
      :maxlength="props.maxlength"
      :placeholder="props.placeholder"
      :style="{ height: `${height}px` }"
    />
    <div class="dao-textarea-footer">
      {{ `${chatInputLength}/${props.maxlength}` }}
      <!-- <dao-action-icon
      name="icon-slim-check"
      class="dao-textarea-footer-icon"
      size="xs"
      type="button"
    /> -->
      <div
        class="dao-textarea-footer-button"
        @click="props.sendQuestionFn"
      >
        <SvgIcon
          name="default-config"
          :size="16"
          color="var(--dao-gray-090)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dao-textarea-container {
  position: relative;
  display: inline-block;
  width: 100%;
  vertical-align: bottom;

  .dao-textarea {
    position: relative;
    width: 100%;
    min-height: unset;
    max-height: 200px;
    padding: 1.4rem;
    overflow-y: hidden;
    font-size: 1.4rem;
    line-height: 2.1rem;
    color: #000;
    resize: none;
    background-color: var(--dao-gray-200);
    border-radius: 10px;
    transition: none;

    &.is-overflow {
      overflow-y: scroll;
    }

    &-footer {
      position: absolute;
      right: 10px;
      bottom: 6px;
      display: flex;
      align-items: center;
      padding: 2px 4px;
      font-size: 12px;
      line-height: 14px;
      color: var(--dao-gray-090);
      background: rgb(241 243 246 / 76%);
      border-radius: 4px;

      &-button {
        margin-left: 6px;
        cursor: pointer;
      }
    }
  }
}
</style>
