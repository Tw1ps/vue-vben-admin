import { Form, message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { createUserApi } from '@/api/st/user';
import { UserCreate } from '@/api/st/model/user';
import { getSourceData, requestDataForSearch } from '../search';

// 新增数据
const useForm = Form.useForm;
export const createRules = reactive({
  username: [
    {
      required: true,
      message: '请输入用户名',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
  license: [
    {
      required: true,
      message: '请输入许可证',
    },
  ],
});
export const createData = reactive<UserCreate>({
  username: undefined,
  nickname: undefined,
  email: undefined,
  note: undefined,
  license: undefined,
  password: undefined,
  rank: undefined,
  active: true,
});
export const { resetFields, validate, validateInfos } = useForm(createData, createRules);
export const visibleCreateModal = ref<boolean>(false);
export const showModalForCreate = () => {
  visibleCreateModal.value = !visibleCreateModal.value;
}; // 展示创建框开关函数

export const sendCreateRequest = async (obj: UserCreate) => {
  try {
    await createUserApi(obj);
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
