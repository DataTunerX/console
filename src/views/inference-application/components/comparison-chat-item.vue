<script lang="ts" setup>
import Markdown from '@/components/MarkdownWrapper.vue';
// import text from './text.md';

const { t } = useI18n();

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  chatResult: {
    type: Object,
    default: () => ({
      elaspedTime: 0,
      tokenLength: 0,
      tokenPerSec: 0,
      output: '',
    }),
  },
  loading: {
    type: Boolean,
    default: false,
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
      <Markdown
        :class="{loading: props.loading}"
        :source="props.chatResult.output"
      />
    </div>

    <div class="comparison-chat-item-container-footer">
      <div class="footer-item">
        <div>{{ props.chatResult.elaspedTime }}s</div>
        <div class="footer-item-label">
          {{ t('views.InferenceApplication.compare.elapsedTime') }}
        </div>
      </div>
      <div class="footer-item">
        <div>{{ props.chatResult.tokenLength }}</div>
        <div class="footer-item-label">
          {{ t('views.InferenceApplication.compare.tokensTotalQuantity') }}
        </div>
      </div>
      <div class="footer-item">
        <div>{{ props.chatResult.tokenPerSec }}</div>
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

    .loading {
      &::before {
        display: block;
        width: 1px;
        height: 16px;
        content:' ';
        background-color: var(--dao-gray-010);
        animation: blink 1s infinite steps(1, start)
      }
    }
    @keyframes blink {
      0%{
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }
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
