import { useI18n } from 'vue-i18n';
import { get, merge } from 'lodash';
import { nError } from '@/utils/useNoty';
import {
  onBeforeMount,
  reactive,
  ref,
  Ref,
  UnwrapNestedRefs,
  computed,
  watchEffect,
  toRefs,
  ToRefs,
  watch,
  ComputedRef,
} from 'vue';
import { AxiosResponse } from 'axios';
import { List } from '@/plugins/axios/client';

interface AxiosResponseTemplate<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (): Promise<AxiosResponse<List<T>, any>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function defaultCompareFn(a: any, b: any) {
  return a < b ? -1 : 1;
}

export type SortDirection = 'ascend' | 'descend';

export interface Sort {
  key: string;
  direction: SortDirection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compareFn: (a: any, b: any) => number;
}

export interface Search {
  isReg: boolean;
  keys: string[];
  keywords: Record<string, string[]>;
}

export interface DefaultParams {
  search?: Partial<Search>;
  sort?: Partial<Sort>;
}

export interface Params {
  search: Search;
  sort: Sort;
}

const FUZZY_SEARCH_PARAM = 'fuzzy';

const defaultParams = {
  search: {
    isReg: false,
    keys: ['metadata.name'] as string[],
    keywords: {
      [FUZZY_SEARCH_PARAM]: [],
    },
  },
  sort: {
    key: 'metadata.creationTimestamp',
    direction: 'descend',
    compareFn: defaultCompareFn,
  },
} as Params;

interface StateType<T> extends Params {
  items: T[];
  pagedData: T[];
  page: number;
  pageSize: number;
}

// Modify the ReturnData interface
interface ReturnData<T> extends ToRefs<UnwrapNestedRefs<StateType<T>>> {
  isLoading: Ref<boolean>;
  total: ComputedRef<number>;
  fetchList: () => Promise<void>;
  handleChangePage: (page: number) => void;
  handleChangePageSize: (page: number) => void;
  handleRefresh: () => void;
}

/**
 * @param api 请求函数
 * @param delay 通过延时启动loading动画尽量规避loading动画过短
 */
export function useQueryTable<T>(
  api: AxiosResponseTemplate<T>,
  options?: DefaultParams,
  { immediate = true, delay = 400 } = {},
) :ReturnData<T> {
  const { sort: sortParams, search: searchParams } = merge({}, defaultParams, options) as Params;

  const { t } = useI18n();
  const state = reactive<StateType<T>>({
    items: [],
    pagedData: [],
    page: 1,
    pageSize: 10,
    search: searchParams,
    sort: sortParams,
  });

  const filteredList = computed(() => {
    let list = [...state.items];
    // FIXME: too tricky
    const [searchText] = state.search.keywords[FUZZY_SEARCH_PARAM] ?? [];

    if (searchText) {
      list = list.filter((i) => {
        let iStr = '';

        if (state.search.keys?.length) {
          iStr = state.search.keys.map((key) => get(i, key)).join(' ');
        } else {
          iStr = JSON.stringify(i);
        }

        if (state.search.isReg) {
          try {
            const matched = Boolean(iStr.match(new RegExp(searchText)));

            return matched;
          } catch {
            //
          }
        }

        return iStr.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
      });
    }
    if (state.sort.key) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      list.sort((a: any, b: any) => {
        const { key } = state.sort;
        const sortResult = state.sort.compareFn(get(a, key), get(b, key));

        return state.sort.direction === 'ascend' ? sortResult : sortResult * -1;
      });
    }

    return list;
  });

  watchEffect(() => {
    const startIndex = (state.page - 1) * state.pageSize;
    const endIndex = state.page * state.pageSize;

    state.pagedData = filteredList.value.slice(startIndex, endIndex);
  });

  const total = computed(() => filteredList.value.length);

  const isLoading = ref(false);

  const fetchList = async () => {
    if (!api) {
      return;
    }

    const startLoadingTimer = setTimeout(() => {
      isLoading.value = true;
    }, delay);

    const startTime = Date.now();
    // loading 一圈1.2s
    const loadingTime = 0.5 * 1200;

    try {
      const { data } = await api();
      const { items } = data;

      state.items = ref(items).value;
    } catch (e) {
      nError(t('common.error'), e);
    } finally {
      clearTimeout(startLoadingTimer);
      setTimeout(() => {
        isLoading.value = false;
      }, startTime + delay + loadingTime - Date.now());
    }
  };

  const handleChangePage = (page: number) => {
    if (state?.page === page) {
      return;
    }

    state.page = page;
    fetchList();
  };

  const handleChangePageSize = (pageSize: number) => {
    if (state.pageSize === pageSize) {
      return;
    }
    state.page = 1;

    state.pageSize = pageSize;
    fetchList();
  };

  const handleRefresh = () => {
    fetchList();
  };

  onBeforeMount(() => {
    if (immediate) {
      fetchList();
    }
  });

  watch(
    () => state.items,
    () => {
      state.search.keywords = {};
      state.page = 1;
    },
  );

  watch(
    () => state.pageSize,
    () => {
      state.page = 1;
    },
    {
      immediate: false,
    },
  );

  watch(
    () => filteredList.value,
    () => {
      state.page = 1;
    },
  );

  return {
    ...toRefs(state),
    isLoading,
    total,
    fetchList,
    handleChangePage,
    handleChangePageSize,
    handleRefresh,
  };
}
