<script lang="ts" setup>
import { LabelExtendColor } from '@dao-style/extend';
import ComparisonChatItem from './components/comparison-chat-item.vue';
import ComparisonChatTextarea from './components/comparison-chat-textarea.vue';

interface ExampleMap {
  text: string;
  color: LabelExtendColor;
}

const { query } = useRoute();

const servicename = computed(() => {
  if (Array.isArray(query.servicename)) {
    return query.servicename as string[];
  }

  return [query.servicename as string];
});

const examples: ExampleMap[] = [
  {
    text: 'aaaaahjshas',
    color: 'purple',
  },
  {
    text: 'aaaaahjshas',
    color: 'purple',
  },
  {
    text: 'aaaaahjshas',
    color: 'purple',
  },
  {
    text: 'aaaaahjshas',
    color: 'purple',
  },
  {
    text: 'aaaaahjshas',
    color: 'purple',
  },
  {
    text: 'aaaaahjshas',
    color: 'purple',
  },
  {
    text: 'aaaaajkbadhjhwohuijhduiow',
    color: 'purple',
  },
  {
    text: 'aaaaa',
    color: 'purple',
  },
  {
    text: 'aaaaa',
    color: 'green',
  },
  {
    text: 'aaaasjhsjkahdsjlna',
    color: 'green',
  },
  {
    text: 'aaaaa',
    color: 'green',
  },
  {
    text: 'aaaaa',
    color: 'green',
  },
  {
    text: 'aaaanjskalnkalna',
    color: 'green',
  },
  {
    text: 'aaamnsdjlkbnwajlbaa',
    color: 'skyblue',
  },
  {
    text: 'aaaaa',
    color: 'skyblue',
  },
  {
    text: 'aaaaa',
    color: 'skyblue',
  },
  {
    text: 'aaaaa',
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
        v-for="(name, index) in servicename"
        :key="index"
      >
        <ComparisonChatItem
          :key="index"
          :name="name"
        />
      </dao-card-item>
    </dao-card>

    <div class="compare-input-card">
      <ComparisonChatTextarea
        :placeholder="'在这里输入问题，或挑选指令模板'"
        :maxlength="4000"
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
            v-for="({ text, color }, index) in examples"
            :key="index"
            :color="color"
            class="issue-example-container-item"
          >
            {{ text }}
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
      // margin-right: -12px;

      &-item {
        margin-top: 8px;
        margin-right: 12px;
      }

    }
  }
}
</style>
