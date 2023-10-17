/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  defineComponent,
  ExtractPropTypes,
  getCurrentInstance,
  h,
  onBeforeUnmount, onErrorCaptured,
  reactive,
  TransitionGroup,
} from 'vue';
import './dialog-wrapper.scss';

// TODO: 先直接引入，extend 发布后再替换
export interface WrapperOptions<
  T extends ReturnType<typeof defineComponent> = ReturnType<typeof defineComponent>,
  Prop = ExtractPropTypes<T>
  > {
  component: T,
  props: Prop,
  id: symbol,
  resolve: (data: unknown) => void;
  reject: (reason?: string) => void;
}

export type CreateOptions = WrapperOptions['component'];

const CANCEL_REASON = 'Close Dialog Wrapper';

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason === CANCEL_REASON) {
    event.preventDefault();
  }
});

export function disableDialogWrapperWarning(error: unknown) {
  if (typeof error === 'string') {
    return error !== CANCEL_REASON;
  }

  return true;
}

export function useDialogWrapper() {
  const showMap = reactive(new Map<symbol, WrapperOptions>());

  const wrapper = defineComponent({
    setup(_props, { slots }) {
      const root = getCurrentInstance()?.root;

      onErrorCaptured(disableDialogWrapperWarning, root);

      const onResolve = (id: symbol, data: unknown) => {
        const dialog = showMap.get(id);

        if (dialog) {
          showMap.delete(id);
          dialog.resolve(data);
        }
      };

      const onReject = (id: symbol) => {
        const dialog = showMap.get(id);

        if (dialog) {
          showMap.delete(id);
          dialog.reject(CANCEL_REASON);
        }
      };

      return () => h(TransitionGroup, {
        name: 'dialog-wrapper',
        tag: 'div',
      }, () => [
        slots?.default?.(),
        ...Array.from(showMap.values()).map(({
          component, props, id,
        }) => h(component, {
          ...props,
          key: id,
          onResolve: (data: unknown) => {
            onResolve(id, data);
          },
          onReject: () => {
            onReject(id);
          },
        })),
      ]);
    },
  });

  function destroy(id: symbol) {
    showMap.delete(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function create<T extends abstract new(...args: any) => any>(cp: T) {
    const instance = getCurrentInstance();

    const id = Symbol('unique dialog');

    type ComponentInstance = InstanceType<T>;

    type ComponentProps = ComponentInstance['$props'];

    type ComponentEmits = ComponentInstance['$emit']

    type ResolveEmit<K> = K extends {
      (event: 'resolve', x: infer P): void,
      (event: 'reject'): void,
    } ? P : never;

    const destroyCurrentDialog = () => {
      destroy(id);
    };

    if (instance) {
      onBeforeUnmount(() => {
        destroyCurrentDialog();
      });
    }

    function show(props: Partial<ComponentProps>) {
      return new Promise<ResolveEmit<ComponentEmits>>((resolve, reject) => {
        // @ts-ignore
        showMap.set(id, Object.freeze({
          id,
          resolve,
          reject,
          props,
          component: cp,
        }));
      });
    }

    return {
      show,
      destroy: () => destroy(id),
    };
  }

  return {
    wrapper,
    create,
    destroy,
  };
}

export const { wrapper: DialogWrapper, create: createDialog } = useDialogWrapper();
