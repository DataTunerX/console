<script setup lang="ts">
import { i18n } from '@/plugins';
import AnakinHeaderButton from '@/components/AnakinHeaderButton.vue';
import Avatar from '@/assets/avatar.webp';
import { useNamespaceStore } from '@/stores/namespace';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

const logout = async () => {
  await userStore.logout();
  router.push('/');
};

const userOperation = computed(() => [
  {
    label: i18n.t('components.AnakinHeader.user.logout'),
    icon: 'icon-logout',
    operate: logout,
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

watch(namespace, (ns) => {
  if (route.name === 'ConsoleContainer' && ns) {
    router.push({
      name: 'FinetuneExperimentList',
      params: { ns },
    });
  } else if (ns) {
    router.push({
      ...route,
      params: { ns },
    });
  }
}, {
  immediate: true,
});

watch(() => route.params.ns, (ns) => {
  if (ns) {
    namespace.value = ns as string;
  }
});

</script>

<template>
  <header class="datatunerx-header">
    <div class="datatunerx-header-logo">
      <img
        alt="logo"
        class="datatunerx-header-logo-img"
        src="@/assets/logo.png"
      >
    </div>

    <dao-select
      v-model="namespace"
      search
      class="namespace-select"
    >
      <dao-option
        v-for="ns in namespaceStore.namespaces"
        :key="ns.metadata?.name"
        :label="ns.metadata?.name"
        :value="ns.metadata?.name"
      />
    </dao-select>

    <div class="datatunerx-toolbox">
      <div class="datatunerx-toolbox-item">
        <dao-dropdown
          trigger="click"
          :offset="5"
        >
          <anakin-header-button>
            <img
              class="datatunerx-user-avatar"
              :src="Avatar"
              alt="user.username"
            >
            <span class="datatunerx-user-username"> DataTunerX </span>
            <dao-icon
              use-font
              name="icon-dropdown-line"
              class="datatunerx-user-drop-icon"
            />
          </anakin-header-button>
          <template #menu>
            <dao-dropdown-menu>
              <dao-dropdown-item
                v-for="operate in userOperation"
                :key="operate.label"
                @click="operate.operate"
              >
                <dao-history-link :icon="operate.icon">
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
$datatunerx-header-background: var(--dao-top-gray-010);
$datatunerx-header-color: var(--dao-navigation-090);

.datatunerx-header {
  position: sticky;
  top: 0;
  z-index: 1020;

  display: flex;
  align-items: center;
  height: 50px;
  color: $datatunerx-header-color;
  background-color: $datatunerx-header-background;

  &__namespace {
    margin-left: 30px;
    font-size: 16px;
    font-weight: bold;
  }
}

.datatunerx-header-logo {
  width: 210px;
  text-align: center;
}

.datatunerx-header-logo-img {
  height: 36px;
  vertical-align: bottom;
  transform: scale(1.7);
}

.datatunerx-toolbox {
  display: flex;
  align-items: center;
  margin-left: auto;

  .datatunerx-toolbox-item {
    margin-right: 10px;
  }

  .datatunerx-icon-trigger {
    position: relative;
    display: flex;
    padding: 0;
  }

  .datatunerx-operate-icon {
    width: 34px;
    height: 34px;
    font-size: 21px;
    line-height: 34px;
    text-align: center;
  }

  .datatunerx-message-count-box {
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

    .datatunerx-message-count {
      font-size: 20px;
      font-weight: 600;
      color: var(--dao-pure-white);
      transform: scale(0.5);
    }
  }

  .datatunerx-user-trigger {
    display: flex;
    align-items: center;
  }

  .datatunerx-user-avatar {
    height: 36px;
    margin-right: 8px;
    vertical-align: middle;
  }

  .datatunerx-user-default-avatar {
    width: 24px;
    height: 24px;
    font-size: 24px;
  }

  .datatunerx-user-username {
    margin-right: 14px;
  }

  .datatunerx-user-drop-icon {
    width: 14px;
    height: 14px;
    font-size: 14px;
    transform: rotate(90deg);
  }
}

.datatunerx-user-drop--item {
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

.namespace-select {
  height: 3.8rem;
  margin-left: 1.2rem;
  line-height: 3.8rem;
  color: #fff;
  background: transparent;

  :deep(.dao-selection) {
    width: 200px;
    padding: 0 1rem 0 1.8rem;
    font-size: 1.6rem;
    font-weight: 500;
    color: #fff;
    background: transparent;
    border-width: 0;
    border-radius: 0.6rem;

    &:hover {
      background-color: var(--dao-top-gray-020);
    }
  }
}
</style>
