import { Form, message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { createHostApi } from '@/api/st/host';
import { HostCreate } from '@/api/st/model/host';
import { getSourceData, requestDataForSearch } from '../search';

// 新增数据
const useForm = Form.useForm;
export const createRules = reactive({
  organizer: [
    {
      required: true,
      message: '请输入主办单位名称',
    },
  ],
  city: [
    {
      required: true,
      message: '请输入主办单位所在市',
    },
  ],
  homepage: [
    {
      required: true,
      message: '请输入首页网址',
    },
  ],
});
export const createData = reactive<HostCreate>({
  organizer: undefined,
  city: undefined,
  location: undefined,
  record: undefined,
  site: undefined,
  homepage: undefined,
  ip: undefined,
  active: true,
  alive: true,
  tag: Array<string>(),
  note: undefined,
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
