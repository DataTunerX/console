import { createApp } from 'vue';
import 'normalize.css/normalize.css';
import pluginInstall, { loadLanguageAsync } from './plugins';

import '@/assets/styles/common.scss';

import AppElement from './App.vue';

const app = createApp(AppElement);

app.use(pluginInstall);

await loadLanguageAsync('');

app.mount('#app');
