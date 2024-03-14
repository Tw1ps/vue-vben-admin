<template>
  <PageWrapper contentFullHeight :title="t('st.page.node_detail')">
    <template #extra>
      <Space class="items-end">
        <Button @click="change2Log">{{ t('st.base.log') }}</Button>
        <Button @click="() => (page = 'system')">{{ t('st.base.system') }}</Button>
        <Button @click="change2Setting">{{ t('st.base.setting') }}</Button>
        <Button type="primary" size="large" @click="() => (page = 'homepage')">{{
          t('st.base.homepage')
        }}</Button>
      </Space>
    </template>
    <div class="!my-2 w-full" v-if="page === 'homepage'">
      <StatusView :data="data" v-if="data.length > 0" />
      <Card
        class="!my-2"
        :title="t('st.base.threads')"
        :border="false"
        mode="small"
        :loading="loading"
      >
        <vue-json-pretty :data="threadData" />
      </Card>
      <Card
        class="!my-2"
        :title="t('st.base.subprocess')"
        :border="false"
        mode="small"
        :loading="loading"
      >
        <vue-json-pretty :data="processData" />
      </Card>
      <Card
        class="!my-2"
        :title="t('st.base.async_tasks')"
        :border="false"
        mode="small"
        :loading="loading"
      >
        <vue-json-pretty :data="asyncTaskData" />
      </Card>
    </div>
    <div class="!my-2 w-full" v-else-if="page === 'log'">
      <Card
        class="!my-2"
        :title="t('st.base.log')"
        :border="false"
        mode="small"
        :loading="cmdLoading"
      >
        <template #extra>
          <Space>
            <Button style="margin-bottom: 16px" @click="() => (siderCollapsed = !siderCollapsed)">
              <MenuUnfoldOutlined v-if="menuState.collapsed" />
              <MenuFoldOutlined v-else />
            </Button>
          </Space>
        </template>
        <Layout>
          <LayoutSider :width="300" :collapsed="siderCollapsed" :collapsedWidth="0"
            ><Menu
              class="overflow-auto h-190"
              v-model:openKeys="menuState.openKeys"
              v-model:selectedKeys="menuState.selectedKeys"
              mode="inline"
              :inline-collapsed="menuState.collapsed"
              :items="logList"
              @click="handleClick"
          /></LayoutSider>
          <Layout>
            <LayoutContent>
              <MonacoEditor
                class="h-190 w-full"
                theme="vs"
                v-model:value="logText"
                language="javascript"
              />
            </LayoutContent>
          </Layout>
        </Layout>
      </Card>
    </div>
    <div class="!my-2 w-full" v-else-if="page === 'system'">
      <Card
        class="!my-2"
        :title="t('st.base.system') + t('st.base.operator_bar')"
        :border="false"
        mode="small"
        :loading="cmdLoading"
      >
        <template #extra>
          <Space>
            <Button @click="getNetstat">{{ t('st.base.netstat') }}</Button>
            <Button @click="getTasklist">{{ t('st.base.tasklist') }}</Button>
          </Space>
        </template>
        <CodeEditor
          v-model:value="cmdRet"
          :mode="MODE.HTML"
          :readonly="true"
          v-if="cmdRet !== ''"
        />
        <Empty v-if="cmdRet === ''" />
      </Card>
    </div>
    <div class="!my-2 w-full" v-else-if="page === 'setting'">
      <Card>
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.key === 'action'">
              <Flex wrap="wrap" gap="small">
                <a @click="showModalForSet(record.key, record.value)"
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
  import { PageWrapper } from '@/components/Page';
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { BasicTable, BasicColumn, useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    Card,
    message,
    Empty,
    Button,
    Space,
    Menu,
    Layout,
    LayoutSider,
    LayoutContent,
    Modal,
    Form,
    Switch,
    Input,
    InputNumber,
    SelectOption,
    Select,
    FormItem,
    Flex,
  } from 'ant-design-vue';
  import { MenuFoldOutlined, MenuUnfoldOutlined, FormOutlined } from '@ant-design/icons-vue';
  import { computed, defineComponent, onMounted, ref, unref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useTabs } from '@/hooks/web/useTabs';

  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import MonacoEditor from 'monaco-editor-vue3';

  import { NodeInfo } from '@/api/st/model/system';
  import {
    getAsyncTaskApi,
    getProcessApi,
    getSingleNodeApi,
    getThreadsApi,
    getConnectionsApi,
    getNetStatApi,
    getTaskListApi,
    readLogApi,
    getLogApi,
    getSettingApi,
    setSettingApi,
  } from '@/api/st/node';

  import { StatusView } from '../../components/StatusView';

  export default defineComponent({
    name: 'NodeDetail',
    components: {
      PageWrapper,
      Card,
      VueJsonPretty,
      Empty,
      Button,
      Space,
      Menu,
      Layout,
      LayoutSider,
      LayoutContent,
      MonacoEditor,
      Modal,
      Form,
      Switch,
      Input,
      InputNumber,
      SelectOption,
      Select,
      FormItem,
      Flex,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const { setTitle } = useTabs();

  const { currentRoute } = useRouter();
  const computedParams = computed(() => unref(currentRoute).params);
  const cid: string | string[] = computedParams.value.id;

  const data = ref<Array<NodeInfo>>([]);
  const threadData = ref<Array<string>>([]);
  const processData = ref<Array<string>>([]);
  const asyncTaskData = ref<Array<string>>([]);
  const connectionData = ref<{ closed: boolean }>();
  const cmdRet = ref<string>('');
  const cmdLoading = ref<boolean>(false);
  const page = ref<string>('homepage');
  const logList = reactive<
    Array<{
      key: number;
      label: string;
      title: string;
    }>
  >([]);
  const logText = ref<string>('');
  const menuState = reactive({
    collapsed: false,
    selectedKeys: [],
    openKeys: [],
    preOpenKeys: [],
  });
  const siderCollapsed = ref<boolean>(false);
  const loading = ref<boolean>(true);

  const handleClick = async (e) => {
    try {
      cmdLoading.value = true;
      const result = await readLogApi(cid, e.item.title);
      logText.value = result;
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      cmdLoading.value = false;
    }
  };

  const change2Log = async () => {
    try {
      page.value = 'log';
      cmdLoading.value = true;
      logList.splice(0, logList.length);
      const result = await getLogApi(cid);
      result.reverse();
      result.forEach((filename, idx) => {
        logList.push({
          key: idx,
          label: filename,
          title: filename,
        });
      });
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      cmdLoading.value = false;
    }
  };

  const change2Setting = async () => {
    page.value = 'setting';
    await getSettingData();
  };

  const getProcessInfo = async () => {
    try {
      loading.value = true;
      const result2 = await getThreadsApi(cid);
      threadData.value = result2;
      const result3 = await getProcessApi(cid);
      processData.value = result3;
      const result4 = await getAsyncTaskApi(cid);
      asyncTaskData.value = result4;
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      loading.value = false;
    }
  };

  const getNetstat = async () => {
    try {
      cmdLoading.value = true;
      const result = await getNetStatApi(cid);
      cmdRet.value = result;
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      cmdLoading.value = false;
    }
  };

  const getTasklist = async () => {
    try {
      cmdLoading.value = true;
      const result = await getTaskListApi(cid);
      cmdRet.value = result;
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      cmdLoading.value = false;
    }
  };

  // 获取数据请求
  const getSourceData = async () => {
    try {
      const result = await getSingleNodeApi(cid, undefined, undefined, -1);
      console.log(result);
      data.value = result.data;
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };

  const getConnection = async () => {
    try {
      const result = await getConnectionsApi(cid);
      connectionData.value = result[0];
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      if (connectionData.value && !connectionData.value.closed) {
        await getProcessInfo();
      }
    }
  };

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
      await setSettingApi(cid, obj);
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
        await getSettingData();
        showModalForSet();
      })
      .catch((identifier) => {
        console.log('error', identifier);
        message.error('wrong');
      });
  }; // 发起创建请求

  // 获取数据请求
  const getSettingData = async () => {
    try {
      const data = await getSettingApi(cid);
      console.log(data);

      let results = Array<{ key: string; value: any }>();
      Object.entries(data).forEach(([key, value]) => {
        results.push({ key: key, value: value });
      });

      setTableData(results);
    } catch (identifier: any) {
      message.error(identifier.toString());
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

  const [registerTable, { setTableData }] = useTable({
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
    await getSourceData();
    await getConnection();
    setTitle('节点 | ' + computedParams.value.id);
  });
</script>
