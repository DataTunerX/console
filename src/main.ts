import { createApp } from 'vue';
import 'normalize.css/normalize.css';
import pluginInstall, { loadDayjsLanguageAsync, loadLanguageAsync } from './plugins';

import '@/assets/styles/common.scss';

import AppElement from './App.vue';
import { useNamespaceStore } from './stores/namespace';

const app = createApp(AppElement);

app.use(pluginInstall);

await loadLanguageAsync('');
await loadDayjsLanguageAsync('');

const namespaceStore = useNamespaceStore();

namespaceStore.fetchNamespace().then(() => {
  app.mount('#app');
});
