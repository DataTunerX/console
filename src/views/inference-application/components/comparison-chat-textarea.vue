<script lang="ts" setup>

const props = defineProps({
  placeholder: {
    type: String,
    default: '',
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
  emptyChatQuestionFn: {
    type: Function,
    default: () => null,
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

const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
const lineHeight = 2.1 * remInPixels;
const height = ref<number>(lineHeight);
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
  <div class="comparison-textarea">
    <div
      class="mr-[6px] mb-[8px] cursor-pointer"
      @click="props.emptyChatQuestionFn"
    >
      <SvgIcon
        name="empty"
        :size="24"
        color="var(--dao-text-page-title)"
      />
    </div>
    <div class="comparison-textarea-container">
      <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
      <textarea
        v-model="chatInput"
        class="dao-textarea"
        :class="{ 'is-overflow': isOverflow }"
        :rows="props.rows"
        :placeholder="props.placeholder"
        :style="{ height: `${height}px`}"
      />
      <div class="right-button">
        <div
          class="textarea-button bg-[var(--dao-system-primary)]"
          @click="props.sendQuestionFn"
        >
          <SvgIcon
            name="send"
            :size="14"
            color="var(--dao-pure-white)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.comparison-textarea {
  display: flex;
  align-items: flex-end;

  &-container {
    display: flex;
    align-items: flex-end;
    width: 100%;
    vertical-align: bottom;
    background-color: var(--dao-gray-200);
    border: 1px solid var(--dao-gray-blue-050);
    border-radius: 10px;

    .dao-textarea {
      flex-grow: 1;
      min-height: unset;
      max-height: 200px;
      padding: 0;
      margin: 1.2rem 0 1.2rem 1.2rem;
      overflow-y: hidden;
      font-size: 1.4rem;
      line-height: 2.1rem;
      color: #000;
      resize: none;
      background-color: var(--dao-gray-200);
      border: 0;
      transition: none;

      &:focus{
        box-shadow: none;
      }

      &.is-overflow {
        overflow-y: scroll;
      }
    }

    .right-button {
      flex-grow: 0;
      margin: 0 10px 0 6px;
      font-size: 12px;
      line-height: 14px;
    }
  }

  .textarea-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 1rem;
    cursor: pointer;
    border-radius: 0.5rem;
  }
}

</style>
