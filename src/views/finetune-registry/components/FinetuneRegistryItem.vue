<script lang="ts" setup>
import { PropType } from 'vue';
import { LLMCheckpoint } from '@/api/checkpoint';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  data: {
    type: Object as PropType<LLMCheckpoint>,
    default: () => ({}),
  },
});
const emits = defineEmits(['on-delete']);

const { t } = useI18n();

const onDelete = () => {
  emits('on-delete', props.data.metadata?.name);
};

</script>

<template>
  <div class="finetune-registry-item">
    <div class="finetune-registry-item__info">
      <dao-icon
        name="icon-registry"
        class="info__icon"
        use-font
      />
      <div class="info__text">
        <div class="info__text__header">
          {{ props.data.metadata?.name }}
        </div>
        <dao-label-extend
          color="skyblue"
        >
          {{ props.data.spec?.llm?.spec?.llmMetdata?.name }}
        </dao-label-extend>
        <dao-label-extend
          color="orange"
          style="margin-left: 20px;"
        >
          aaa
        </dao-label-extend>
      </div>
    </div>
    <div class="finetune-registry-item__addr">
      {{ t('views.FinetuneRegistry.modelfileaddress') }}：{{ }}
    </div>
    <div class="finetune-registry-item__actions">
      <dao-action-icon
        :tooltip-content="$t('common.delete')"
        name="icon-delete-line"
        @click="onDelete"
      />
      <dao-action-icon
        style="margin-right: 20px;"
        :tooltip-content="$t('views.FinetuneRegistry.deploy')"
        name="icon-gitops"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.finetune-registry-item {
  position: relative;
  height: 180px;
  padding: 30px;
  overflow: hidden;
  background: var(--dao-pure-white);
  border-radius: 15px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.15);

  &__info {
    display: flex;

    .info__icon {
      width: 60px;
      height: 60px;
      font-size: 60px;
    }

    .info__text {
      margin-left: 20px;

      &__header {
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 500;
        line-height: 28px;
        color: #33363B;
      }
    }
  }

  &__addr {
    margin-top: 20px;
    font-weight: 500;
    line-height: 25px;
    color: #979797;
  }

  &__actions {
    position: absolute;
    bottom: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 50px;
    background: #e5e5e5;
  }

  &:hover {
    .finetune-registry-item__actions {
      display: block;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

}
</style>
