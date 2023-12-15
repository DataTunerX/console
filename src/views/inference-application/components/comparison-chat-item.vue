<script lang="ts" setup>
import Markdown from '@/components/MarkdownWrapper.vue';
import text from './text.md';

const { t } = useI18n();

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="comparison-chat-item-container">
    <div class="comparison-chat-item-container-header">
      <div class="app-name">
        <dao-icon
          name="icon-apps"
          use-font
        />
        <span class="app-name-text">{{ props.name }}</span>
      </div>
      <dao-tag>aaa</dao-tag>
    </div>

    <div class="chat-markdown">
      <Markdown :source="text" />
    </div>

    <div class="comparison-chat-item-container-footer">
      <div class="footer-item">
        <div>16.3s</div>
        <div class="footer-item-label">
          {{ t('views.InferenceApplication.compare.elapsedTime') }}
        </div>
      </div>
      <div class="footer-item">
        <div>100.0</div>
        <div class="footer-item-label">
          {{ t('views.InferenceApplication.compare.tokensTotalQuantity') }}
        </div>
      </div>
      <div class="footer-item">
        <div>22.3</div>
        <div class="footer-item-label">
          {{ t('views.InferenceApplication.compare.perSecond') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comparison-chat-item-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .app-name {
      display: flex;
      align-items: center;
      font-weight: 500;
      color: var(--dao-icon-primary);

      &-text {
        margin-left: 4px;
      }
    }
  }

  .chat-markdown {
    flex: 1;
    margin: 10px 0;
    overflow: scroll;
    border: 1px solid var(--dao-gray-blue-050);
    border-radius: 5px;
  }

  &-footer{
    display: flex;
    justify-content: flex-end;

    .footer-item {
      line-height: 20px;

      &:not(:last-child) {
        margin-right: 20px;
      }

      &-label{
        font-weight: 400;
        color: var(--dao-gray-090);
      }
    }
  }
}
</style>
