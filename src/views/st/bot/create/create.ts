import { Form, message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { createBotApi } from '@/api/st/bot';
import { BotCreate, BotType, BotProvider, BotSecurity } from '@/api/st/model/bot';
import { getSourceData, requestDataForSearch } from '../search';

// 新增数据
const useForm = Form.useForm;
export const createRules = reactive({
  name: [
    {
      required: true,
      message: '请输入机器人名称',
    },
  ],
});
export const createData = reactive<BotCreate>({
  name: undefined,
  apikey: undefined,
  security: {},
  ktype: BotType.NORMAL,
  provider: BotProvider.DINGTALK,
  active: false,
  note: undefined,
  at_user: [],
});
export const secType = ref(BotSecurity.SIGNATURE);
export const { resetFields, validate, validateInfos } = useForm(createData, createRules);
export const visibleCreateModal = ref<boolean>(false);
export const showModalForCreate = () => {
  visibleCreateModal.value = !visibleCreateModal.value;
}; // 展示创建框开关函数

export const sendCreateRequest = async (obj: BotCreate) => {
  try {
    await createBotApi(obj);
    // message.success(ret.msg);
  } catch (identifier: any) {
    message.error(identifier.toString());
    return;
  }
}; // 发送创建请求

export const confirmCreate = async () => {
  validate()
    .then(async () => {
      if (createData.security.text == '' || createData.security.text == null) {
        delete createData.security.text;
      }
      if (createData.security.signature == '' || createData.security.signature == null) {
        delete createData.security.signature;
      }
      await sendCreateRequest(createData);
      await getSourceData(requestDataForSearch);
      showModalForCreate();
    })
    .catch((identifier) => {
      console.log('error', identifier);
      message.error('wrong');
    });
}; // 发起创建请求
