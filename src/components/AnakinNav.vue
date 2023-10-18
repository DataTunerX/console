<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AnakinNav',
});
</script>

<template>
  <dao-nav
    ref="navRef"
    type="2nd"
    :active-opened="['3']"
  >
    <template #header>
      <dao-nav-head
        icon="icon-apps"
        title="Application"
        use-font
      />
    </template>
    <dao-nav-sub
      index="2"
      icon="icon-pod"
      title="Plugins"
      :disabled="true"
      use-font
    >
      <dao-nav-item
        index="2-1"
        icon="icon-dce"
        title="DNS"
        use-font
      />
      <dao-nav-item
        index="2-2"
        icon="icon-cluster"
        title="这个是超过正常长度的nav-item"
        use-font
      />
      <dao-nav-item
        index="2-3"
        icon="icon-cluster"
        title="2048"
        use-font
      />
      <dao-nav-item
        index="2-4"
        icon="icon-cluster"
        title="2048"
        use-font
      />
      <dao-nav-item
        index="2-5"
        icon="icon-cluster"
        title="2048"
        use-font
      />
      <dao-nav-item
        index="2-6"
        icon="icon-cluster"
        title="2048"
        use-font
      />
      <dao-nav-item
        index="2-7"
        icon="icon-cluster"
        title="2048"
        use-font
      />
    </dao-nav-sub>
    <dao-nav-sub
      index="3"
      icon="icon-registry"
      title="这个是超过正常长度的nav-item"
      use-font
    >
      <dao-nav-item
        index="3-1"
        icon="icon-container"
        title="这个是超过正常长度的nav-item"
        disabled
        use-font
      />
      <dao-nav-item
        index="3-2"
        icon="icon-user"
        title="Helm"
        use-font
      />
    </dao-nav-sub>
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
</style>
