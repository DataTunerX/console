<template>
  <dao-card
    class="mesh-item"
    icon="icon-mspider"
    divider
    use-font
  >
    <template #title>
      <router-link
        class="cluster-item__header__text active"
        :to="{
          name: 'DatasetDetail',
          params: { id: 'asdf'},
        }"
      >
        数据集1
      </router-link>
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
      <dao-key-value-layout :direction="'vertical'">
        <dao-key-value-layout-item>
          <template #label>
            Label1
          </template>
          value1
        </dao-key-value-layout-item>
        <dao-key-value-layout-item
          label="Label2"
          value="Value2"
        />
        <dao-key-value-layout-item
          label="Label3"
          value="Value3"
        />
        <dao-key-value-layout-item
          label="Label4"
          value="Value4"
        />
      </dao-key-value-layout>
    </dao-card-item>

    <dao-card-item>
      <dao-key-value-layout :direction="'vertical'">
        <dao-key-value-layout-item>
          <template #label>
            Label1
          </template>
          value1
        </dao-key-value-layout-item>
        <dao-key-value-layout-item
          label="Label2"
          value="Value2"
        />
        <dao-key-value-layout-item
          label="Label3"
          value="Value3"
        />
      </dao-key-value-layout>
    </dao-card-item>
  </dao-card>
</template>

<script lang="ts" setup>
const editDataset = () => {
  console.log('editDataset');
};

const onDelete = () => {
  console.log('onDelete');
};
</script>

<style lang="scss">
.cluster-item {
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

  &__base-info.dao-card-item {
    flex: 1.25 1 0;
  }
}

.dao-key-value-layout.is-horizontal .dao-key-value-layout-item__label {
  width: 130px;
}
</style>
