<template>
  <anakin-header class="ghippo-header" />

  <div id="container">
    <anakin-nav />
    <router-view class="console-content" />
  </div>
</template>

<script lang="ts" setup>
import AnakinNav from '@/components/AnakinNav.vue';
import AnakinHeader from '@/components/AnakinHeader.vue';

</script>

<style lang="scss">
html,
body {
  height: 100%;
}

/* stylelint-disable-next-line selector-max-id */
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background: var(--dao-bg);
}

/* stylelint-disable-next-line selector-max-id */
#container {
  display: flex;
  flex: 1 1 0;
  width: 100%;
  overflow: auto;
}

.console-content{
  flex: 1 1 0px;
  height: 100%;
  overflow: auto;
}
</style>
