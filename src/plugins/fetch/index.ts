/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Awaitable } from '@vueuse/core';
import { TOKEN } from '@/utils/constant';
import pathJoin from '@/utils/pathJoin';
import getUrlBase from '@/utils/getUrlBase';
import {
  handleResponse, $fetchRaw, setGlobalInterceptors, type FetchContext,
} from './request';

// 有些插件会替换浏览器原生fetch，所以不能通过native code判断只加载一次
let initialized = false;

export function replaceFetch() {
  if (initialized) {
    return;
  }

  initialized = true;

  // @ts-ignore
  window.originFetch = window.fetch;
  // @ts-ignore
  window.fetch = $fetchRaw;
}

export type ErrorHandler = (ctx: FetchContext) => Awaitable<Response | void>;

export const errorHandlers : Map<string, Set<ErrorHandler>> = new Map([['anakin', new Set([handleResponse])]]);

setGlobalInterceptors({
  async onRequest(ctx) {
    const token = localStorage.getItem(TOKEN);

    if (ctx.request) {
      const baseUrl = getUrlBase();
      const startWithHttpReg = /^http[s]?:\/\//;

      if (typeof ctx.request === 'string') {
        ctx.request = startWithHttpReg.test(ctx.request)
          ? ctx.request : pathJoin(baseUrl, ctx.request);
      } else {
        ctx.request = {
          ...ctx.request,
          url: startWithHttpReg.test(ctx.request.url)
            ? ctx.request.url : pathJoin(baseUrl, ctx.request.url),
        };
      }
    }

    if (token && ctx.request) {
      if (!ctx.options.headers) {
        ctx.options.headers = {};
      }
      // 如果webpack hot update加上Authorization会CORS拒绝
      if (process.env.NODE_ENV === 'development' && String(ctx.request).endsWith('hot-update.json')) {
        return;
      }
      // @ts-ignore
      ctx.options.headers.Authorization = `Bearer ${token}`;
    }
  },
  async onResponseError(ctx) {
    if (!ctx.response) {
      // @ts-ignore
      Promise.reject(new Error(ctx));

      return;
    }

    const handlers : Array<ErrorHandler> = [];

    errorHandlers.forEach((handlersSet) => {
      handlersSet.forEach((handler) => {
        handlers.push(handler);
      });
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const handler of handlers) {
      // eslint-disable-next-line no-await-in-loop
      await handler(ctx);
    }
  },
});

const installAxios = (): void => {
  replaceFetch();
};

// export default installAxios;
installAxios();
