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
          params: { id: 'asdf' },
        }"
      >
        数据集1
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
        <template #kv-tag="{row}">
          <dao-key-value-layout-item :label="row.label">
            <dao-hover-card
              :data="row.value?.split(',')"
            />
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
          <span class="dataset-item__text">CC BY</span>
        </dao-key-value-layout-item>

        <dao-key-value-layout-item
          class="text-center"
          label="数据集大小"
        >
          <span class="dataset-item__text dataset-item__size">1100 KB</span>
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

<script lang="ts" setup>
import { computed } from 'vue';

const editDataset = () => {
  console.log('editDataset');
};

const onDelete = () => {
  console.log('onDelete');
};

const infos = computed(() => {
  const items = [
    {
      label: 'Task',
      value: 'ssss',
    },
    {
      label: '训练数据',
      value: 'ssss',
    },
    {
      label: '创建时间',
      value: '2023-09-01 16:50',
    },
    {
      label: '测试数据',
      value: 'ssss',
    },
    {
      label: 'Tags',
      value: `'docker.m.daocloud.io/victoriametrics/vmalert:v1.71.0',
        'docker.m.daocloud.io/jimmidyson/configmap-reload:v0.3.0',
        'docker.m.daocloud.io/victoriametrics/vmalert:v1.71.0',
        'docker.m.daocloud.io/jimmidyson/configmap-reload:v0.3.0',
        'docker.m.daocloud.io/victoriametrics/vmalert:v1.71.0',
        'docker.m.daocloud.io/jimmidyson/configmap-reload:v0.3.0',
        'docker.m.daocloud.io/victoriametrics/vmalert:v1.71.0',
        'docker.m.daocloud.io/jimmidyson/configmap-reload:v0.3.0',
        'docker.m.daocloud.io/victoriametrics/vmalert:v1.71.0',
        'docker.m.daocloud.io/jimmidyson/configmap-reload:v0.3.0',
        'docker.m.daocloud.io/victoriametrics/vmalert:v1.71.0',
        'docker.m.daocloud.io/jimmidyson/configmap-reload:v0.3.0',
        'docker.m.daocloud.io/victoriametrics/vmalert:v1.71.0'`,
      slotId: 'tag',

    },
    {
      label: '验证数据',
      value: 'ssss',
    },
  ];

  return items;
});
</script>

<style lang="scss">
.dataset-item {
  &__header {
    display: flex;
    align-items: center;
    font-weight: 700;
    color: var(--dao-text-pageTitle);

    .svg-icon {
      width: 24px;
      height: 24px;
    }

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

  // &__base-info.dao-card-item {
  //   flex: 1.25 1 0;
  // }

  &__text {
    font-size: 28px;
    font-weight: bold;
  }

  &__size{
    color: var(--dao-green-030);
  }
}

.dao-key-value-layout.is-horizontal .dao-key-value-layout-item__label {
  width: 130px;
}
</style>
