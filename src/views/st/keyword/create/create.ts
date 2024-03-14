import { Form, message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { createKeywordApi } from '@/api/st/keyword';
import { KeywordCreate } from '@/api/st/model/keyword';
import { getSourceData, requestDataForSearch } from '../search';

// 新增数据
const useForm = Form.useForm;
export const createRules = reactive({});
export const createData = reactive<KeywordCreate>({
  keyword: [],
  active: false,
  note: undefined,
});
export const { resetFields, validate, validateInfos } = useForm(createData, createRules);
export const visibleCreateModal = ref<boolean>(false);
export const showModalForCreate = () => {
  visibleCreateModal.value = !visibleCreateModal.value;
}; // 展示创建框开关函数

export const sendCreateRequest = async (obj: KeywordCreate) => {
  try {
    await createKeywordApi(obj);
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
