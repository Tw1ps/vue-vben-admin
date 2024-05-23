import { Form, message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { createHostApi } from '@/api/st/host';
import { HostCreate } from '@/api/st/model/host';
import { getSourceData, requestDataForSearch } from '../search';

// 新增数据
const useForm = Form.useForm;
export const createRules = reactive({
  host: [
    {
      required: true,
      message: '请输入站点链接',
    },
  ],
  hostname: [
    {
      required: true,
      message: '请输入站点名称',
    },
  ],
});
export const createData = reactive<HostCreate>({
  host: '',
  hostname: '',
  active: true,
});
export const { resetFields, validate, validateInfos } = useForm(createData, createRules);
export const visibleCreateModal = ref<boolean>(false);
export const showModalForCreate = () => {
  visibleCreateModal.value = !visibleCreateModal.value;
}; // 展示创建框开关函数

export const sendCreateRequest = async (obj: HostCreate) => {
  try {
    await createHostApi(obj);
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
