const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
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
      '^/apis': {
        target: process.env.VUE_APP_API_URL,
        bypass: (req) => {
          Object.assign(req.headers, {
            Authorization: `Bearer ${process.env.VUE_APP_AUTH}`,
          });
        },
      },
      '^/api': {
        target: process.env.VUE_APP_API_URL,
        bypass: (req) => {
          Object.assign(req.headers, {
            Authorization: `Bearer ${process.env.VUE_APP_AUTH}`,
          });
        },
      },
    },
  },

});
