<template>
  <PageWrapper contentFullHeight :title="t('st.page.system_log')">
    <template #extra>
      <Space class="items-end">
        <Button @click="change2Handle">{{ t('st.base.handle') }}</Button>
        <Button type="primary" size="large" @click="() => (page = 'log')">{{
          t('st.base.log')
        }}</Button>
      </Space>
    </template>
    <div class="!my-2 w-full" v-if="page === 'log'">
      <Card :title="t('st.base.log')" :border="false" mode="small" :loading="cmdLoading">
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
                theme="vs-dark"
                v-model:value="logText"
                language="javascript"
              />
            </LayoutContent>
          </Layout>
        </Layout>
      </Card>
    </div>
    <div class="!my-2 w-full" v-if="page === 'handle'"
      ><Card
        :title="t('st.base.operate') + 'logger'"
        :border="false"
        mode="small"
        :loading="cmdLoading"
      >
        <Flex gap="middle" vertical>
          <div>
            {{ t('st.base.select') + 'logger' }}:
            <Select
              class="min-w-1/3"
              v-model:value="logger"
              show-search
              :placeholder="t('st.base.select') + 'logger'"
              :options="loggersOption"
              :filter-option="filterOption"
              @change="handleChange"
            />
          </div>
          <div class="!my-2">
            logger {{ t('st.base.handle') }} <vue-json-pretty :data="loggerHandle"
          /></div>
          <Flex gap="middle" horizontal
            ><Tooltip placement="top">
              <template #title>
                <span>{{ t('st.desc.attach_handle') }}</span>
                <span>{{ t('st.desc.not_attach_handle') }}</span>
              </template>
              <Button @click="addLogHandle">{{ t('st.base.attach') }}</Button>
            </Tooltip>
            <Tooltip placement="top">
              <template #title>
                <span>{{ t('st.desc.delete_handle') }}</span>
              </template>
              <Button @click="delLogHandle">{{ t('st.base.cancel') + t('st.base.attach') }}</Button>
            </Tooltip>
            <Tooltip placement="top">
              <template #title>
                <span>{{ t('st.desc.cover_handle') }}</span>
              </template>
              <Button @click="coverLogHandle">{{ t('st.base.cover') }}</Button>
            </Tooltip>
            <Space>
              {{ t('st.base.log') + t('st.base.level') }}:
              <Select
                v-model:value="loggerLevel"
                show-search
                :placeholder="t('st.base.select') + t('st.base.log') + t('st.base.level')"
                :options="loggerLevelList"
                :filter-option="filterOption"
              />
              <Button @click="setLogLevel">{{ t('st.base.set') }}</Button>
            </Space>
          </Flex>
        </Flex>
      </Card>
      <Card
        class="!my-2"
        :title="t('st.base.all') + t('st.base.handle')"
        :border="false"
        mode="small"
        :loading="cmdLoading2"
        ><vue-json-pretty :data="loggers"
      /></Card>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    Card,
    message,
    Button,
    Space,
    Menu,
    Layout,
    LayoutSider,
    LayoutContent,
    Select,
    Flex,
    Tooltip,
  } from 'ant-design-vue';
  import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
  import { defineComponent, onMounted, ref, reactive } from 'vue';

  import MonacoEditor from 'monaco-editor-vue3';
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  import {
    readLogApi,
    getLogApi,
    getAllLoggerApi,
    getLogHandleApi,
    addLogHandleApi,
    delLogHandleApi,
    coverLogHandleApi,
    setLogLevelApi,
  } from '@/api/st/log';

  export default defineComponent({
    name: 'SystemLog',
    components: {
      PageWrapper,
      Card,
      Button,
      Space,
      Menu,
      Layout,
      LayoutSider,
      LayoutContent,
      MonacoEditor,
      Select,
      VueJsonPretty,
      Flex,
      Tooltip,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

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
  const cmdLoading = ref<boolean>(false);
  const cmdLoading2 = ref<boolean>(false);
  const page = ref<string>('log');
  const loggers = ref<object>({});
  const loggersOption = ref<Array<{ value: string; label: string }>>([]);
  const logger = ref<string | undefined>(undefined);
  const loggerHandle = ref<Array<string>>([]);
  const loggerLevel = ref<string>('INFOR');
  const loggerLevelList = ref<Array<{ value: string; label: string }>>([
    { value: 'TRACE', label: 'TRACE' },
    { value: 'DEBUG', label: 'DEBUG' },
    { value: 'INFOR', label: 'INFOR' },
    { value: 'ALERT', label: 'ALERT' },
    { value: 'ERROR', label: 'ERROR' },
  ]);

  const handleClick = async (e) => {
    try {
      cmdLoading.value = true;
      const result = await readLogApi(e.item.title);
      logText.value = result;
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      cmdLoading.value = false;
    }
  };

  const change2Log = async () => {
    try {
      cmdLoading2.value = true;
      logList.splice(0, logList.length);
      const result = await getLogApi();
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
      cmdLoading2.value = false;
    }
  };

  const change2Handle = async () => {
    try {
      cmdLoading.value = true;
      page.value = 'handle';

      const result = await getAllLoggerApi();
      loggers.value = result;

      Object.entries(result).forEach(([k, v]) => {
        loggersOption.value.push({ value: k, label: k });
      });
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      cmdLoading.value = false;
    }
  };

  const handleChange = async (value, option) => {
    try {
      cmdLoading.value = true;
      const result = await getLogHandleApi(value);
      loggerHandle.value = result;
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      cmdLoading.value = false;
    }
  };

  const addLogHandle = async () => {
    try {
      if (logger.value) {
        await addLogHandleApi(logger.value);
        const result = await getLogHandleApi(logger.value);
        loggerHandle.value = result;
      }
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };

  const delLogHandle = async () => {
    try {
      if (logger.value) {
        await delLogHandleApi(logger.value);
        const result = await getLogHandleApi(logger.value);
        loggerHandle.value = result;
      }
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };

  const coverLogHandle = async () => {
    try {
      if (logger.value) {
        await coverLogHandleApi(logger.value);
        const result = await getLogHandleApi(logger.value);
        loggerHandle.value = result;
      }
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };

  const setLogLevel = async () => {
    try {
      if (logger.value) {
        await setLogLevelApi(logger.value, loggerLevel.value);
      }
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };

  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  onMounted(async () => {
    await change2Log();
  });
</script>
