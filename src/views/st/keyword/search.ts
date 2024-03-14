import { getKeywordApi } from '@/api/st/keyword';
import { Search } from '@/api/st/model/base';
import { KeywordColumns } from '@/api/st/model/keyword';
import { message } from 'ant-design-vue';
import { reactive } from 'vue';

import { setLoading, setPagination, setTableData } from './table';

// 搜索相关
export const requestDataForSearch: Search<KeywordColumns> = reactive({
  offset: 0,
  limit: 20,
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
export const getSourceData = async (v: Search<KeywordColumns>) => {
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
    const { data, total } = await getKeywordApi(v);
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
