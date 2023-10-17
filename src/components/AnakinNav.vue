<script lang="ts" setup>
import { computed } from 'vue';
import { getActiveRouteFold } from '@/lib/util';
import { NavRoute } from '@/types/common';

const routes = computed<NavRoute[]>(() => {
  const items = [
    {
      to: { name: 'Datasets' },
      display: '数据集',
      icon: 'icon-cluster',
    },
    {
      to: { name: 'Home' },
      display: 'Home',
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
    class="second-nav"
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

.ghippo-header-sidebar-main {
  margin-left: 20px - $ghippo-header-aside-button-padding;
}

.ghippo-header-aside-button {
  display: block;
  // 此处padding-left + ghippo-header-sidebar-main margin-left = 20px
  padding: 8px + $ghippo-header-aside-button-padding $ghippo-header-aside-button-padding;

  .ghippo-header-aside-icon {
    position: relative;
    display: block;
    width: 18px;
    height: 2px;
    background-color: var(--dao-navigation-090);
    border-radius: 1px;

    &::before,
    &::after {
      position: absolute;
      right: 5px;
      left: 0;
      display: block;
      height: 2px;
      content: '';
      background: var(--dao-navigation-090);
      border-radius: 1px;
      transition: left 0.3s, right 0.3s;
      will-change: left, right;
    }

    &::before {
      top: -6px;
    }

    &::after {
      bottom: -6px;
    }

    &--active {
      &::before,
      &::after {
        right: 0;
        left: 5px;
      }
    }
  }
}

.ghippo-header-nav-main {
  // position: fixed;
  // 和header高有关
  top: $ghippo-header-height;
  bottom: 0;
  left: 0;
  // loading的z-index是9999
  z-index: 10000;
  min-width: 210px;
  overflow: hidden auto;
  background-color: var(--dao-navigation-010);

  &--no-scrollbar {
    pointer-events: none;
  }

  .ghippo-nav-body {
    pointer-events: auto;
  }
}

@keyframes slide-in-left {
  from {
    visibility: visible;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.slide-in-left-enter-active {
  animation: slide-in-left 0.3s ease-in;
}

.slide-in-left-leave-active {
  animation: slide-in-left 0.3s ease-in reverse;
}

.ghippo-nav-title {
  height: 46px;
  padding-left: 20px;
  font-size: 12px;
  font-weight: bold;
  line-height: 46px;
  color: rgba(var(--dao-navigation-050-rgb), 0.6);
}

.cluster-detail {
  display: flex;
  width: 100%;

  &__nav {
    z-index: 99;
    flex: none;

    .dao-icon.icon-new-tab {
      color: var(--dao-gray-blue-040);
    }

    &-title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      margin-right: 12px;
      margin-left: 12px;
      line-height: 30px;
    }

    &-title {
      overflow: hidden;
      font-size: 15px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-exchange {
      margin-left: 4px;
      font-size: 16px;
      font-weight: 400;
      cursor: pointer;
    }

    &__menu {
      width: 250px !important;
      margin-left: 41px !important;
    }
  }

  &__content {
    flex: 1 1 0;
    height: 100%;
    overflow: auto;
  }
}
</style>
