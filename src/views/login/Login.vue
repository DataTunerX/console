<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { object, string } from 'yup';

const router = useRouter();

const userStore = useUserStore();
const loginSuccess = computed(() => userStore.isLoginSuccess());

interface ServiceAccount {
  token: string;
}

const { handleSubmit } = useForm<ServiceAccount>({
  initialValues: {
    token: '',
  },
  validationSchema: object({
    token: string().required('Token is required'),
  }),
});

const onSubmit = handleSubmit(async (values) => {
  await userStore.login(values.token);
  router.push({
    name: 'ConsoleContainer',
  });
});

onMounted(async () => {
  if (loginSuccess.value) {
    router.push({
      name: 'ConsoleContainer',
    });
  }
});
</script>

<template>
  <div class="login-container">
    <dao-form label-width="60px">
      <dao-form-item-validate
        name="token"
        label="Token"
        tag="textarea"
        :control-props="{
          rows:10,
          class: 'w-[500px]'
        }"
      />
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
