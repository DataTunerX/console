<script lang="ts" setup>
const { t } = useI18n();

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
    default: 3,
  },
});
const chatInput = ref<string>('');

const chatInputLength = computed(() => chatInput.value.length);

</script>

<template>
  <div class="dao-textarea-container">
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <textarea
      v-model="chatInput"
      class="dao-textarea"
      :rows="props.rows"
      :maxlength="props.maxlength"
      :placeholder="props.placeholder"
    />
    <div class="dao-textarea-footer">
      {{ `${chatInputLength}/${props.maxlength}` }}
      <!-- <dao-action-icon
      name="icon-slim-check"
      class="dao-textarea-footer-icon"
      size="xs"
      type="button"
    /> -->
      <div class="dao-textarea-footer-button">
        {{ t('views.InferenceApplication.compare.send') }}
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
  background-color: var(--dao-gray-blue-090);
  border-radius: 3px;

  .dao-textarea {
    position: relative;
    width: 100%;
    resize: vertical;
    background-color: var(--dao-gray-blue-090);
    border-color: var(--dao-gray-blue-050);

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
      backdrop-filter: blur(4px);
      border-radius: 4px;

      &-button {
        margin-left: 6px;
        cursor: pointer;
      }
    }
  }

}
</style>
