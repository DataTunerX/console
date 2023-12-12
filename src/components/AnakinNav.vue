<script lang="ts" setup>
import { i18n } from '@/plugins';
import { NavRoute } from '@/types/common';
import { getActiveRouteFold } from '@/utils/util';

const routes = computed<NavRoute[]>(() => {
  const items = [
    {
      to: { name: 'FinetuneExperimentList' },
      display: i18n.t('components.AnakinHeader.menu.fineTuningExperiment'),
      icon: 'icon-engine',
    },
    {
      to: { name: 'FinetuneRegistryList' },
      display: i18n.t('components.AnakinHeader.menu.fineTuningRegistry'),
      icon: 'icon-registry',
    },
    {
      to: { name: 'DatasetList' },
      display: i18n.t('components.AnakinHeader.menu.dataset'),
      icon: 'icon-mspider',
    },
    {
      to: { name: 'HyperparameterList' },
      display: i18n.t('components.AnakinHeader.menu.hyperparameterGroup'),
      icon: 'icon-cluster',
    },
    {
      to: { name: 'InferenceList' },
      display: i18n.t('components.AnakinHeader.menu.inference'),
      icon: 'icon-cluster',
    },
  ] as NavRoute[];

  return items;
});

const activeOpened = computed(() => getActiveRouteFold(routes.value));
</script>

<template>
  <dao-nav
    ref="navRef"
    type="2nd"
    :active-opened="activeOpened"
  >
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
