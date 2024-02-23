import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';

import { deleteHostApi } from '@/api/st/host';
import { Operator, Search } from '@/api/st/model/base';
import { Host, HostColumns } from '@/api/st/model/host';

import { getSourceData, requestDataForSearch, sendSearchRequest } from '../search';
import { clearSelectedRowKeys, getSelectRows } from '../table';

// 删除相关
export const visibleDeleteModal = ref<boolean>(false); // 展示条件删除框开关
export const visibleDeleteModal2 = ref<boolean>(true); // 展示条件删除框开关

export const requestDataForDelete: Search<HostColumns> = reactive({
  offset: 0,
  limit: 1,
  order: null,
  order_field: null,
  fields: [],
}); // 条件删除设置
export const jsonOptionsForDelete = reactive({
  jsonMode: false,
  jsonData: '[]',
}); // 条件删除的JSON设置

export const showModalForDelete = () => {
  visibleDeleteModal.value = !visibleDeleteModal.value;
}; // 展示条件删除框开关函数

const sendDeleteRequest = async (obj: Search<HostColumns>) => {
  try {
    await deleteHostApi(obj);
    // message.success(ret.msg);
  } catch (identifier: any) {
    message.error(identifier.toString());
    return;
  }
}; // 发送删除请求

export const deleteOne = async (obj) => {
  await sendDeleteRequest({
    offset: 0,
    limit: 1,
    fields: [{ key: HostColumns.ID, op: Operator.EQ, value: obj.id }],
    order_field: null,
    order: null,
  });
  await getSourceData(requestDataForSearch);
}; // 按ID删除单个数据

export const deleteAll = async () => {
  await sendDeleteRequest({
    offset: 0,
    limit: -1,
    fields: [],
    order_field: null,
    order: null,
  });
  await sendSearchRequest();
}; // 删除全部数据

export const deleteSelected = async () => {
  const srs: Array<Host> = await getSelectRows();
  if (srs.length == 0) {
    return;
  }
  const tmpIDs = Array<number>();
  for (const v in srs) {
    tmpIDs.push(srs[v].id);
  }
  await sendDeleteRequest({
    offset: 0,
    limit: 1,
    fields: [{ key: HostColumns.ID, op: 'IN', value: tmpIDs }],
    order_field: null,
    order: null,
  });
  await clearSelectedRowKeys();
  await getSourceData(requestDataForSearch);
}; // 删除已选数据

export const confirmDelete = async () => {
  if (jsonOptionsForDelete.jsonMode) {
    try {
      requestDataForDelete.fields = JSON.parse(jsonOptionsForDelete.jsonData);
      jsonOptionsForDelete.jsonMode = !jsonOptionsForDelete.jsonMode;
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }
  await sendDeleteRequest(requestDataForDelete);
  await getSourceData(requestDataForSearch);
}; // 发起条件删除请求
