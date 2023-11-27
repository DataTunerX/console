<template>
  <anakin-header />

  <div id="container">
    <anakin-nav class="console-sidebar" />
    <router-view class="console-content" />

    <dialog-wrapper />
  </div>
</template>

<script lang="ts" setup>
import AnakinNav from '@/components/AnakinNav.vue';
import AnakinHeader from '@/components/AnakinHeader.vue';
import { DialogWrapper } from '@dao-style/extend';
</script>
