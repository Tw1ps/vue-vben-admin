<template>
  <PageWrapper contentFullHeight :title="t('st.page.license')" :content="t('st.pageIntro.license')">
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
          <CollapsePanel
            key="2"
            :header="t('st.base.tool') + t('st.base.bar')"
            v-if="userInfo.rank <= 10"
          >
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
              <Tag color="red" v-if="!text">False</Tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <Space>
                <a
                  @click="
                    () => {
                      requestDataForUpdate.fields.splice(0, requestDataForUpdate.fields.length, {
                        uuid: uuid4(),
                        key: LicenseColumns.ID,
                        operator: Operator.EQ,
                        value: record.id,
                      });
                      showModalForUpdate();
                    }
                  "
                  v-if="userInfo.rank <= record.rank && userInfo.rank <= 10"
                  ><FormOutlined />{{ t('st.base.update') }}</a
                >
                <Popconfirm
                  title="确定删除吗？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteOne(record)"
                >
                  <a v-if="userInfo.rank <= record.rank && userInfo.rank <= 10"
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
          <FormItem :label="t('st.columns.authorized')" v-bind="validateInfos.authorized">
            <Input
              v-model:value="createData.authorized"
              :maxlength="63"
              placeholder="请输入授权对象"
            />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="createData.active" />
          </FormItem>
          <FormItem :label="t('st.columns.rank')">
            <InputNumber id="inputNumber" v-model:value="createData.rank" :min="0" />
          </FormItem>
          <FormItem :label="t('st.columns.max_members')">
            <InputNumber
              id="inputNumber"
              v-model:value="createData.max_members"
              :min="1"
              :max="31"
            />
          </FormItem>
          <FormItem :label="t('st.columns.validity')">
            <DatePicker
              v-model:value="createData.validity"
              valueFormat="YYYY-MM-DDTHH:mm:ss"
              show-time
            />
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
    InputNumber,
    DatePicker,
  } from 'ant-design-vue';
  import {
    SearchOutlined,
    RestOutlined,
    RetweetOutlined,
    DeleteOutlined,
    PlusSquareOutlined,
    FormOutlined,
    SendOutlined,
  } from '@ant-design/icons-vue';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';

  export default defineComponent({
    name: 'License',
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
      InputNumber,
      DatePicker,
    },
  });
</script>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { FieldList, SearchForm, UpdateFieldList } from '/@/components/FieldEditor';
  import { Search, Field, Operator } from '/@/api/st/model/base';
  import {
    License,
    LicenseColumns,
    LicenseColumnsArray,
    LicenseColumnsType,
    LicenseCreate,
    LicenseColumnsUpdate,
    LicenseColumnsUpdateArray,
  } from '/@/api/st/model/license';
  import {
    getLicenseApi,
    deleteLicenseApi,
    updateLicenseApi,
    createLicenseApi,
  } from '/@/api/st/license';
  import dayjs from 'dayjs';
  import { v4 as uuid4 } from 'uuid';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const columns: BasicColumn[] = [
    {
      title: t('st.columns.id'),
      dataIndex: 'id',
      width: 300,
      defaultHidden: true,
    },
    {
      title: t('st.columns.authorized'),
      dataIndex: 'authorized',
      align: 'left',
    },
    {
      title: t('st.columns.active'),
      dataIndex: 'active',
      width: 120,
    },
    {
      title: t('st.columns.rank'),
      dataIndex: 'rank',
      width: 120,
      sorter: true,
    },
    {
      title: t('st.columns.max_members'),
      dataIndex: 'max_members',
      width: 120,
      sorter: true,
    },
    {
      title: t('st.columns.validity'),
      dataIndex: 'validity',
      sorter: true,
    },
    {
      title: t('st.columns.created_date'),
      dataIndex: 'created_date',
      sorter: true,
    },
    {
      title: t('st.base.action'),
      dataIndex: 'action',
      fixed: 'right',
      width: 180,
    },
  ]; // 数据字段定义
  const columnsOptions = {
    columns: LicenseColumnsArray,
    columnsType: LicenseColumnsType,
  }; // 字段设置

  // 获取数据请求
  const getSourceData = async (v: Search<LicenseColumns>) => {
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
      const { data, total } = await getLicenseApi(v);
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
  let requestDataForUpdate: Search<LicenseColumns> = reactive({
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
  const updateFields = ref<Array<Field<LicenseColumnsUpdate>>>([]);
  const columnsOptionsForUpdate = {
    columns: LicenseColumnsUpdateArray,
    columnsType: LicenseColumnsType,
  }; // 字段设置

  const sendUpdateRequest = async (
    obj: Search<LicenseColumns>,
    values: Array<Field<LicenseColumnsUpdate>>,
  ) => {
    try {
      const ret = await updateLicenseApi({ keyword: obj, new_values: values });
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
    const srs: Array<License> = await getSelectRows();
    if (srs.length == 0) {
      return;
    }
    let tmpIDs = Array<string>();
    for (const v in srs) {
      tmpIDs.push(srs[v].id);
    }
    requestDataForUpdate.fields.splice(0, requestDataForUpdate.fields.length, {
      key: LicenseColumns.ID,
      operator: 'IN',
      value: tmpIDs,
    });
    showModalForUpdate();
  }; // 更新已选数据

  // 新增数据
  const useForm = Form.useForm;
  const createRules = reactive({
    authorized: [
      {
        required: true,
        message: '请输入授权对象',
      },
    ],
  });
  let createData = reactive<LicenseCreate>({
    authorized: undefined,
    active: false,
    rank: 1000,
    max_members: 1,
    validity: dayjs().add(30, 'day').format('YYYY-MM-DDTHH:mm:ss'),
  });
  const { resetFields, validate, validateInfos } = useForm(createData, createRules);
  const visibleCreateModal = ref<boolean>(false);
  const showModalForCreate = () => {
    visibleCreateModal.value = !visibleCreateModal.value;
  }; // 展示创建框开关函数

  const sendCreateRequest = async (obj: LicenseCreate) => {
    try {
      const ret = await createLicenseApi(obj);
      message.success(ret.message);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送创建请求

  const confirmCreate = async () => {
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

  // 搜索相关
  let requestDataForSearch: Search<LicenseColumns> = reactive({
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
  let requestDataForDelete: Search<LicenseColumns> = reactive({
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

  const sendDeleteRequest = async (obj: Search<LicenseColumns>) => {
    try {
      const ret = await deleteLicenseApi(obj);
      message.success(ret.message);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送删除请求

  const deleteOne = async (obj: License) => {
    await sendDeleteRequest({
      offset: 0,
      limit: 1,
      fields: [{ key: LicenseColumns.ID, operator: Operator.EQ, value: obj.id }],
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
    const srs: Array<License> = await getSelectRows();
    if (srs.length == 0) {
      return;
    }
    let tmpIDs = Array<string>();
    for (const v in srs) {
      tmpIDs.push(srs[v].id);
    }
    await sendDeleteRequest({
      offset: 0,
      limit: 1,
      fields: [{ key: LicenseColumns.ID, operator: 'IN', value: tmpIDs }],
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
  });

  onMounted(async () => {
    await getSourceData(requestDataForSearch);
  });

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);
</script>
