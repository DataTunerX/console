<script lang="ts" setup>
import { LabelExtendColor } from '@dao-style/extend';
import { ChatResultMap, inference } from '@/api/ray-service';
import { useNamespaceStore } from '@/stores/namespace';
import { COMPAREINFERENCES } from '@/utils/constant';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import ComparisonChatItem from './components/comparison-chat-item.vue';
import ComparisonChatTextarea from './components/comparison-chat-textarea.vue';

interface ExampleMap {
  label: string;
  text: string;
  color: LabelExtendColor;
}

interface InferenceMap {
  [key: string]: {
    checkpoint: string | undefined;
  }
}

const { t } = useI18n();
const { query } = useRoute();
const { namespace } = storeToRefs(useNamespaceStore());

const servicenames = computed(() => {
  if (Array.isArray(query.servicename)) {
    return query.servicename as string[];
  }

  return [query.servicename as string];
});

const inferences: InferenceMap = JSON.parse(localStorage.getItem(COMPAREINFERENCES) as string);

const chatQuestion = ref<string>('');

const selectedExample = (text: string) => {
  chatQuestion.value = text;
};

const chatResults = ref<ChatResultMap[]>([]);
const chatLoading = ref<boolean>(false);

const fetchChatResult = async () => {
  if (isEmpty(chatQuestion.value) || chatLoading.value) return;
  chatResults.value = [];
  chatLoading.value = true;
  const result = await Promise.all(servicenames.value.map((name) => inference(namespace.value, name, { input: chatQuestion.value })));

  chatResults.value = map(result, 'data');
  chatLoading.value = false;
};

const emptyChatQuestion = () => {
  chatQuestion.value = '';
};

const examplesList: ExampleMap[] = [
  {
    label: t('views.InferenceApplication.examples.e1.label'),
    text: t('views.InferenceApplication.examples.e1.text'),
    color: 'purple',
  },
  {
    label: t('views.InferenceApplication.examples.e2.label'),
    text: t('views.InferenceApplication.examples.e2.text'),
    color: 'purple',
  },
  {
    label: t('views.InferenceApplication.examples.e3.label'),
    text: t('views.InferenceApplication.examples.e3.text'),
    color: 'purple',
  },
  {
    label: t('views.InferenceApplication.examples.e4.label'),
    text: t('views.InferenceApplication.examples.e4.text'),
    color: 'green',
  },
  {
    label: t('views.InferenceApplication.examples.e5.label'),
    text: t('views.InferenceApplication.examples.e5.text'),
    color: 'green',
  },
  {
    label: t('views.InferenceApplication.examples.e6.label'),
    text: t('views.InferenceApplication.examples.e6.text'),
    color: 'skyblue',
  },
  {
    label: t('views.InferenceApplication.examples.e7.label'),
    text: t('views.InferenceApplication.examples.e7.text'),
    color: 'skyblue',
  },
];

</script>

<template>
  <div class="inference-list console-main-container">
    <!-- <dao-header type="3rd">
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-cluster"
          :list="[
            {
              label: t('views.InferenceApplication.list.header'),
              to: { name: 'InferenceApplicationList' },
            },
            {
              label: t('views.InferenceApplication.compare.header'),
            },
          ]"
          @navigate="router.push"
        />
      </template>
    </dao-header> -->

    <dao-card
      type="headless"
      class="compare-card"
    >
      <dao-card-item
        v-for="(name, index) in servicenames"
        :key="index"
      >
        <ComparisonChatItem
          :key="index"
          :name="name"
          :checkpoint="inferences[name].checkpoint"
          :loading="chatLoading"
          :chat-result="chatResults[index]"
        />
      </dao-card-item>
    </dao-card>

    <div class="compare-input-card">
      <ComparisonChatTextarea
        v-model="chatQuestion"
        :placeholder="'在这里输入问题，或挑选指令模板'"
        :send-question-fn="fetchChatResult"
        :empty-chat-question-fn="emptyChatQuestion"
      />
      <div class="issue-example">
        <div class="issue-example-header">
          <dao-icon
            name="icon-list-view"
            class="issue-example-header-icon"
            use-font
          />示例
        </div>
        <div class="issue-example-container">
          <dao-label-extend
            v-for="({ label,text, color }, index) in examplesList"
            :key="index"
            :color="color"
            class="mt-[8px] mr-[12px] cursor-pointer"
            @click="selectedExample(text)"
          >
            {{ label }}
          </dao-label-extend>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.inference-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - var(--sidebar-top));
  padding: 20px;
  overflow: hidden;
}

.compare-card {
  height: 100%;
  overflow: scroll;

  :deep(.dao-card-container) {
    height: 100%;
    padding: 16px;

    .dao-card-item {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }

  :deep(.dao-card-item-container) {
    height: 100%;
  }
}

.compare-input-card {
  padding: 16px;
  margin-top: 20px;
  background: var(--dao-pure-white);
  border-radius: 6px;
  box-shadow: 0 2px 5px 0 rgba(var(--dao-pure-black-rgb), 0.1);

  .issue-example {
    margin-top: 16px;

    &-header {
      display: inline-flex;
      align-items: center;
      color: var(--dao-gray-090);

      &-icon {
        margin-right: 4px;
      }
    }

    &-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

    }
  }
}
</style>
