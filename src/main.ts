import 'normalize.css/normalize.css';

import svgPlugin from './plugins/svg-plugin';

import pluginInstall, { loadDayjsLanguageAsync, loadLanguageAsync } from './plugins';

import '@/assets/styles/common.scss';

import AppElement from './App.vue';

const app = createApp(AppElement);

app.use(pluginInstall);

app.use(svgPlugin, {
  imports: [],
});

await loadLanguageAsync('');
await loadDayjsLanguageAsync('');

app.mount('#app');
