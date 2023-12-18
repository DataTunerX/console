<template>
  <dao-tabs
    :model-value="activeType.routeName"
    type="card"
    @click="changeTab"
  >
    <dao-tab-item
      v-for="tab in tabs"
      :key="tab.key"
      :value="tab.routeName"
      :label="tab.display"
    />
  </dao-tabs>

  <router-view />
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { useRouter } from 'vue-router';

type TabType = {
  key: string;
  routeName: string;
  display: string;
}

const props = defineProps({
  tabs: {
    type: Array as PropType<TabType[]>,
    default: () => [],
  },
});

const router = useRouter();

const activeType = computed<TabType>(() => {
  const target = props.tabs.find((type) => type.routeName === router.currentRoute.value.name);

  return target || props.tabs[0];
});

const changeTab = (event: Event, routeName: string) => {
  router.push({ name: routeName });
};
</script>
