import { updateKeywordApi } from '@/api/st/keyword';
import { Field, Operator, Search } from '@/api/st/model/base';
import {
  Keyword,
  KeywordColumns,
  KeywordColumnsType,
  KeywordColumnsUpdate,
  KeywordColumnsUpdateArray,
} from '@/api/st/model/keyword';
import { message } from 'ant-design-vue';
import { v4 as uuid4 } from 'uuid';
import { reactive, ref } from 'vue';

import { getSourceData, requestDataForSearch } from '../search';
import { getSelectRows } from '../table';

// 更新数据
export const visibleUpdateModal = ref<boolean>(false);
export const showModalForUpdate = () => {
  visibleUpdateModal.value = !visibleUpdateModal.value;
}; // 展示更新框开关函数
export const requestDataForUpdate: Search<KeywordColumns> = reactive({
  offset: 0,
  limit: -1,
  order: null,
  order_field: null,
  fields: [],
}); // 更新框请求数据
export const jsonOptionsForUpdate = reactive({
  jsonMode: false,
  jsonData: '[]',
}); // 更新框JSON设置
export const jsonOptionsForUpdateField = reactive({
  jsonMode: false,
  jsonData: '[]',
}); // 更新框JSON设置
export const updateFields = ref<Array<Field<KeywordColumnsUpdate>>>([]);
export const columnsOptionsForUpdate = {
  columns: KeywordColumnsUpdateArray,
  columnsType: KeywordColumnsType,
}; // 字段设置
export const updateData = ref<Keyword>({
  id: 1,
  keyword: [],
  active: false,
});

export const updateOne = (obj: Keyword) => {
  // clearUpdateCondition();
  requestDataForUpdate.fields!.splice(0, requestDataForUpdate.fields!.length, {
    uuid: uuid4(),
    key: KeywordColumns.ID,
    op: Operator.EQ,
    value: obj.id,
  });
  updateData.value = obj;
  showModalForUpdate();
};

export const sendUpdateRequest = async (
  obj: Search<KeywordColumns>,
  values: Array<Field<KeywordColumnsUpdate>>,
) => {
  try {
    await updateKeywordApi({ keyword: obj, values: values });
    // message.success(ret.msg);
  } catch (identifier: any) {
    message.error(identifier.toString());
    return;
  }
}; // 发送更新请求

export const confirmUpdate = async () => {
  updateFields.value = [];
  updateFields.value.push({ key: KeywordColumnsUpdate.KEYWORD, value: updateData.value.keyword });
  updateFields.value.push({ key: KeywordColumnsUpdate.ACTIVE, value: updateData.value.active });

  await sendUpdateRequest(requestDataForUpdate, updateFields.value);
  await getSourceData(requestDataForSearch);
  showModalForUpdate();
}; // 发起更新请求

export const clearUpdateCondition = () => {
  jsonOptionsForUpdate.jsonData = '[]';
  requestDataForUpdate.fields!.splice(0, requestDataForUpdate.fields!.length);
  jsonOptionsForUpdateField.jsonData = '[]';
  updateFields.value.splice(0, updateFields.value.length);
}; // 清空更新条件

export const updateSelected = async () => {
  const srs: Array<Keyword> = await getSelectRows();
  if (srs.length == 0) {
    return;
  }
  const tmpIDs = Array<number>();
  for (const v in srs) {
    tmpIDs.push(srs[v].id);
  }
  requestDataForUpdate.fields!.splice(0, requestDataForUpdate.fields!.length, {
    key: KeywordColumns.ID,
    op: 'IN',
    value: tmpIDs,
  });
  showModalForUpdate();
}; // 更新已选数据
