<template>
  <div class="card-layout__container">
    <slot />

    <div
      v-for="i in cards"
      :key="i"
      class="card-layout__placeholder"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  cards: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss">
$min-width: 280px;
$max-width: 380px;

.card-layout {
  &__container {
    display: flex;
    flex-wrap: wrap;
    margin-right: -10px;
    margin-left: -10px;

    > * {
      flex: 1 1 0;
      min-width: 280px;
      max-width: 380px;
      margin: 20px 10px 0;
    }

    :deep(.dao-loading-layout) {
      max-width: none;
    }
  }

  &__placeholder {
    flex: 1 1 0;
    min-width: 280px;
    max-width: 380px;
    margin: 0 10px;
  }
}
</style>
