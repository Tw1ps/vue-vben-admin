import { Form, message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { createLicenseApi } from '@/api/st/license';
import { LicenseCreate } from '@/api/st/model/license';
import { getSourceData, requestDataForSearch } from '../search';

// 新增数据
const useForm = Form.useForm;
export const createRules = reactive({
  authorized: [
    {
      required: true,
      message: '请输入授权对象',
    },
  ],
});
export const createData = reactive<LicenseCreate>({
  authorized: undefined,
  active: false,
  rank: 1000,
  max_members: 1,
  validity: dayjs().add(30, 'day').format('YYYY-MM-DDTHH:mm:ss'),
});
export const { resetFields, validate, validateInfos } = useForm(createData, createRules);
export const visibleCreateModal = ref<boolean>(false);
export const showModalForCreate = () => {
  visibleCreateModal.value = !visibleCreateModal.value;
}; // 展示创建框开关函数

export const sendCreateRequest = async (obj: LicenseCreate) => {
  try {
    await createLicenseApi(obj);
    // message.success(ret.msg);
  } catch (identifier: any) {
    message.error(identifier.toString());
    return;
  }
}; // 发送创建请求

export const confirmCreate = async () => {
  validate()
    .then(async () => {
      await sendCreateRequest(createData);
      await getSourceData(requestDataForSearch);
      showModalForCreate();
    })
    .catch((identifier) => {
      console.log('error', identifier);
      message.error('wrong');
    });
}; // 发起创建请求
