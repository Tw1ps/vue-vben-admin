import { getBotApi } from '@/api/st/bot';
import { createKeywordApi } from '@/api/st/keyword';
import { KeywordCreate } from '@/api/st/model/keyword';
import { Form, message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { getSourceData, requestDataForSearch } from '../search';

// 新增数据
const useForm = Form.useForm;
export const createRules = reactive({});
export const createData = reactive<KeywordCreate>({
  keyword: [],
  active: false,
  ktype: 0,
  note: undefined,
});
export const botId = ref<string>('');
export const { resetFields, validate, validateInfos } = useForm(createData, createRules);
export const visibleCreateModal = ref<boolean>(false);
export const showModalForCreate = () => {
  visibleCreateModal.value = !visibleCreateModal.value;
}; // 展示创建框开关函数
export const botData = ref<Array<{ value: string; label: string }>>();

export const sendCreateRequest = async (obj: KeywordCreate, bot_id: string) => {
  try {
    await createKeywordApi(obj, bot_id);
    // message.success(ret.msg);
  } catch (identifier: any) {
    message.error(identifier.toString());
    return;
  }
}; // 发送创建请求

export const confirmCreate = async () => {
  validate()
    .then(async () => {
      await sendCreateRequest(createData, botId.value);
      await getSourceData(requestDataForSearch);
      showModalForCreate();
    })
    .catch((identifier) => {
      console.log('error', identifier);
      message.error('wrong');
    });
}; // 发起创建请求

export const getBotData = async () => {
  try {
    const result = await getBotApi({ limit: -1 });
    botData.value?.splice(0, botData.value.length - 1);

    result.data.forEach((bot) => {
      botData.value?.push({ value: bot.id, label: bot.name });
    });

    // message.success(ret.msg);
  } catch (identifier: any) {
    message.error(identifier.toString());
    return;
  }
};
