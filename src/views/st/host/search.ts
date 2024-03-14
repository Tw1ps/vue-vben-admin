import { getHostApi } from '@/api/st/host';
import { Search } from '@/api/st/model/base';
import { HostColumns } from '@/api/st/model/host';
import { message } from 'ant-design-vue';
import { v4 as uuid4 } from 'uuid';
import { reactive } from 'vue';

import { setLoading, setPagination, setTableData } from './table';

// 搜索相关
export const requestDataForSearch: Search<HostColumns> = reactive({
  offset: 0,
  limit: 10,
  order: null,
  order_field: null,
  fields: [],
}); // 搜索框请求数据

export const jsonOptionsForSearch = reactive({
  jsonMode: false,
  jsonData: '[]',
}); // 搜索框JSON设置

export const clearSearchCondition = () => {
  jsonOptionsForSearch.jsonData = '[]';
  requestDataForSearch.fields!.splice(0, requestDataForSearch.fields!.length);
}; // 清空搜索条件

export const sendSearchRequest = async () => {
  requestDataForSearch.offset = 0;
  await getSourceData(requestDataForSearch);
}; // 发送搜索请求

// 获取数据请求
export const getSourceData = async (v: Search<HostColumns>) => {
  if (jsonOptionsForSearch.jsonMode) {
    try {
      requestDataForSearch.fields = JSON.parse(jsonOptionsForSearch.jsonData);
      jsonOptionsForSearch.jsonMode = !jsonOptionsForSearch.jsonMode;
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }
  setLoading(true);
  try {
    console.log(v);
    const { data, total } = await getHostApi(v);
    if (data) {
      setTableData(data);
    }
    if (total) {
      setPagination({
        total: total,
        pageSize: v.limit!,
        current: v.offset! / v.limit! + 1,
      });
    }
  } catch (identifier: any) {
    message.error(identifier.toString());
  } finally {
    setLoading(false);
  }
};

// 快速搜索栏
export const onQuickSearch = async (key: string, value: string | boolean | undefined) => {
  console.log(key, value);

  if (!value) {
    return;
  }

  let op = '==';

  if (typeof value === 'string') {
    if (value.includes('%')) {
      op = 'like';
    }
  }

  requestDataForSearch.fields!.splice(0, requestDataForSearch.fields!.length);
  requestDataForSearch.fields!.push({
    uuid: uuid4(),
    key: HostColumns[key.toUpperCase()],
    op: op,
    value: value,
  });
  await getSourceData(requestDataForSearch);

  return;
};

export const onQuickSearchAlive = () => {
  return onQuickSearch(HostColumns.ALIVE, true);
};

export const onQuickSearchAlert = () => {
  return onQuickSearch(HostColumns.ALERT, true);
};

export const onQuickSearchClear = async () => {
  requestDataForSearch.fields = [];
  await getSourceData(requestDataForSearch);
};

export const quickSearchValue = reactive({
  value1: undefined,
  value2: undefined,
  value3: undefined,
  value4: undefined,
  value5: undefined,
  value6: undefined,
  value7: undefined,
  value8: undefined,
  value9: undefined,
  value10: undefined,
});
