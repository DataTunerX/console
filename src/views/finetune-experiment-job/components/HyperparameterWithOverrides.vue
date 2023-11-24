<script lang="ts" setup>
import { Hyperparameter } from '@/api/finetune';
import { PropType } from 'vue';
import { Theme as hyperparameterTheme } from '@/api/hyperparameter';

const props = defineProps({
  data: {
    type: Object as PropType<Hyperparameter>,
    default: () => ({}),
  },
});
</script>

<template>
  <dao-tooltip placement="right-start">
    <dao-label-extend :color="hyperparameterTheme">
      {{ props.data.hyperparameterRef }}
    </dao-label-extend>

    <template #content>
      <span class="font-bold">Overrides</span>
      <div class="flex flex-col">
        <div
          v-for="(v, k) in props.data.overrides"
          :key="k"
        >
          <span>{{ k }}: </span>
          <span class="font-bold">{{ v }}</span>
        </div>
      </div>
    </template>
  </dao-tooltip>
</template>
