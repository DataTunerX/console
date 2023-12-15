import 'normalize.css/normalize.css';

import pluginInstall, { loadDayjsLanguageAsync, loadLanguageAsync } from './plugins';

import '@/assets/styles/common.scss';

import AppElement from './App.vue';

const app = createApp(AppElement);

app.use(pluginInstall);

await loadLanguageAsync('');
await loadDayjsLanguageAsync('');

app.mount('#app');
