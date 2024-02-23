import { getHostDetailApi, updateHostApi } from '@/api/st/host';
import { Field, Operator, Search } from '@/api/st/model/base';
import { Host, HostColumns, HostColumnsUpdate } from '@/api/st/model/host';
import { useI18n } from '@/hooks/web/useI18n';
import { Form, message } from 'ant-design-vue';
import { Ref, ref } from 'vue';

const { t } = useI18n();

export const data: Ref<Host> = ref({});
const hostID = ref(0);

// 获取数据请求
export const getSourceData = async (v: number | string | Array<any>) => {
  try {
    data.value = await getHostDetailApi(v);
  } catch (identifier: any) {
    message.error(identifier.toString());
  }
};

// 修改相关
const useForm = Form.useForm;
export const updateData = ref({
  organizer: undefined,
  city: undefined,
  location: undefined,
  record: undefined,
  site: undefined,
  homepage: undefined,
  active: false,
  alive: false,
  tag: Array<string>(),
  note: undefined,
});

export const { resetFields, validate, validateInfos } = useForm(updateData);
export const visibleUpdateModal = ref<boolean>(false);
export const showModalForUpdate = (id) => {
  hostID.value = id;
  updateData.value.active = data.value.active;
  updateData.value.alive = data.value.alive;
  updateData.value.tag = data.value.tag;
  visibleUpdateModal.value = !visibleUpdateModal.value;
}; // 展示创建框开关函数

const sendUpdateRequest = async (obj: {
  keyword: Search<HostColumns>;
  values: Array<Field<HostColumnsUpdate>>;
}) => {
  try {
    await updateHostApi(obj);
    // message.success(ret.msg);
  } catch (identifier: any) {
    message.error(identifier.toString());
    return;
  }
}; // 发送创建请求

const transformData = () => {
  // 使用Object.entries()方法获取对象的键值对数组，并利用reduce()方法进行筛选和生成新对象
  console.log(updateData.value);

  const filteredData: Array<Field<HostColumnsUpdate>> = Object.entries(updateData.value).reduce<
    Array<Field<HostColumnsUpdate>>
  >((acc, [_key, _value]) => {
    if (_value !== undefined && _value !== '') {
      if (_value === 'null') {
        if (
          _key !== HostColumns.ALERT &&
          _key !== HostColumns.ALIVE &&
          _key !== HostColumns.CITY &&
          _key !== HostColumns.ORGANIZER
        ) {
          acc.push({ key: HostColumnsUpdate[_key.toUpperCase()], value: null });
        } else if (_value) {
          message.warning(
            t('st.columns.' + _key) + t('st.base.not_allow') + t('st.op.eq') + _value.toString(),
            3,
          );
        }
      } else {
        acc.push({ key: HostColumnsUpdate[_key.toUpperCase()], value: _value }); // 将包含 key 和 value 属性的对象推入数组
      }
    }
    return acc;
  }, []);

  console.log(filteredData);

  return filteredData;
};

export const confirmUpdate = async () => {
  validate()
    .then(async () => {
      const filteredData = transformData();

      const searchData: Search<HostColumns> = {
        limit: 1,
        fields: [{ key: HostColumns.ID, op: Operator.EQ, value: hostID.value }],
      };
      const requestDataForUpdate = {
        keyword: searchData,
        values: filteredData,
      };

      await sendUpdateRequest(requestDataForUpdate);
      await getSourceData(hostID.value);
      showModalForUpdate(hostID.value);
    })
    .catch((identifier) => {
      console.log('error', identifier);
      message.error('wrong');
    });
}; // 发起创建请求
