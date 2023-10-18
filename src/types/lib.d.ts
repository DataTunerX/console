import type { globalStore } from '@/types/global-store';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $globalStore: globalStore;
    }
}
