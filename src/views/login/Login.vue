<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { object, string } from 'yup';

const router = useRouter();
const route = useRoute();

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
  const redirectedPath = route.redirectedFrom?.fullPath;

  if (redirectedPath) {
    router.push(redirectedPath);
  } else {
    router.push({
      name: 'ConsoleContainer',
    });
  }
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
    <dao-card title="登录 DataTunerX">
      <dao-card-item>
        <dao-form label-width="0">
          <dao-form-item-validate
            name="token"
            tag="textarea"
            :control-props="{
              placeholder: 'Enter Kubernetes Token',
              rows: 10,
              class: 'w-[600px]',
            }"
          />
        </dao-form>

        <dao-button
          type="primary"
          class="float-right w-[100px]"
          @click="onSubmit"
        >
          登录
        </dao-button>
      </dao-card-item>
    </dao-card>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;

  :deep(.dao-card){
    transform: translate(0, -20%);
  }

  :deep(.dao-textarea){
    max-height: unset;
  }

  :deep(.dao-form-item__label) {
    padding: 0;
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
