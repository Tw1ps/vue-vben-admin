import { updateLicenseApi } from '@/api/st/license';
import { Field, Operator, Search } from '@/api/st/model/base';
import {
  License,
  LicenseColumns,
  LicenseColumnsType,
  LicenseColumnsUpdate,
  LicenseColumnsUpdateArray,
} from '@/api/st/model/license';
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
export const requestDataForUpdate: Search<LicenseColumns> = reactive({
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
export const updateFields = ref<Array<Field<LicenseColumnsUpdate>>>([]);
export const columnsOptionsForUpdate = {
  columns: LicenseColumnsUpdateArray,
  columnsType: LicenseColumnsType,
}; // 字段设置

export const updateOne = (id: number) => {
  // clearUpdateCondition();
  requestDataForUpdate.fields!.splice(0, requestDataForUpdate.fields!.length, {
    uuid: uuid4(),
    key: LicenseColumns.ID,
    op: Operator.EQ,
    value: id,
  });
  showModalForUpdate();
};

export const sendUpdateRequest = async (
  obj: Search<LicenseColumns>,
  values: Array<Field<LicenseColumnsUpdate>>,
) => {
  try {
    await updateLicenseApi({ keyword: obj, values: values });
    // message.success(ret.msg);
  } catch (identifier: any) {
    message.error(identifier.toString());
    return;
  }
}; // 发送更新请求

export const confirmUpdate = async () => {
  if (jsonOptionsForUpdate.jsonMode) {
    try {
      requestDataForUpdate.fields = JSON.parse(jsonOptionsForUpdate.jsonData);
      jsonOptionsForUpdate.jsonMode = !jsonOptionsForUpdate.jsonMode;
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }
  if (jsonOptionsForUpdateField.jsonMode) {
    try {
      updateFields.value = JSON.parse(jsonOptionsForUpdateField.jsonData);
      jsonOptionsForUpdateField.jsonMode = !jsonOptionsForUpdateField.jsonMode;
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }
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
  const srs: Array<License> = await getSelectRows();
  if (srs.length == 0) {
    return;
  }
  const tmpIDs = Array<string>();
  for (const v in srs) {
    tmpIDs.push(srs[v].id);
  }
  requestDataForUpdate.fields!.splice(0, requestDataForUpdate.fields!.length, {
    key: LicenseColumns.ID,
    op: 'IN',
    value: tmpIDs,
  });
  showModalForUpdate();
}; // 更新已选数据
