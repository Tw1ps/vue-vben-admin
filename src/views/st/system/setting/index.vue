<template>
  <PageWrapper
    contentFullHeight
    :title="t('st.page.system_setting')"
    :content="t('st.pageIntro.setting')"
  >
    <div class="!my-2 w-full">
      <Card>
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.key === 'action'">
              <Flex wrap="wrap" gap="small">
                <a @click="showModalForSet(record.key, record.value)" v-if="userInfo.rank <= 10"
                  ><FormOutlined />{{ t('st.base.edit') }}</a
                >
              </Flex>
            </template>
            <template v-if="column.key === 'value' && typeof text !== 'string'">
              <div class="text-wrap" v-if="typeof text === 'object'">
                <vue-json-pretty :data="text"
              /></div>
              <div class="text-wrap" v-else
                ><p>{{ text }}</p></div
              >
            </template>
          </template>
        </BasicTable>
      </Card>
    </div>

    <Modal
      v-model:open="visibleSetModal"
      class="w-auto h-auto"
      @ok="confirmSet"
      :title="t('st.base.edit')"
      :footer="null"
    >
      <Card :bordered="false" size="small">
        <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <FormItem :label="t('st.columns.key')" v-bind="validateInfos.key">
            <Input v-model:value="setData.key" :maxlength="63" placeholder="请输入键名" />
          </FormItem>
          <FormItem :label="t('st.base.type')">
            <Select v-model:value="valueType">
              <SelectOption :value="v.value" :key="v.label" v-for="v in allowType">
                {{ v.label }}
              </SelectOption>
            </Select>
          </FormItem>
          <FormItem :label="t('st.columns.value')" v-if="valueType === 'number'">
            <InputNumber id="inputNumber" placeholder="请输入值" v-model:value="setData.value" />
          </FormItem>
          <FormItem :label="t('st.columns.value')" v-else-if="valueType === 'string'">
            <Input v-model:value="setData.value" placeholder="请输入值" allow-clear />
          </FormItem>
          <FormItem :label="t('st.columns.value')" v-else-if="valueType === 'boolean'">
            <Switch
              v-model:checked="setData.value"
              checked-children="true"
              un-checked-children="false"
            />
          </FormItem>
          <FormItem :label="t('st.columns.value')" v-else-if="valueType === 'object'">
            <CodeEditor v-model:value="setData.value" :mode="MODE.JSON" />
          </FormItem>
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Space>
              <a-button type="primary" @click.prevent="confirmSet">{{
                t('st.base.confirm')
              }}</a-button>
              <a-button @click="resetFields">{{ t('st.base.reset') }}</a-button>
            </Space>
          </FormItem>
        </Form>
      </Card>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { BasicTable, BasicColumn, useTable } from '@/components/Table';
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useUserStore } from '@/store/modules/user';
  import { FormOutlined } from '@ant-design/icons-vue';
  import {
    Card,
    message,
    Flex,
    Form,
    FormItem,
    Input,
    Modal,
    Space,
    InputNumber,
    Select,
    SelectOption,
    Switch,
  } from 'ant-design-vue';
  import { defineComponent, onMounted, reactive, ref, computed } from 'vue';
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  import { getSettingApi, setSettingApi } from '@/api/st/system';

  export default defineComponent({
    name: 'Setting',
    components: {
      PageWrapper,
      Card,
      BasicTable,
      Flex,
      VueJsonPretty,
      Space,
      Modal,
      Form,
      FormItem,
      Input,
      InputNumber,
      Select,
      SelectOption,
      CodeEditor,
      Switch,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);

  const allowType = [
    { label: '字符串', value: 'string' },
    { label: '数值', value: 'number' },
    { label: '布尔值', value: 'boolean' },
    { label: '对象', value: 'object' },
  ];

  // 新增数据
  const useForm = Form.useForm;
  const valueType = ref('string');
  const setRules = reactive({
    key: [
      {
        required: true,
        message: '请输入键名',
      },
    ],
  });
  const setData = reactive<{ key: string; value: any }>({
    key: '',
    value: undefined,
  });
  const { resetFields, validate, validateInfos } = useForm(setData, setRules);
  const visibleSetModal = ref<boolean>(false);
  const showModalForSet = (key?: string, value?: any) => {
    if (key) {
      setData.key = key;
    }
    if (value || value === false) {
      setData.value = value;
      valueType.value = typeof value;
    }
    visibleSetModal.value = !visibleSetModal.value;
  }; // 展示创建框开关函数

  const sendSetRequest = async (obj: { key: string; value: any }) => {
    if (obj.key === '' || obj.key === undefined) {
      return;
    }

    try {
      await setSettingApi(obj);
      // message.success(ret.msg);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送创建请求

  const confirmSet = async () => {
    validate()
      .then(async () => {
        if (valueType.value === 'object') setData.value = JSON.parse(setData.value);
        await sendSetRequest(setData);
        await getSourceData(undefined);
        showModalForSet();
      })
      .catch((identifier) => {
        console.log('error', identifier);
        message.error('wrong');
      });
  }; // 发起创建请求

  // 获取数据请求
  const getSourceData = async (v?: string) => {
    setLoading(true);
    try {
      const data = await getSettingApi(v);
      console.log(data);

      let results = Array<{ key: string; value: any }>();
      Object.entries(data).forEach(([key, value]) => {
        results.push({ key: key, value: value });
      });

      setTableData(results);
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      setLoading(false);
    }
  };

  const columns: BasicColumn[] = [
    {
      title: t('st.columns.key'),
      dataIndex: 'key',
      align: 'right',
    },
    {
      title: t('st.columns.value'),
      dataIndex: 'value',
      align: 'left',
    },
    {
      title: t('st.base.action'),
      dataIndex: 'action',
      fixed: 'right',
      width: 180,
    },
  ]; // 数据字段定义

  const [registerTable, { setTableData, setLoading }] = useTable({
    // title: '数据展示',
    columns: columns,
    dataSource: [],
    canResize: false,
    striped: false,
    bordered: true,
    showTableSetting: false,
    tableSetting: {
      redo: false,
    },
    pagination: {
      pageSize: 100,
      pageSizeOptions: ['20', '40', '60', '80', '100'],
    },
    showIndexColumn: true,
  });

  onMounted(async () => {
    await getSourceData(undefined);
  });
</script>
