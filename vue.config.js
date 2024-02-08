const { defineConfig } = require('@vue/cli-service');
const unpluginPlugin = require('unplugin-auto-import/webpack');
const path = require('path');

const proxyConfig = {
  target: process.env.VUE_APP_API_URL,
  changeOrigin: true,
};

const uploadConfig = {
  target: process.env.VUE_APP_UPLOAD_URL,
  changeOrigin: true,
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

  chainWebpack: (config) => {
    config.module.rule('svg').exclude.add(path.resolve(__dirname, './src/assets/svgs')).end();
  },

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/i,
          loader: 'raw-loader',
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          include: path.resolve(__dirname, './src/assets/svgs'),
          options: { symbolId: 'icon-[name]' },
        },
      ],
    },
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
          highlight: {
            test: /[\\/]node_modules[\\/]highlight\.js[\\/]/,
            name: 'highlight',
            chunks: 'all',
          },
        },
      },
    },
  },

  devServer: {
    port: 3000,
    proxy: {
      '^/inference/apis': uploadConfig,
      '^/apis': proxyConfig,
      '^/api': proxyConfig,
      '^/inference': proxyConfig,
    },
  },

});
