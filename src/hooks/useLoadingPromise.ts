export default function useLoadingPromise(delay = 400) {
  // eslint-disable-next-line
  const isLoading = ref<boolean>(false);

  const apiPro = ref<Promise<unknown>>();

  watch(apiPro, (pro) => {
    if (pro) {
      isLoading.value = false;
      setTimeout(() => {
        isLoading.value = true;

        pro.finally(() => {
          isLoading.value = false;
        });
      }, delay);
    }
  });

  return computed({
    get(): boolean {
      return isLoading.value;
    },
    set(v: Promise<unknown> | boolean) {
      if (v instanceof Promise) {
        apiPro.value = v;
      } else if (typeof v === 'boolean') {
        isLoading.value = v;
      }
    },
  });
}
