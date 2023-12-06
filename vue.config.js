const { defineConfig } = require('@vue/cli-service');
const unpluginPlugin = require('unplugin-auto-import/webpack');

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

  configureWebpack: {
    plugins: [
      unpluginPlugin.default({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        // global imports to register
        imports: [
          // presets
          'vue',
          'vue-router',
          'vue-i18n',
          'vee-validate',
          'pinia',
        ],
        dts: './src/auto-imports.d.ts',
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
          globalsPropValue: true,
        },
      }),
    ],

    optimization: {
      splitChunks: {
        cacheGroups: {
          g2: {
            test: /[\\/]node_modules[\\/]@antv/,
            name: 'g2',
            chunks: 'all',
            priority: 20,
          },
        },
      },
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
