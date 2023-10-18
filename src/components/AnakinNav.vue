<script lang="ts" setup>
import { computed } from 'vue';
import { getActiveRouteFold } from '@/lib/util';
import { NavRoute } from '@/types/common';

const routes = computed<NavRoute[]>(() => {
  const items = [
    {
      to: { name: 'DatasetList' },
      display: '数据集',
      icon: 'icon-cluster',
    },
    {
      to: { name: 'HyperparameterList' },
      display: '参数组',
      icon: 'icon-container',
    },
  ] as NavRoute[];

  return items;
});

const activeOpened = computed(() => getActiveRouteFold(routes.value));

</script>

<template>
  <dao-nav
    ref="navRef"
    class="console__nav"
    type="2nd"
    :active-opened="activeOpened"
  >
    <template #header>
      <dao-nav-head
        icon="icon-engine"
        title="DataTunerX"
        use-font
      />
    </template>
    <router-link
      v-for="(route, index) in routes"
      :key="index"
      v-slot="{ isActive, navigate }"
      :to="route.to"
      custom
    >
      <dao-nav-sub
        :index="index"
        :icon="route.icon"
        :title="route.display"
        :fold="Boolean(route.children?.length)"
        use-font
        :is-active="isActive"
        @click="navigate"
      >
        <template v-if="route.children?.length">
          <router-link
            v-for="(ch, chIdx) in route.children"
            :key="ch.display"
            v-slot="{ isActive: chIsActive, navigate: chNavigate }"
            :to="ch.to"
            custom
          >
            <dao-nav-item
              :index="`${index}-${chIdx}`"
              :title="ch.display"
              :is-active="chIsActive"
              use-font
              @click="chNavigate"
            />
          </router-link>
        </template>
      </dao-nav-sub>
    </router-link>
  </dao-nav>
</template>

<style lang="scss">
$ghippo-header-height: 50px;
$ghippo-header-aside-button-padding: 2px;

.console {
  &__nav {
    z-index: 99;
    flex: none;

  //   .dao-icon.icon-new-tab {
  //     color: var(--dao-gray-blue-040);
  //   }

  //   &-title-wrap {
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;
  //     height: 30px;
  //     margin-right: 12px;
  //     margin-left: 12px;
  //     line-height: 30px;
  //   }

  //   &-title {
  //     overflow: hidden;
  //     font-size: 15px;
  //     font-weight: 600;
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //   }

  //   &-exchange {
  //     margin-left: 4px;
  //     font-size: 16px;
  //     font-weight: 400;
  //     cursor: pointer;
  //   }

  //   &__menu {
  //     width: 250px !important;
  //     margin-left: 41px !important;
  //   }
  // }

  // &__content {
  //   flex: 1 1 0;
  //   height: 100%;
  //   overflow: auto;
  }
}
</style>
