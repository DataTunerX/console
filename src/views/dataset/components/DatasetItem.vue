<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { Dataset } from '@/api/dataset';
import { useDayjs } from '@/lib/util';
import { useRouter } from 'vue-router';

const props = defineProps({
  data: {
    type: Object as PropType<Dataset>,
    default: () => ({}),
  },
});

const router = useRouter();
const emits = defineEmits(['on-delete']);

const $dayjs = useDayjs();

const editDataset = () => {
  router.push({
    name: 'DatasetCreate',
    query: {
      name: props.data.metadata.name,
    },
  });
};

const onDelete = () => {
  emits('on-delete', props.data.metadata.name);
};

const infos = computed(() => {
  const {
    metadata: { creationTimestamp },
    spec: {
      datasetMetadata: {
        datasetInfo: {
          subsets: [
            {
              splits,
            },
          ],
        },
        tags, task,
      },
    },
  } = props.data;

  const items = [
    {
      label: 'Task',
      value: task.name,
    },
    {
      label: '训练数据',
      value: splits?.test.file,
    },
    {
      label: '创建时间',
      value: creationTimestamp ? $dayjs(creationTimestamp).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      label: '测试数据',
      value: splits?.train.file,
    },
    {
      label: 'Tags',
      value: tags.join(','),
      slotId: 'tag',
    },
    {
      label: '验证数据',
      value: splits?.validate.file,
    },
  ];

  return items;
});
</script>

<template>
  <dao-card
    class="dataset-item"
    icon="icon-mspider"
    divider
    use-font
  >
    <template #title>
      <router-link
        class="dataset-item__header__text active"
        :to="{
          name: 'DatasetDetail',
          params: { name: props.data.metadata.name },
        }"
      >
        {{ props.data.metadata.name }}
      </router-link>

      <dao-state-icon :type="'success'">
        可用
      </dao-state-icon>

      <dao-state-icon :type="'error'">
        不可用
      </dao-state-icon>
    </template>

    <template #action>
      <dao-dropdown placement="bottom-end">
        <dao-button
          type="ghost"
          icon-left="icon-more-horizontal"
          use-font
          size="sm"
        />
        <template #menu>
          <dao-dropdown-menu>
            <dao-dropdown-item @click="editDataset">
              编辑
            </dao-dropdown-item>
            <dao-dropdown-item type="divider" />
            <dao-dropdown-item
              color="red"
              @click="onDelete"
            >
              删除
            </dao-dropdown-item>
          </dao-dropdown-menu>
        </template>
      </dao-dropdown>
    </template>

    <dao-card-item>
      <dao-key-value-layout
        :column="2"
        :data="infos"
      >
        <template #kv-tag="{ row }">
          <dao-key-value-layout-item :label="row.label">
            <dao-hover-card :data="row.value?.split(',')" />
          </dao-key-value-layout-item>
        </template>
      </dao-key-value-layout>
    </dao-card-item>

    <dao-card-item class="flex">
      <dao-key-value-layout
        :direction="'vertical'"
        class="flex flex-nowrap flex-grow items-center"
      >
        <dao-key-value-layout-item
          label="许可证信息"
          class="text-center"
        >
          <span class="dataset-item__text">
            {{ props.data.spec.datasetMetadata.license }}
          </span>
        </dao-key-value-layout-item>

        <dao-key-value-layout-item
          class="text-center"
          label="数据集大小"
        >
          <span class="dataset-item__text dataset-item__size">
            {{ props.data.spec.datasetMetadata.size }}
          </span>
        </dao-key-value-layout-item>

        <dao-key-value-layout-item
          class="text-center"
          label="使用插件"
          value="Value3"
        >
          <span class="dataset-item__text">插件名称</span>
        </dao-key-value-layout-item>
      </dao-key-value-layout>
    </dao-card-item>
  </dao-card>
</template>

<style lang="scss" scoped>
.dataset-item {
  &__header {
    display: flex;
    align-items: center;
    font-weight: 700;
    color: var(--dao-text-pageTitle);

    &__text {
      max-width: 75%;
      margin-right: 30px;
      overflow: hidden;
      color: var(--dao-text-primary);
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.active {
        &:hover,
        &:active {
          color: var(--dao-primary-blue-040);
        }
      }
    }

  }

  &__text {
    font-size: 28px;
    font-weight: bold;
  }

  &__size {
    color: var(--dao-green-030);
  }

}
</style>
