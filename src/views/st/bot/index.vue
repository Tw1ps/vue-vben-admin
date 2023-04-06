<template>
  <PageWrapper contentFullHeight :title="t('st.page.bot')" :content="t('st.pageIntro.bot')">
    <div class="!my-2 w-full">
      <Card size="small" :bordered="false">
        <Collapse ghost>
          <CollapsePanel key="1" :header="t('st.base.search') + t('st.base.bar')">
            <FieldList
              :data="requestDataForSearch.fields"
              :options="columnsOptions"
              v-if="!jsonOptionsForSearch.jsonMode"
            />
            <CodeEditor
              v-model:value="jsonOptionsForSearch.jsonData"
              :mode="MODE.JSON"
              v-if="jsonOptionsForSearch.jsonMode"
            />
            <Card size="small" class="!my-2 text-right" :bordered="false"
              ><Space>
                <a @click="changeMode(jsonOptionsForSearch, requestDataForSearch.fields)"
                  ><RetweetOutlined />{{ t('st.base.change_mode') }}</a
                >
                <Popconfirm
                  title="确定重置搜索条件吗？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="clearSearchCondition"
                >
                  <a><RestOutlined />{{ t('st.base.reset') }}</a>
                </Popconfirm>
                <a @click="sendSearchRequest()"><SearchOutlined />{{ t('st.base.search') }}</a>
              </Space></Card
            >
          </CollapsePanel>
          <CollapsePanel key="2" :header="t('st.base.tool') + t('st.base.bar')">
            <Card size="small" class="text-right" :bordered="false"
              ><Space>
                <a @click="showModalForCreate"><PlusSquareOutlined />{{ t('st.base.create') }}</a>
                <a @click="updateSelected"
                  ><FormOutlined />{{ t('st.base.update') + t('st.base.selected') }}</a
                >
                <a @click="showModalForUpdate"
                  ><FormOutlined />{{ t('st.base.condition') + t('st.base.update') }}</a
                >
                <Popconfirm
                  title="确定删除已选数据吗？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteSelected"
                >
                  <a><RestOutlined />{{ t('st.base.delete') + t('st.base.selected') }}</a>
                </Popconfirm>
                <Popconfirm
                  title="确定删除全部数据吗？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteAll"
                >
                  <a><RestOutlined />{{ t('st.base.delete') + t('st.base.all') }}</a>
                </Popconfirm>
                <a @click="showModalForDelete"
                  ><DeleteOutlined />{{ t('st.base.condition') + t('st.base.delete') }}</a
                >
              </Space></Card
            >
          </CollapsePanel>
        </Collapse>
      </Card>
      <Card class="!my-2">
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.key === 'active'">
              <Tag color="green" v-if="text">True</Tag>
              <Tag color="red" v-else>False</Tag>
            </template>
            <template v-else-if="column.key === 'filtr'">
              <Tag color="green" v-if="text">True</Tag>
              <Tag color="red" v-else>False</Tag>
            </template>
            <template v-else-if="column.key === 'receive_broadcast'">
              <Tag color="green" v-if="text">True</Tag>
              <Tag color="red" v-else>False</Tag>
            </template>
            <template v-else-if="column.key === 'apikey'">
              <Tag>{{ text }}</Tag>
            </template>
            <template v-else-if="column.key === 'at_user'">
              <Tag :color="getRandomColor()" :key="u" v-for="u in text">{{ u }}</Tag>
            </template>
            <template v-else-if="column.key === 'subscribe'">
              <Popover trigger="hover">
                <template #content>
                  <Tag :color="getRandomColor()" :key="u.id" v-for="u in text"
                    >{{ u.id }}:{{ u.name }}</Tag
                  >
                </template>
                <Tag :color="getRandomColor()" :key="u.id" v-for="u in text"
                  >{{ u.id }}:{{ u.name }}</Tag
                >
              </Popover>
            </template>
            <template v-else-if="column.key === 'ktype'">
              {{ t('st.enum.' + BotType[text].toLowerCase()) }}
            </template>
            <template v-else-if="column.key === 'provider'">
              {{ t('st.enum.' + BotProvider[text].toLowerCase()) }}
            </template>
            <template v-else-if="column.key === 'security'">
              <Tag v-if="text?.signature">{{ t('st.enum.signature') }}: {{ text.signature }}</Tag>
              <Tag v-if="text?.text">{{ t('st.enum.text') }}: {{ text.text }}</Tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <Space>
                <a
                  v-if="(userInfo.rank <= 10 || userInfo.id == record.user_id) && record.active"
                  @click="showModalForSubscribe(record)"
                  ><MessageOutlined />{{ t('st.columns.subscribe') }}</a
                >
                <a
                  @click="updateOne(record.id)"
                  v-if="userInfo.rank <= 10 || userInfo.id == record.user_id"
                  ><FormOutlined />{{ t('st.base.update') }}</a
                >
                <Popconfirm
                  title="确定删除吗？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteOne(record)"
                >
                  <a v-if="userInfo.rank <= 10 || userInfo.id == record.user_id"
                    ><DeleteOutlined />{{ t('st.base.delete') }}</a
                  >
                </Popconfirm>
              </Space>
            </template>
          </template>
        </BasicTable>
      </Card>
      <Card :title="t('st.base.usage')" :bordered="false">使用说明</Card>
    </div>
    <Modal
      v-model:visible="visibleDeleteModal"
      class="w-auto h-auto"
      @ok="confirmDelete"
      title="按条件删除"
    >
      <SearchForm
        :data="requestDataForDelete"
        :options="columnsOptions"
        :jsonOptions="jsonOptionsForDelete"
        :showOffset="false"
        :showOrder="false"
      />
    </Modal>
    <Modal
      v-model:visible="visibleSubscribeModal"
      class="w-auto h-auto"
      width="1000px"
      :footer="null"
      :title="t('st.base.manager') + t('st.columns.subscribe')"
    >
      <Card size="small" :bordered="false">
        当前操作机器人: {{ listener?.name }}
        <Input
          v-model:value="serviceFiltr"
          :placeholder="t('st.columns.filtr') + t('st.columns.service')"
          allowClear
        />
      </Card>
      <div class="grid md:grid-cols-2 gap-4">
        <Card
          :title="t('st.columns.subscribed') + t('st.columns.service')"
          size="small"
          :bordered="true"
        >
          <List
            item-layout="horizontal"
            :data-source="listener?.subscribe ? listener?.subscribe : []"
          >
            <template #renderItem="{ item }">
              <ListItem
                v-if="
                  (serviceFiltr &&
                    item.name.toLowerCase().search(serviceFiltr.toLowerCase()) !== -1) ||
                  (serviceFiltr &&
                    item.note &&
                    item.note.toLowerCase().search(serviceFiltr.toLowerCase()) !== -1) ||
                  serviceFiltr == undefined ||
                  serviceFiltr == ''
                "
              >
                <template #actions>
                  <a @click="delSubscribe(item.id)">{{
                    t('st.base.cancel') + t('st.columns.subscribe')
                  }}</a>
                </template>
                <ListItemMeta :description="item.note">
                  <template #title>
                    {{ item.name }}
                  </template>
                </ListItemMeta>
                <Tooltip>
                  <template #title>是否使用机器人关联的关键词组过滤消息</template>
                  <Tag color="green" v-if="item.filtr">{{ t('st.columns.filtr') }}: True</Tag>
                  <Tag color="red" v-else>{{ t('st.columns.filtr') }}: False</Tag>
                </Tooltip>
              </ListItem>
            </template>
          </List>
        </Card>
        <Card :title="t('st.columns.service')" size="small" :bordered="true">
          <List item-layout="horizontal" :data-source="subscribeData">
            <template #renderItem="{ item }">
              <ListItem
                v-if="
                  ((serviceFiltr &&
                    item.name.toLowerCase().search(serviceFiltr.toLowerCase()) !== -1) ||
                    (serviceFiltr &&
                      item.note &&
                      item.note.toLowerCase().search(serviceFiltr.toLowerCase()) !== -1) ||
                    serviceFiltr == undefined ||
                    serviceFiltr == '') &&
                  listenerSubscribe?.indexOf(item.id) < 0 &&
                  item.id != listener!.id
                "
              >
                <template #actions>
                  <Dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click.prevent>
                      {{ t('st.columns.subscribe') }}
                    </a>
                    <template #overlay>
                      <Menu>
                        <MenuItem key="1"
                          ><a @click="addSubscribe(item, true)">使用关键词组过滤消息</a></MenuItem
                        >
                        <MenuItem key="2"
                          ><a @click="addSubscribe(item, false)">{{
                            t('st.columns.nofiltr')
                          }}</a></MenuItem
                        >
                      </Menu>
                    </template>
                  </Dropdown>
                </template>
                <ListItemMeta :description="item.note">
                  <template #title>
                    {{ item.name }}
                  </template>
                </ListItemMeta>
              </ListItem>
            </template>
          </List>
        </Card>
      </div>
    </Modal>
    <Modal
      v-model:visible="visibleUpdateModal"
      class="h-auto"
      width="1000px"
      @ok="confirmUpdate"
      title="按条件更新"
      :footer="null"
    >
      <div class="grid md:grid-cols-2 gap-4">
        <Card title="更新条件" size="small" :bordered="true">
          <FieldList
            :data="requestDataForUpdate.fields"
            :options="columnsOptions"
            v-if="!jsonOptionsForUpdate.jsonMode"
          />
          <CodeEditor
            v-model:value="jsonOptionsForUpdate.jsonData"
            :mode="MODE.JSON"
            v-if="jsonOptionsForUpdate.jsonMode"
          />
        </Card>
        <Card title="更新字段" size="small" :bordered="true">
          <UpdateFieldList
            :data="updateFields"
            :options="columnsOptionsForUpdate"
            v-if="!jsonOptionsForUpdateField.jsonMode"
          />
          <CodeEditor
            v-model:value="jsonOptionsForUpdateField.jsonData"
            :mode="MODE.JSON"
            v-if="jsonOptionsForUpdateField.jsonMode"
          />
        </Card>
      </div>
      <Card size="small" class="!my-2 text-right" :bordered="false"
        ><Space>
          <a
            @click="
              () => {
                changeMode(jsonOptionsForUpdate, requestDataForUpdate.fields);
                changeMode(jsonOptionsForUpdateField, updateFields);
              }
            "
            ><RetweetOutlined />{{ t('st.base.change_mode') }}</a
          >
          <Popconfirm
            title="确定重置更新条件吗？"
            ok-text="Yes"
            cancel-text="No"
            @confirm="clearUpdateCondition"
          >
            <a><RestOutlined />{{ t('st.base.reset') }}</a>
          </Popconfirm>
          <a @click="confirmUpdate()"><SendOutlined />{{ t('st.base.update') }}</a>
        </Space></Card
      >
    </Modal>
    <Modal
      v-model:visible="visibleCreateModal"
      class="w-auto h-auto"
      @ok="confirmCreate"
      :title="t('st.base.create')"
      :footer="null"
    >
      <Card :bordered="false" size="small">
        <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <FormItem :label="t('st.columns.name')" v-bind="validateInfos.name">
            <Input v-model:value="createData.name" />
          </FormItem>
          <FormItem :label="t('st.columns.apikey')" v-bind="validateInfos.apikey">
            <Input v-model:value="createData.apikey" />
          </FormItem>
          <FormItem :label="t('st.columns.security')">
            <Tooltip>
              <template #title>机器人推送消息的安全验证方式</template>
              <InputGroup compact>
                <Select v-model:value="secType">
                  <SelectOption :value="BotSecurity[v]" :key="v" v-for="v in BotSecurity">
                    {{ t('st.enum.' + v.toLowerCase()) }}
                  </SelectOption>
                </Select>
                <Input
                  style="width: 70%"
                  v-model:value="createData.security.signature"
                  v-if="secType == BotSecurity.SIGNATURE"
                  allowClear
                />
                <Input
                  style="width: 70%"
                  v-model:value="createData.security.text"
                  v-if="secType == BotSecurity.TEXT"
                  allowClear
                />
              </InputGroup>
            </Tooltip>
          </FormItem>
          <FormItem :label="t('st.columns.ktype')">
            <Select v-model:value="createData.ktype">
              <SelectOption :value="v.value" :key="v.label" v-for="v in BotTypeArray">
                {{ t('st.enum.' + v.label.toLowerCase()) }}
              </SelectOption>
            </Select>
          </FormItem>
          <FormItem
            :label="t('st.columns.service_rank')"
            v-if="
              createData.ktype == BotType.SERVICE || createData.ktype == BotType.PRIVATE_SERVICE
            "
          >
            <InputNumber :min="0" v-model:value="createData.service_rank" />
          </FormItem>
          <FormItem :label="t('st.columns.provider')">
            <Select v-model:value="createData.provider">
              <SelectOption :value="v.value" :key="v.label" v-for="v in BotProviderArray">
                {{ t('st.enum.' + v.label.toLowerCase()) }}
              </SelectOption>
            </Select>
          </FormItem>
          <FormItem :label="t('st.columns.note')">
            <Input v-model:value="createData.note" allowClear />
          </FormItem>
          <FormItem :label="t('st.columns.at_user')">
            <Select mode="tags" v-model:value="createData.at_user" />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="createData.active" />
          </FormItem>
          <FormItem :label="t('st.columns.receive_broadcast')">
            <Switch v-model:checked="createData.receive_broadcast" />
          </FormItem>
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Space>
              <a-button type="primary" @click.prevent="confirmCreate">{{
                t('st.base.add')
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
  import { defineComponent, onMounted, ref, reactive, computed } from 'vue';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import {
    Card,
    Collapse,
    CollapsePanel,
    Space,
    Popconfirm,
    Modal,
    Tag,
    Form,
    FormItem,
    Input,
    Switch,
    Select,
    SelectOption,
    InputNumber,
    Tooltip,
    Popover,
    InputGroup,
    List,
    ListItem,
    ListItemMeta,
    Dropdown,
    Menu,
    MenuItem,
  } from 'ant-design-vue';
  import {
    SearchOutlined,
    RestOutlined,
    RetweetOutlined,
    DeleteOutlined,
    PlusSquareOutlined,
    FormOutlined,
    SendOutlined,
    MessageOutlined,
  } from '@ant-design/icons-vue';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { SubscribeColumns } from '/@/api/st/model/subscribe';

  export default defineComponent({
    name: 'Bot',
    components: {
      BasicTable,
      PageWrapper,
      Card,
      Collapse,
      CollapsePanel,
      Space,
      Popconfirm,
      CodeEditor,
      Modal,
      SearchForm,
      Tag,
      Form,
      FormItem,
      Input,
      Switch,
      Select,
      InputNumber,
      Tooltip,
      Popover,
      InputGroup,
      List,
      ListItem,
      ListItemMeta,
      Dropdown,
      Menu,
      MenuItem,
    },
  });
</script>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { FieldList, SearchForm, UpdateFieldList } from '/@/components/FieldEditor';
  import { Search, Field, Operator } from '/@/api/st/model/base';
  import {
    Bot,
    BotColumns,
    BotColumnsArray,
    BotColumnsType,
    BotCreate,
    BotColumnsUpdate,
    BotColumnsUpdateArray,
    BotColumnsNative,
    BotType,
    BotProvider,
    BotSecurity,
    BotProviderArray,
    BotTypeArray,
  } from '/@/api/st/model/bot';
  import { getBotApi, deleteBotApi, updateBotApi, createBotApi } from '/@/api/st/bot';
  import { getSubscribeApi, createSubscribeApi, deleteSubscribeApi } from '/@/api/st/subscribe';
  import { v4 as uuid4 } from 'uuid';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const columns: BasicColumn[] = [
    {
      title: t('st.columns.id'),
      dataIndex: 'id',
      sorter: true,
    },
    {
      title: t('st.columns.name'),
      dataIndex: 'name',
      align: 'left',
      width: 300,
    },
    {
      title: t('st.columns.apikey'),
      dataIndex: 'apikey',
      width: 500,
      defaultHidden: true,
    },
    {
      title: t('st.columns.security'),
      dataIndex: 'security',
      width: 500,
      defaultHidden: true,
    },
    {
      title: t('st.columns.ktype'),
      dataIndex: 'ktype',
    },
    {
      title: t('st.columns.provider'),
      dataIndex: 'provider',
    },
    {
      title: t('st.columns.service_rank'),
      dataIndex: 'service_rank',
      sorter: true,
      width: 120,
    },
    {
      title: t('st.columns.active'),
      dataIndex: 'active',
      width: 120,
    },
    {
      title: t('st.columns.receive_broadcast'),
      dataIndex: 'receive_broadcast',
      width: 120,
    },
    {
      title: t('st.columns.note'),
      dataIndex: 'note',
      align: 'left',
      width: 300,
    },
    {
      title: t('st.columns.at_user'),
      dataIndex: 'at_user',
    },
    {
      title: t('st.columns.subscribe'),
      dataIndex: 'subscribe',
      width: 300,
    },
    {
      title: t('st.columns.user_id'),
      dataIndex: 'user_id',
      sorter: true,
      defaultHidden: true,
    },
    {
      title: t('st.columns.username'),
      dataIndex: 'username',
    },
    {
      title: t('st.base.action'),
      dataIndex: 'action',
      fixed: 'right',
      width: 180,
    },
  ]; // 数据字段定义
  const columnsOptions = {
    columns: BotColumnsArray,
    columnsType: BotColumnsType,
  }; // 字段设置

  // 获取数据请求
  const getSourceData = async (v: Search<BotColumns>) => {
    if (jsonOptionsForSearch.jsonMode) {
      try {
        requestDataForSearch.fields = JSON.parse(jsonOptionsForSearch.jsonData);
        jsonOptionsForSearch.jsonMode = !jsonOptionsForSearch.jsonMode;
      } catch (identifier: any) {
        message.error(identifier.toString());
        return;
      }
    }
    setLoading(true);
    try {
      const { data, total } = await getBotApi(v);
      if (data) {
        setTableData(data);
      }
      if (total) {
        setPagination({
          total: total,
          pageSize: v.limit!,
          current: v.offset! / v.limit! + 1,
        });
      }
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      setLoading(false);
    }
  };

  const tableChangeHandle = async (pagination, filters, sorter) => {
    console.log(pagination);
    console.log(filters);
    console.log(sorter);

    requestDataForSearch.offset = (pagination.current - 1) * pagination.pageSize;
    requestDataForSearch.limit = pagination.pageSize;
    requestDataForSearch.order = sorter.order?.replace('end', '');
    requestDataForSearch.order_field = sorter.field;

    await getSourceData(requestDataForSearch);
  };

  // 更新数据
  const visibleUpdateModal = ref<boolean>(false);
  const showModalForUpdate = () => {
    visibleUpdateModal.value = !visibleUpdateModal.value;
  }; // 展示更新框开关函数
  let requestDataForUpdate: Search<BotColumns> = reactive({
    offset: 0,
    limit: -1,
    order: null,
    order_field: null,
    fields: [],
  }); // 更新框请求数据
  let jsonOptionsForUpdate = reactive({
    jsonMode: false,
    jsonData: '[]',
  }); // 更新框JSON设置
  let jsonOptionsForUpdateField = reactive({
    jsonMode: false,
    jsonData: '[]',
  }); // 更新框JSON设置
  const updateFields = ref<Array<Field<BotColumnsUpdate>>>([]);
  const columnsOptionsForUpdate = {
    columns: BotColumnsUpdateArray,
    columnsType: BotColumnsType,
  }; // 字段设置

  const updateOne = (id: number) => {
    // clearUpdateCondition();
    requestDataForUpdate.fields.splice(0, requestDataForUpdate.fields.length, {
      uuid: uuid4(),
      key: BotColumns.ID,
      operator: Operator.EQ,
      value: id,
    });
    showModalForUpdate();
  };

  const sendUpdateRequest = async (
    obj: Search<BotColumns>,
    values: Array<Field<BotColumnsUpdate>>,
  ) => {
    try {
      const ret = await updateBotApi({ keyword: obj, new_values: values });
      message.success(ret.message);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送更新请求

  const confirmUpdate = async () => {
    if (jsonOptionsForUpdate.jsonMode) {
      try {
        requestDataForUpdate.fields = JSON.parse(jsonOptionsForUpdate.jsonData);
        jsonOptionsForUpdate.jsonMode = !jsonOptionsForUpdate.jsonMode;
      } catch (identifier: any) {
        message.error(identifier.toString());
        return;
      }
    }
    if (jsonOptionsForUpdateField.jsonMode) {
      try {
        updateFields.value = JSON.parse(jsonOptionsForUpdateField.jsonData);
        jsonOptionsForUpdateField.jsonMode = !jsonOptionsForUpdateField.jsonMode;
      } catch (identifier: any) {
        message.error(identifier.toString());
        return;
      }
    }
    await sendUpdateRequest(requestDataForUpdate, updateFields.value);
    await getSourceData(requestDataForSearch);
    showModalForUpdate();
  }; // 发起更新请求

  const clearUpdateCondition = () => {
    jsonOptionsForUpdate.jsonData = '[]';
    requestDataForUpdate.fields.splice(0, requestDataForUpdate.fields.length);
    jsonOptionsForUpdateField.jsonData = '[]';
    updateFields.value.splice(0, updateFields.value.length);
  }; // 清空更新条件

  const updateSelected = async () => {
    const srs: Array<Bot> = await getSelectRows();
    if (srs.length == 0) {
      return;
    }
    let tmpIDs = Array<number>();
    for (const v in srs) {
      tmpIDs.push(srs[v].id);
    }
    requestDataForUpdate.fields.splice(0, requestDataForUpdate.fields.length, {
      key: BotColumns.ID,
      operator: 'IN',
      value: tmpIDs,
    });
    showModalForUpdate();
  }; // 更新已选数据

  // 新增数据
  const useForm = Form.useForm;
  const secType = ref(BotSecurity.SIGNATURE);
  const createRules = reactive({
    name: [
      {
        required: true,
        message: '请输入机器人名称',
      },
    ],
  });
  let createData = reactive<BotCreate>({
    name: undefined,
    apikey: undefined,
    security: {},
    ktype: BotType.NORMAL,
    provider: BotProvider.DINGTALK,
    active: false,
    service_rank: 1000,
    receive_broadcast: false,
    note: undefined,
    at_user: [],
  });
  const { resetFields, validate, validateInfos } = useForm(createData, createRules);
  const visibleCreateModal = ref<boolean>(false);
  const showModalForCreate = () => {
    visibleCreateModal.value = !visibleCreateModal.value;
  }; // 展示创建框开关函数

  const sendCreateRequest = async (obj: BotCreate) => {
    try {
      const ret = await createBotApi(obj);
      message.success(ret.message);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送创建请求

  const confirmCreate = async () => {
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

  // 搜索相关
  let requestDataForSearch: Search<BotColumns> = reactive({
    offset: 0,
    limit: 20,
    order: null,
    order_field: null,
    fields: [],
  }); // 搜索框请求数据
  let jsonOptionsForSearch = reactive({
    jsonMode: false,
    jsonData: '[]',
  }); // 搜索框JSON设置

  const clearSearchCondition = () => {
    jsonOptionsForSearch.jsonData = '[]';
    requestDataForSearch.fields.splice(0, requestDataForSearch.fields.length);
  }; // 清空搜索条件

  const sendSearchRequest = async () => {
    requestDataForSearch.offset = 0;
    await getSourceData(requestDataForSearch);
  }; // 发送搜索请求

  // 切换展示模式
  const changeMode = (
    jsonOp: { jsonMode: boolean; jsonData: string },
    reqData: Array<Field<any>>,
  ) => {
    jsonOp.jsonMode = !jsonOp.jsonMode;
    if (jsonOp.jsonMode) {
      jsonOp.jsonData = JSON.stringify(cleanOption(reqData));
    } else if (!jsonOp.jsonMode) {
      reqData = JSON.parse(jsonOp.jsonData);
      addOption(reqData);
    }
  };

  // 添加搜索字段设置
  const addOption = (obj: Array<Field<any>>) => {
    if (obj.length == 0) {
      return;
    }
    delete obj[0].bop;
    obj.forEach((value: Field<any>) => {
      if (!value.uuid) {
        value.uuid = uuid4();
      }
      if (value.fields) {
        addOption(value.fields);
        value.options = {
          show: {
            add: false,
            del: false,
            addSub: false,
            clean: false,
            menu: false,
          },
        };
      }
    });
  };

  // 清空字段设置
  const cleanOption = (obj: Array<Field<any>>) => {
    return obj.filter((value: Field<any>) => {
      delete value.uuid;
      delete value.options;
      if (value.fields?.length) {
        value.fields = cleanOption(value.fields);
      }
      if (value.fields?.length) {
        return value;
      } else if (value.key) {
        return value;
      }
    });
  };

  // 删除相关
  const visibleDeleteModal = ref<boolean>(false); // 展示条件删除框开关
  let requestDataForDelete: Search<BotColumnsNative> = reactive({
    offset: 0,
    limit: 1,
    order: null,
    order_field: null,
    fields: [],
  }); // 条件删除设置
  let jsonOptionsForDelete = reactive({
    jsonMode: false,
    jsonData: '[]',
  }); // 条件删除的JSON设置

  const showModalForDelete = () => {
    visibleDeleteModal.value = !visibleDeleteModal.value;
  }; // 展示条件删除框开关函数

  const sendDeleteRequest = async (obj: Search<BotColumnsNative>) => {
    try {
      const ret = await deleteBotApi(obj);
      message.success(ret.message);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送删除请求

  const deleteOne = async (obj: Bot) => {
    await sendDeleteRequest({
      offset: 0,
      limit: 1,
      fields: [{ key: BotColumnsNative.ID, operator: Operator.EQ, value: obj.id }],
      order_field: null,
      order: null,
    });
    await getSourceData(requestDataForSearch);
  }; // 按ID删除单个数据

  const deleteAll = async () => {
    await sendDeleteRequest({
      offset: 0,
      limit: -1,
      fields: [],
      order_field: null,
      order: null,
    });
    await sendSearchRequest();
  }; // 删除全部数据

  const deleteSelected = async () => {
    const srs: Array<Bot> = await getSelectRows();
    if (srs.length == 0) {
      return;
    }
    let tmpIDs = Array<number>();
    for (const v in srs) {
      tmpIDs.push(srs[v].id);
    }
    await sendDeleteRequest({
      offset: 0,
      limit: 1,
      fields: [{ key: BotColumnsNative.ID, operator: 'IN', value: tmpIDs }],
      order_field: null,
      order: null,
    });
    await clearSelectedRowKeys();
    await getSourceData(requestDataForSearch);
  }; // 删除已选数据

  const confirmDelete = async () => {
    if (jsonOptionsForDelete.jsonMode) {
      try {
        requestDataForDelete.fields = JSON.parse(jsonOptionsForDelete.jsonData);
        jsonOptionsForDelete.jsonMode = !jsonOptionsForDelete.jsonMode;
      } catch (identifier: any) {
        message.error(identifier.toString());
        return;
      }
    }
    await sendDeleteRequest(requestDataForDelete);
    await getSourceData(requestDataForSearch);
  }; // 发起条件删除请求

  // 订阅服务相关
  const serviceFiltr = ref<string>();
  const subscribeData = ref<Array<{ id: number; name: string; note: string }>>([]);
  const listener = ref<Bot>();
  const listenerSubscribe = ref<Array<number>>([]);
  const visibleSubscribeModal = ref(false);
  const showModalForSubscribe = (bot: Bot) => {
    listener.value = bot;
    listenerSubscribe.value.slice(0, listenerSubscribe.value.length);
    if (bot.subscribe) {
      for (const s in bot.subscribe) {
        listenerSubscribe.value.push(bot.subscribe[s].id);
      }
    }
    visibleSubscribeModal.value = !visibleSubscribeModal.value;
  }; // 展示订阅框开关函数

  const addSubscribe = async (
    service: { id: number; name: string; note: string },
    filtr: boolean,
  ) => {
    try {
      const ret = await createSubscribeApi({
        listener: listener.value!.id,
        podcaster: service.id,
        filtr: filtr,
      });

      if (listener.value?.subscribe == null) {
        listener.value!.subscribe = [];
      }
      listener.value?.subscribe.push({
        id: service.id,
        name: service.name,
        note: service.note,
        filtr: filtr,
      });
      listenerSubscribe.value.push(service.id);
      message.success(ret.message);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  };

  const delSubscribe = async (id: number) => {
    try {
      const ret = await deleteSubscribeApi({
        offset: 0,
        limit: 1,
        order: null,
        order_field: null,
        fields: [
          { key: SubscribeColumns.PODCASTER, operator: Operator.EQ, value: id },
          { key: SubscribeColumns.LISTENER, operator: Operator.EQ, value: listener.value!.id },
        ],
      });

      listener.value!.subscribe = listener.value!.subscribe.filter((obj) => obj.id != id);
      listenerSubscribe.value.splice(listenerSubscribe.value.indexOf(id), 1);
      message.success(ret.message);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  };

  const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [
    registerTable,
    { setTableData, setPagination, setLoading, clearSelectedRowKeys, getSelectRows },
  ] = useTable({
    // title: '数据展示',
    columns: columns,
    dataSource: [],
    canResize: false,
    striped: false,
    bordered: false,
    showTableSetting: true,
    pagination: {
      pageSize: 20,
      pageSizeOptions: ['20', '40', '60', '80', '100'],
    },
    showIndexColumn: false,
    onChange: tableChangeHandle,
    tableSetting: {
      redo: false,
    },
  });

  onMounted(async () => {
    await getSourceData(requestDataForSearch);
    try {
      const ret = await getSubscribeApi();
      if (ret.data) {
        subscribeData.value = ret.data;
      }
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  });

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);
</script>
