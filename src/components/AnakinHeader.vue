<script setup lang="ts">
import { computed } from 'vue';
import { noop } from '@vueuse/core';
import { i18n } from '@/plugins';
import AnakinHeaderButton from '@/components/AnakinHeaderButton.vue';
import Avatar from '@/assets/avatar.webp';
import { useNamespaceStore } from '@/stores/namespace';

const userOperation = computed(() => [
  {
    label: i18n.t('components.AnakinHeader.user.personal-center'),
    icon: 'icon-user',
    href: './ghippo/profile',
    operate: noop,
  },
  {
    label: i18n.t('components.AnakinHeader.user.setting'),
    icon: 'icon-setting',
    href: './ghippo/settings',
    operate: noop,
  },
  {
    label: i18n.t('components.AnakinHeader.user.logout'),
    icon: 'icon-logout',
    operate: noop,
  },
]);

const namespaceStore = useNamespaceStore();

const namespace = computed({
  get() {
    return namespaceStore.namespace;
  },
  set(val) {
    namespaceStore.setNamespace(val);
  },
});
</script>

<template>
  <header class="ghippo-header">
    <!-- <div class="" /> -->
    <div class="ghippo-header-logo">
      <img
        class="ghippo-header-logo-img"
        src="@/assets/logo.png"
      >
    </div>

    <!-- <span class="ghippo-header__namespace"> {{ i18n.t('components.AnakinHeader.namespace') }} </span> -->
    <dao-select
      v-model="namespace"
      search
      class="ml-[30px]"
    >
      <dao-option
        v-for="ns in namespaceStore.namespaces"
        :key="ns.metadata?.name"
        :label="ns.metadata?.name"
        :value="ns.metadata?.name"
      />
    </dao-select>

    <div class="ghippo-toolbox">
      <div class="ghippo-toolbox-item">
        <dao-dropdown
          trigger="click"
          :offset="5"
        >
          <anakin-header-button class="ghippo-user-trigger">
            <img
              class="ghippo-user-avatar"
              :src="Avatar"
              alt="user.username"
            >
            <span class="ghippo-user-username"> Max </span>
            <dao-icon
              use-font
              name="icon-dropdown-line"
              class="ghippo-user-drop-icon"
            />
          </anakin-header-button>
          <template #menu>
            <dao-dropdown-menu>
              <dao-dropdown-item
                v-for="operate in userOperation"
                :key="operate.label"
                @click="operate.operate"
              >
                <dao-history-link
                  :href="operate.href"
                  :icon="operate.icon"
                  class="ghippo-user-drop--item"
                >
                  {{ operate.label }}
                </dao-history-link>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </template>
        </dao-dropdown>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
$ghippo-header-background: var(--dao-top-gray-010);
$ghippo-header-color: var(--dao-navigation-090);

.ghippo-header {
  display: flex;
  align-items: center;
  height: 50px;
  color: $ghippo-header-color;
  background-color: $ghippo-header-background;

  &__product {
    width: 210px;
    /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
    font-family: PingFang SC-Bold, PingFang SC;
    font-size: 26px;
    font-weight: bold;
    color: #fff;
    text-align: center;
  }

  &__namespace {
    margin-left: 30px;
    font-size: 16px;
    font-weight: bold;
  }
}

.ghippo-header-logo {
  width: 210px;
  text-align: center;
}

.ghippo-header-logo-img {
  height: 36px;
  vertical-align: bottom;
  transform: scale(1.7);
}

.ghippo-toolbox {
  display: flex;
  align-items: center;
  margin-left: auto;

  .ghippo-toolbox-item {
    margin-right: 10px;
  }

  .ghippo-icon-trigger {
    position: relative;
    display: flex;
    padding: 0;
  }

  .ghippo-operate-icon {
    width: 34px;
    height: 34px;
    font-size: 21px;
    line-height: 34px;
    text-align: center;
  }

  .ghippo-message-count-box {
    position: absolute;
    top: -1px;
    right: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: var(--dao-orange-030);
    border-radius: 50%;

    .ghippo-message-count {
      font-size: 20px;
      font-weight: 600;
      color: var(--dao-pure-white);
      transform: scale(0.5);
    }
  }

  .ghippo-user-trigger {
    display: flex;
    align-items: center;
  }

  .ghippo-user-avatar {
    height: 36px;
    margin-right: 8px;
    vertical-align: middle;
  }

  .ghippo-user-default-avatar {
    width: 24px;
    height: 24px;
    font-size: 24px;
  }

  .ghippo-user-username {
    margin-right: 14px;
  }

  .ghippo-user-drop-icon {
    width: 14px;
    height: 14px;
    font-size: 14px;
    transform: rotate(90deg);
  }
}

.ghippo-user-drop--item {
  display: flex;
  margin: 0 -20px 0 -5px;
  color: var(--dao-gray-010);
  text-decoration: none;

  .dao-text-button__icon {
    margin-right: 10px;
    font-size: 16px;
    color: #a2a7b0;
  }
}
</style>
