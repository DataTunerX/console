/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
  __POWERED_BY_QIANKUN__?: boolean;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
}

interface StoreMutation {
  type: string;
  payload: unknown;
}

type SubscribeHook = (
  mutation: StoreMutation,
  state: Record<string, unknown>
) => void;

interface SharedStore {
  subscribe(hook: SubscribeHook);
}

declare interface QiankunProps {
  basePath?: string;
  container?: HTMLElement;
  routerBase?: string;
  sharedStore?: SharedStore;
  onGlobalStateChange?: (arg0: (state: unknown, prev: unknown) => void) => void;
  setGlobalState?: (arg0: { [string]: unknown }) => void;
}

declare module 'js-yaml'

declare module 'marked';

/**
 * 将 T 中的 部分 属性 变为必填，其他不变
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomRequired<T extends Record<string, any>, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P];
}

/**
 * 将 T 中的 部分 属性 变为选填，其他不变
 *
 */
type CustomPartial<T extends Record<string, any>, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};

interface ListFormType {
  searchKey: string;
}

type ErrorType = {
  message: string;
  code: number;
  details: string[]
};

type RemoteCompoentRef = {
  confirm: () => Promise<{ valid: boolean, data: Deployment | StatefulSet }>;
}

declare module '@lljj/vjsf-utils/vue3Utils' {
  const resolveComponent = (component: any) => any;
}

declare module '@lljj/vjsf-utils/utils' {
  const parseDateString = (dateString: string, includeTime: boolean) => any;
}

declare module '@lljj/vjsf-utils/formUtils' {}
declare module '@lljj/vjsf-utils/schema' {}
declare module '@lljj/vjsf-utils/schema/getDefaultFormState' {
  type getDefaultFormState = (
    _schema: any,
    formData: any,
    rootSchema?: any,
    includeUndefinedValues?: boolean,
    haveAllFields?: boolean) => any
}
declare module '@lljj/vue3-form-core' {
  const createForm = (globalOptions?: any) => any;

  export default createForm;
}

// eslint-disable-next-line camelcase, no-underscore-dangle
declare let __webpack_init_sharing__: (scope: string) => Promise<void>;
// eslint-disable-next-line camelcase, no-underscore-dangle
declare let __webpack_share_scopes__: {
  [propsName: string]: any;
};

declare module '*.md';

declare module '*.css' {
  const content: { [className: string]: string };
  return content;
}
