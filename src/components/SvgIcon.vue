<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: true,
    default: 'default',
  },
  size: {
    type: Number,
    default: 16,
  },
  color: {
    type: String,
    default: 'var(--dao-pure-black-rgb)',
  },
});

</script>

<template>
  <svg
    class="svg-icon"
    :style="{ width: size + 'px', height: size + 'px', color: color }"
  >
    <use
      :xlink:href="`#icon-${name}`"
      :fill="color"
    />
  </svg>
</template>
