const { defineConfig } = require('@vue/cli-service');

const proxyConfig = {
  target: process.env.VUE_APP_API_URL,
  changeOrigin: true,
  bypass: (req) => {
    Object.assign(req.headers, {
      Authorization: `Bearer ${process.env.VUE_APP_AUTH}`,
    });
  },
};

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,

  pluginOptions: {
    i18n: {
      locale: 'zh-CN',
      fallbackLocale: 'en-US',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: false,
    },
  },

  devServer: {
    port: 3000,
    proxy: {
      '^/apis': proxyConfig,
      '^/api': proxyConfig,
    },
  },

});
