import get from 'lodash/get';
import merge from 'lodash/merge';
import { nError } from '@/utils/useNoty';
import { UnwrapNestedRefs, ToRefs } from 'vue';
import { AxiosResponse } from 'axios';
import { List } from '@/plugins/axios/client';
import { DaoTableSort, SearchModelType } from '@dao-style/core';

interface Service<T> {
  (): Promise<AxiosResponse<List<T>>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function defaultCompareFn(a: any, b: any) {
  return a < b ? -1 : 1;
}

export type SortDirection = 'ascend' | 'descend';

export interface Sort extends DaoTableSort{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compareFn: (a: any, b: any) => number;
}
export interface Params {
  search: SearchModelType;
  sort: Sort;
  keys: string[];
}

const FUZZY_SEARCH_PARAM = 'fuzzy';

export const commonSortIdMap: Record<string, string> = {
  name: 'metadata.name',
  createAt: 'metadata.creationTimestamp',
};

export const tableIdToSortBy = (sort: DaoTableSort, sortIdMap = commonSortIdMap): DaoTableSort => ({
  ...sort,
  id: sortIdMap[sort.id] ?? sort.id,
});

const defaultParams: Params = {
  sort: {
    id: commonSortIdMap.createAt,
    desc: false,
    compareFn: defaultCompareFn,
  },
  search: {},
  keys: ['metadata.name'],
};

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

export const useQueryTable = <Item>(
  api: Service<Item>,
  options?: Partial<Params>,
  { immediate = true, delay = 400 } = {},
): ReturnData<Item> => {
  const { sort: sortParams, search: searchParams } = merge({}, defaultParams, options) as Params;

  let { keys } = defaultParams;

  if (options?.keys) {
    keys = [...keys, ...options.keys];
  }

  const { t } = useI18n();
  const state = reactive<StateType<Item>>({
    items: [],
    pagedData: [],
    page: 1,
    pageSize: 10,
    search: searchParams,
    sort: sortParams,
    keys,
  });

  const filteredList = computed(() => {
    let list = [...state.items];
    const {
      [FUZZY_SEARCH_PARAM]: fuzzyText,
      ...search
    } = state.search;

    Object.entries(search).forEach(([key, value]) => {
      if (!value) {
        return;
      }

      list = list.filter((i) => {
        const iStr = get(i, key);

        return value.some((v) => iStr.includes(v));
      });
    });

    if (fuzzyText) {
      list = list.filter((i) => {
        let iStr = '';

        if (state.keys?.length) {
          iStr = state.keys.map((key) => JSON.stringify(get(i, key))).join(' ');
        } else {
          iStr = JSON.stringify(i);
        }

        return fuzzyText.some((keyword) => iStr.toLocaleLowerCase().includes(keyword.toString().toLocaleLowerCase()));
      });
    }

    if (state.sort.id) {
      list.sort((a, b) => {
        const key = tableIdToSortBy(state.sort).id;
        const sortResult = state.sort.compareFn(get(a, key), get(b, key));

        return state.sort.desc ? sortResult : sortResult * -1;
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
      state.search = {};
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
};
