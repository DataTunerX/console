import { useSessionStorage } from '@vueuse/core';
import { HAS_LOGGED } from '@/utils/constant';

export default useSessionStorage(HAS_LOGGED, false);
