<template>
  <div
    v-data-sync="isNumberChartDataSyncShow"
    class="number-chart"
  >
    <template v-if="!isNumberChartDataSyncShow">
      <div class="number-chart__content">
        <div>
          <span
            class="number-chart__content__num-ready"
            :style="{ color: readyColor }"
          >
            {{ ready.data }}
          </span>
          <span
            class="number-chart__content__num-total"
            :style="{ color: totalColor }"
          >
            / {{ total.data }}
          </span>
        </div>
      </div>

      <div class="number-chart__title">
        {{ title }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

interface NumberProp {
  data: number
  color?: string | ((data: number) => string);
}

const props = defineProps({
  ready: {
    type: Object as PropType<NumberProp>,
    default: () => ({
      data: 0,
      color: '#2CC76A',
    }),
  },
  total: {
    type: Object as PropType<NumberProp>,
    default: () => ({
      data: 0,
      color: '#3D444F',
    }),
  },
  title: {
    type: String,
    default: '',
  },
});

const isNumberChartDataSyncShow = computed(() => props.ready.data === -1);

const getColor = (numColor: NumberProp['color'], num: number) => {
  if (!numColor) return undefined;

  if (typeof numColor === 'string') return numColor;

  if (numColor instanceof Function) {
    return numColor(num);
  }

  return undefined;
};

const readyColor = computed(() => {
  const { color, data } = props.ready;

  return getColor(color, data) || '#2CC76A';
});

const totalColor = computed(() => {
  const { color, data } = props.total;

  return getColor(color, data) || '#3D444F';
});

</script>

<style lang="scss" scoped>
.number-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__content {
    display: flex;
    align-items: center;
    justify-items: center;

    &__num-ready {
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
      color: var(--dao-green-030);
    }

    &__num-total {
      margin-left: 4px;
      font-size: 13px;
      font-weight: 700;
      line-height: 20px;
      color: var(--dao-gray-010);
    }
  }

  &__title {
    margin-top: 16px;
    font-size: 12px;
    line-height: 20px;
    color: var(--dao-gray-070);
  }
}
</style>
