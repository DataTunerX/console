<script lang="ts" setup>

import { LLMCheckpoint } from '@/api/checkpoint';

import { Theme as llmTheme } from '@/api/large-language-model';
import { Theme as datasetTheme } from '@/api/dataset';
import { Theme as hyperparameterTheme } from '@/api/hyperparameter';
import clipboardCopy from '@/utils/copyContent';
import simpleErrorNoty from '@/utils/simpleErrorNoty';
import { noty } from '@/plugins/dao-style';

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

const copy = async () => {
  try {
    await clipboardCopy(props.data.spec?.checkpointImage?.checkPointPath ?? '');
    noty.success({ title: t('common.copied') });
  } catch (e) {
    simpleErrorNoty(e);
  }
};

</script>

<template>
  <div class="registry-card">
    <div class="registry-card__metadata">
      <img
        alt="llama2"
        class="registry-card__metadata-logo"
        src="@/assets/images/llama.jpeg"
      >

      <div class="flex flex-col flex-1 overflow-hidden">
        <div
          class="flex justify-between"
          :title="props.data.metadata?.name"
        >
          <span class="registry-card__metadata-name flex-1">
            {{ props.data.metadata?.name }}
          </span>
        </div>

        <div class="flex items-center">
          <dao-label-extend
            class="registry-card__metadata-keyword"
            :color="llmTheme"
          >
            <dao-ellipsis>
              {{ props.data.spec?.llm?.spec?.llmMetdata?.name }}
            </dao-ellipsis>
          </dao-label-extend>

          <dao-label-extend
            class="registry-card__metadata-keyword ml-[10px]"
            :color="datasetTheme"
          >
            <dao-ellipsis>
              {{ props.data.spec?.dataset.datasetRef }}
            </dao-ellipsis>
          </dao-label-extend>

          <dao-label-extend
            class="registry-card__metadata-keyword ml-[10px]"
            :color="hyperparameterTheme"
          >
            <dao-ellipsis>
              {{ props.data.spec?.hyperparameter.hyperparameterRef }}
            </dao-ellipsis>
          </dao-label-extend>
        </div>
      </div>
    </div>

    <div
      class="registry-card__description"
      title="registry.url"
    >
      {{ t("views.ModelRegistry.modelfileaddress") }} {{ props.data.spec?.checkpointImage?.checkPointPath }}
    </div>

    <div
      class="registry-card__footer"
    >
      <dao-action-icon
        class="mr-[8px]"
        :tooltip-content="$t('common.delete')"
        name="icon-delete-line"
        @click="onDelete"
      />
      <dao-action-icon
        :tooltip-content="$t('common.copy')"
        name="icon-duplicate"
        @click.prevent="copy"
      />
      <dao-action-icon
        :tooltip-content="$t('views.ModelRegistry.deploy')"
        name="icon-gitops"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.registry-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 144px;
  padding: 20px 20px 16px;
  overflow: hidden;
  color: var(--dao-text-secondary);
  background: var(--dao-pure-white);
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(var(--dao-pure-black-rgb), 0.07);
  transition: box-shadow 0.3s ease-in-out;

  &__metadata-keyword {
    height: 20px;
    line-height: 20px;
  }

  &__metadata {
    display: flex;
    flex: none;

    &-logo {
      width: 50px;
      height: 50px;
      margin-right: 16px;
    }

    &-name {
      height: 20px;
      margin-bottom: 12px;
      overflow: hidden;
      font-size: 16px;
      font-weight: 700;
      color: var(--dao-text-primary);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__description {
    /* stylelint-disable-next-line value-no-vendor-prefix */
    display: -webkit-box;
    flex: none;
    height: 40px;
    margin-top: 16px;
    overflow: hidden;
    font-size: 13px;
    font-weight: 700;
    line-height: 20px;
    color: var(--dao-gray-040);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
  }

  &__footer {
    position: absolute;
    right: 0;
    bottom: -54px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 54px;
    padding: 0 12px;
    background-color: rgba(var(--dao-gray-blue-090-rgb), 0.85);
    border-radius: 0 0 8px 8px;
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    box-shadow: 0 4px 12px 0 rgba(var(--dao-pure-black-rgb), 0.18);

    .registry-card__footer {
      bottom: 0;
    }
  }
}
</style>
