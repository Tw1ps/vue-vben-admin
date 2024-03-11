import { Field } from '@/api/st/model/base';
import { v4 as uuid4 } from 'uuid';

// 切换展示模式
export const changeMode = (
  jsonOp: { jsonMode: boolean; jsonData: string },
  reqData: Array<Field<any>>,
) => {
  jsonOp.jsonMode = !jsonOp.jsonMode;
  if (jsonOp.jsonMode) {
    jsonOp.jsonData = JSON.stringify(cleanOption(reqData));
  } else if (!jsonOp.jsonMode) {
    reqData = JSON.parse(jsonOp.jsonData);
    addOption(reqData);
  }
};

// 添加搜索字段设置
export const addOption = (obj: Array<Field<any>>) => {
  if (obj.length == 0) {
    return;
  }
  delete obj[0].blop;
  obj.forEach((value: Field<any>) => {
    if (!value.uuid) {
      value.uuid = uuid4();
    }
    if (value.fields) {
      addOption(value.fields);
      value.options = {
        show: {
          add: false,
          del: false,
          addSub: false,
          clean: false,
          menu: false,
        },
      };
    }
  });
};

// 清空字段设置
export const cleanOption = (obj: Array<Field<any>>) => {
  return obj.filter((value: Field<any>) => {
    delete value.uuid;
    delete value.options;
    if (value.fields?.length) {
      value.fields = cleanOption(value.fields);
    }
    if (value.fields?.length) {
      return value;
    } else if (value.key) {
      return value;
    }
  });
};
