<script lang="ts" setup>

import { useUserStore } from '@/stores/user';

const router = useRouter();
const token = ref<string>('');

const userStore = useUserStore();
const loginSuccess = computed(() => userStore.isLoginSuccess());

const onSubmit = async () => {
  await userStore.login(token.value);
  router.push({
    name: 'FinetuneExperimentList',
  });
};

onMounted(async () => {
  if (loginSuccess.value) {
    router.push({
      name: 'FinetuneExperimentList',
    });
  }
});

</script>

<template>
  <div class="login-container">
    <dao-form label-width="60px">
      <dao-form-item
        label="Token"
      >
        <dao-input v-model="token" />
      </dao-form-item>
      <dao-form-item>
        <dao-button
          type="primary"
          @click="onSubmit"
        >
          登录
        </dao-button>
      </dao-form-item>
    </dao-form>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
