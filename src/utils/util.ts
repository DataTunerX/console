import { useRoute } from 'vue-router';
import type { KeyValue, LabelType, NavRoute } from '@/types/common';

export const capitalizeString = (
  str: string,
): string => str.charAt(0).toUpperCase() + str.substring(1);

export function useDayjs() {
  const instance = getCurrentInstance();
  const $dayjs = instance?.appContext.config.globalProperties.$dayjs;

  return $dayjs;
}

/**
 * ！！！ K8s 资源中，只有 Mi 和 M
 * 但是前端展示需要 MB
 *
 * 跟后端同事商量，MB 以 Mi 为准，1024
 * M 以 1000
 *
 * 将单位为 byte 的数据，转换成 'KB' | 'MB' | 'GB' | 'TB' | 'PB'
 * 超过某一个单位一半的时候，自动进位到下一位
 * 比如 输入：1024* 500，输出 500 KB
 * 比如 输入：1024* 513，输出 0.5 MB
 * @param bytes {number|string} 将要转换的单位为 byte 的数据
 * @param targetUnit {string} 想要转换后的单位
 */
export function bytesToUnit(bytes: number | string, targetUnit?: 'KB' | 'MB' | 'GB' | 'TB' | 'PB') {
  let oldNum = Number(bytes);

  if (Number.isNaN(oldNum)) {
    oldNum = 0;
  }
  // 1024
  const unitsArr = ['KB', 'MB', 'GB', 'TB', 'PB'];

  const result = {
    value: 0,
    unit: unitsArr[0],
  };

  // 有特定的 单位
  if (targetUnit) {
    const idx = unitsArr.findIndex((u) => u === targetUnit);

    if (idx !== -1) {
      result.value = Number((oldNum / (1024 ** (idx + 1))).toFixed(2));
      result.unit = unitsArr[idx];
    } else {
      result.value = Number((oldNum / 1024).toFixed(2));
      [result.unit] = unitsArr;
    }

    return result;
  }

  for (let i = 0; i < unitsArr.length; i += 1) {
    // 当超过一半的时候，单位就置为更大的单位
    if (oldNum < (1024 ** (i + 1)) * 513) {
      result.value = Number((oldNum / (1024 ** (i + 1))).toFixed(2));
      result.unit = unitsArr[i];

      return result;
    }
  }

  // 太大的，就转化为 最大的单位
  result.value = Number((oldNum / (1024 ** unitsArr.length)).toFixed(2));
  result.unit = unitsArr[unitsArr.length - 1];

  return result;
}

/**
 * 浮点数处理
 * @param src {number}
 * @param pos {number}
 */
export function formatFloat(src: number, pos = 2) {
  let fun = Math.round;

  if (src < 10 ** -pos) {
    fun = Math.ceil;
  }

  return fun(src * 10 ** pos) / 10 ** pos;
}

/**
 * 输出百分比
 * @param a {number | string}
 * @param b {number | string}
 */
export function percent(a: number | string, b: number | string) {
  return formatFloat((Number(a) / Number(b)) * 100);
}

export function formatLabelToKeyValueList(data: KeyValue = {}): LabelType[] {
  return Object.entries(data).reduce((pre: LabelType[], [key, value]) => {
    const tempV = (typeof value === 'string') ? value : JSON.stringify(value);

    pre.push({
      key,
      value: tempV,
    });

    return pre;
  }, []);
}

export function formatKeyValueListToObj(data: LabelType[] = []) {
  const obj: {[key: string]: string} = {};

  data.forEach((item) => {
    if (!item.key) return;
    obj[item.key.trim()] = item.value?.trim();
  });

  return obj;
}

/**
 * {key: value} 转换为 ['key:value'] 形式
 * @param v
 */
export function formatKeyValToStr(v: KeyValue | undefined = {}) {
  return Object.entries(v || {}).map(([key, value]) => `${key}:${value}`);
}

interface MetadataSchema {
  metadata: {
    properties: {
      name?: object;
      namespace?: object;
    }
  }
}

interface MetadataProperties {
  name?: string;
  ns?: string;
}

/**
 * 构造yaml schema，校验name、namespace字段不能被更改
 * @param properties
 */
export function getMetadataSchema(properties: MetadataProperties) {
  const { name, ns } = properties;

  const schema: MetadataSchema = {
    metadata: {
      properties: {},
    },
  };

  if (name) {
    schema.metadata.properties.name = {
      type: 'string',
      enum: [name],
    };
  }

  if (ns) {
    schema.metadata.properties.namespace = {
      enum: [ns === '_all' ? 'default' : ns],
    };
  }

  return schema;
}

/**
 *
 *  updateByYaml 返回的数据，都有如下问题
 * 1. 没有 cluster
 * @param {String} data YAML 更新, API 返回的 data
 * @param {String} cluster 更新的数据 metadata.cluster
 * @returns {Object} 处理后的数据
 */
export function jsonAddCluster(data: string, cluster: string) {
  const res = JSON.parse(data);

  res.metadata.cluster = cluster || '';

  return res;
}

/**
 * 多个图表时，赋值ref函数会有ts报错，可以通过这个函数进行类型推断
 * @param el
 */
export function getHtmlElement(el: unknown) {
  if (el instanceof HTMLElement) {
    return el;
  }

  return undefined;
}

/**
 * 导航栏，定位展开父级导航
 * @param routes
 */
export function getActiveRouteFold(routes: NavRoute[]) {
  const route = useRoute();

  const folders = routes.filter((item) => item.children?.length);

  const openedFolder = folders.find((child) => {
    const leaves = child.children ?? [];

    return leaves?.find((leaf) => {
      const leafRouteName = leaf.to?.name;

      return leafRouteName === route.name || route.matched.find((m) => m.name === leafRouteName);
    });
  });

  return openedFolder ? [routes.indexOf(openedFolder)] : [];
}

export const randomStr = (length: number) => {
  const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  let i = length;

  while (i) {
    result += str[Math.floor(Math.random() * str.length)];
    i -= 1;
  }

  return result;
};
