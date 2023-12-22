/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-explicit-any */
// 引入svgicon组件
import SvgIcon from '@/components/SvgIcon.vue';

const componentsvgPlugin: any = {
  install(vue: any, options: any) {
    if (
      options
      && options.imports
      && Array.isArray(options.imports)
      && options.imports.length > 0
    ) {
      // 按需引入svg图标
      const { imports } = options;

      imports.forEach((name: any) => {
        require(`@/assets/svgs/${name}.svg`);
      });
    } else {
      // 全量引入svg图标
      const ctx = require.context('@/assets/svgs', false, /\.svg$/);

      ctx.keys().forEach((path) => {
        const temp = path.match(/\.\/([A-Za-z0-9\-_]+)\.svg$/);

        if (!temp) return;
        const name = temp[1];

        require(`@/assets/svgs/${name}.svg`);
      });
    }
    vue.component('SvgIcon', SvgIcon);
  },
};

export default componentsvgPlugin;
