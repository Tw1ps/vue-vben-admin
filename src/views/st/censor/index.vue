<template>
  <PageWrapper contentFullHeight :title="t('st.page.censor')" :content="t('st.pageIntro.censor')">
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
                <a @click="changeMode"><RetweetOutlined />{{ t('st.base.change_mode') }}</a>
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
                <Dropdown :trigger="['click']">
                  <a class="ant-dropdown-link" @click.prevent>
                    <CommentOutlined />{{ t('st.base.pull') + t('st.base.selected') }}
                  </a>
                  <template #overlay>
                    <Menu>
                      <MenuItem :key="WatchRecord.RECORD">
                        <a @click="pullSelected(WatchRecord.RECORD)"
                          >{{ t('st.enum.record') }}+{{ t('st.base.pull') }}</a
                        >
                      </MenuItem>
                      <MenuItem :key="WatchRecord.ONLY_PULL">
                        <a @click="pullSelected(WatchRecord.ONLY_PULL)">{{
                          t('st.enum.only_pull')
                        }}</a>
                      </MenuItem>
                      <MenuItem :key="WatchRecord.ONLY_RECORD">
                        <a @click="pullSelected(WatchRecord.ONLY_RECORD)">{{
                          t('st.enum.only_record')
                        }}</a>
                      </MenuItem>
                    </Menu>
                  </template>
                </Dropdown>
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
            <template v-if="column.key === 'id'"> {{ record.id }} </template>
            <!-- <template v-else-if="column.key === 'pic_urls'">
              <TableImg :size="60" :simpleShow="true" :imgList="text" />
            </template> -->
            <template v-else-if="column.key === 'category'">
              {{ record.category }}
            </template>
            <template v-else-if="column.key === 'keyword'">
              <Tooltip placement="bottom">
                <template v-if="text.length > 2" #title>
                  <span
                    ><Tag class="p-1" :color="getRandomColor()" :key="k" v-for="k in text">{{
                      k
                    }}</Tag></span
                  >
                </template>
                <Tag :color="getRandomColor()" :key="k" v-for="k in text.slice(0, 2)">{{ k }}</Tag
                ><span class="p-2" v-if="text.length > 2"> ... {{ text.length - 2 }} </span>
              </Tooltip>
            </template>
            <template v-else-if="column.key === 'info'">
              <Tag :color="getRandomColor()" v-if="text?.user"
                >{{ t('st.info.user') }}: {{ text!.user }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="text?.amount"
                >{{ t('st.info.amount') }}(?): {{ text!.amount }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="text?.gid"
                >{{ t('st.info.gid') }}: {{ text!.gid }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="text?.origin"
                >{{ t('st.info.origin') }}: {{ text!.origin }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="text?.trading"
                >{{ t('st.info.trading') }}: {{ text!.trading }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="text?.quick_ratio"
                >{{ t('st.info.quick_ratio') }}: {{ text!.quick_ratio }}</Tag
              >
            </template>
            <template v-else-if="column.key === 'action'">
              <Space>
                <a @click="showDetail(record)"><ProfileOutlined />{{ t('st.base.detail') }}</a>
                <Dropdown :trigger="['click']">
                  <a class="ant-dropdown-link" @click.prevent>
                    <CommentOutlined />{{ t('st.base.pull') }}
                  </a>
                  <template #overlay>
                    <Menu>
                      <MenuItem :key="WatchRecord.RECORD">
                        <a @click="pullCensor(record, WatchRecord.RECORD)"
                          >{{ t('st.enum.record') }}+{{ t('st.base.pull') }}</a
                        >
                      </MenuItem>
                      <MenuItem :key="WatchRecord.ONLY_PULL">
                        <a @click="pullCensor(record, WatchRecord.ONLY_PULL)">{{
                          t('st.enum.only_pull')
                        }}</a>
                      </MenuItem>
                      <MenuItem :key="WatchRecord.ONLY_RECORD">
                        <a @click="pullCensor(record, WatchRecord.ONLY_RECORD)">{{
                          t('st.enum.only_record')
                        }}</a>
                      </MenuItem>
                    </Menu>
                  </template>
                </Dropdown>
                <Popconfirm
                  title="确定删除吗？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteOne(record)"
                >
                  <a><DeleteOutlined />{{ t('st.base.delete') }}</a>
                </Popconfirm>
              </Space>
            </template>
          </template>
        </BasicTable>
      </Card>
      <Card :title="t('st.base.usage')" :bordered="false">使用说明</Card>
    </div>
    <Modal v-model:visible="visibleDetail" class="w-auto h-auto">
      <Card size="small" :bordered="false" class="w-auto h-auto" v-if="!visibleDetailJson">
        <Descriptions class="p-6" :title="DetailData!.title" :column="1">
          <DescriptionsItem :label="t('st.columns.id')">{{ DetailData!.id }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.title')">{{
            DetailData!.title
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.url')">{{ DetailData!.url }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.unique_hash')">{{
            DetailData!.unique_hash
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.category')">{{
            DetailData!.category
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.source')">{{
            DetailData!.source
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.date')">{{ DetailData!.date }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.created_date')">{{
            DetailData!.created_date
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.info')" v-if="DetailData!.info">
            <Card size="small" :bordered="false">
              <Tag :color="getRandomColor()" v-if="DetailData!.info?.user"
                >{{ t('st.info.user') }}: {{ DetailData!.info!.user }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="DetailData!.info?.amount"
                >{{ t('st.info.amount') }}(?): {{ DetailData!.info!.amount }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="DetailData!.info?.gid"
                >{{ t('st.info.gid') }}: {{ DetailData!.info!.gid }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="DetailData!.info?.origin"
                >{{ t('st.info.origin') }}: {{ DetailData!.info!.origin }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="DetailData!.info?.trading"
                >{{ t('st.info.trading') }}: {{ DetailData!.info!.trading }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="DetailData!.info?.quick_ratio"
                >{{ t('st.info.quick_ratio') }}: {{ DetailData!.info!.quick_ratio }}</Tag
              >
            </Card>
          </DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.keyword')" v-if="DetailData!.keyword?.length"
            ><Card size="small" :bordered="false">
              <Tag
                class="p-1"
                :color="getRandomColor()"
                :key="k"
                v-for="k in DetailData!.keyword"
                >{{ k }}</Tag
              ></Card
            >
          </DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.pic_urls')" v-if="DetailData!.pic_urls?.length"
            ><Card size="small" :bordered="false">
              <TableImg :size="200" class="w-full" :imgList="DetailData!.pic_urls" />
            </Card>
          </DescriptionsItem>
        </Descriptions>
        <CodeEditor v-model:value="DetailData!.intro" :readonly="true" :mode="MODE.HTML" />
      </Card>
      <CodeEditor
        class="!my-4"
        v-model:value="DetailData"
        :readonly="true"
        :mode="MODE.JSON"
        v-if="visibleDetailJson"
      />
      <template #footer>
        <Button
          type="primary"
          @click="visibleDetailJson = !visibleDetailJson"
          v-if="!visibleDetailJson"
          >JSON</Button
        >
        <Button
          type="primary"
          @click="visibleDetailJson = !visibleDetailJson"
          v-if="visibleDetailJson"
          >VIEW</Button
        >
      </template>
    </Modal>
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
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, reactive } from 'vue';
  import { BasicTable, BasicColumn, useTable, TableImg } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import {
    Tag,
    Card,
    Tooltip,
    Collapse,
    CollapsePanel,
    Space,
    Popconfirm,
    Modal,
    Descriptions,
    DescriptionsItem,
    Button,
    Dropdown,
    Menu,
    MenuItem,
  } from 'ant-design-vue';
  import {
    SearchOutlined,
    RestOutlined,
    RetweetOutlined,
    ProfileOutlined,
    DeleteOutlined,
    CommentOutlined,
  } from '@ant-design/icons-vue';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { WatchRecord } from '/@/api/st/model/watch';

  export default defineComponent({
    name: 'Censor',
    components: {
      BasicTable,
      Tag,
      PageWrapper,
      Card,
      Tooltip,
      Collapse,
      CollapsePanel,
      Space,
      Popconfirm,
      CodeEditor,
      Modal,
      Descriptions,
      DescriptionsItem,
      TableImg,
      Button,
      Dropdown,
      Menu,
      MenuItem,
      SearchForm,
    },
  });
</script>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { FieldList, SearchForm } from '/@/components/FieldEditor';
  import { Search, Field, Operator } from '/@/api/st/model/base';
  import {
    Censor,
    CensorColumns,
    CensorColumnsArray,
    CensorColumnsType,
  } from '/@/api/st/model/censor';
  import { getCensorApi, sendCensorApi, deleteCensorApi } from '/@/api/st/censor';
  import { v4 as uuid4 } from 'uuid';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const columns: BasicColumn[] = [
    {
      title: t('st.columns.id'),
      dataIndex: 'id',
      width: 80,
      sorter: true,
    },
    {
      title: t('st.columns.url'),
      dataIndex: 'url',
      width: 400,
      align: 'left',
    },
    {
      title: t('st.columns.unique_hash'),
      dataIndex: 'unique_hash',
      defaultHidden: true,
      width: 300,
    },
    {
      title: t('st.columns.title'),
      dataIndex: 'title',
      width: 400,
      align: 'left',
    },
    {
      title: t('st.columns.intro'),
      dataIndex: 'intro',
      width: 300,
      align: 'left',
    },
    {
      title: t('st.columns.date'),
      dataIndex: 'date',
      sorter: true,
    },
    {
      title: t('st.columns.keyword'),
      dataIndex: 'keyword',
      width: 200,
    },
    {
      title: t('st.columns.created_date'),
      dataIndex: 'created_date',
      sorter: true,
    },
    {
      title: t('st.columns.info'),
      dataIndex: 'info',
      width: 400,
    },
    {
      title: t('st.columns.category'),
      dataIndex: 'category',
      defaultHidden: true,
    },
    {
      title: t('st.columns.source'),
      dataIndex: 'source',
    },
    {
      title: t('st.columns.watch_id'),
      dataIndex: 'watch_id',
      defaultHidden: true,
    },
    {
      title: t('st.columns.user_id'),
      dataIndex: 'user_id',
      defaultHidden: true,
    },
    {
      title: t('st.base.action'),
      dataIndex: 'action',
      fixed: 'right',
      width: 180,
    },
    // {
    //   title: t('st.columns.pic_urls'),
    //   dataIndex: 'pic_urls',
    // },
  ]; // 数据字段定义
  const columnsOptions = {
    columns: CensorColumnsArray,
    columnsType: CensorColumnsType,
  }; // 字段设置
  const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple']; // 用于tab的颜色选取

  // 数据展示相关
  const visibleDetail = ref<boolean>(false); // 展示详情开关
  const visibleDetailJson = ref<boolean>(false); // JSON开关
  const DetailData = ref<Censor>(); // 详情数据

  const showDetail = (obj: Censor) => {
    visibleDetail.value = !visibleDetail.value;
    DetailData.value = obj;
  }; // 展示详情开关函数

  // 获取数据请求
  const getSourceData = async (v: Search<CensorColumns>) => {
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
      const { data, total } = await getCensorApi(v);
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

  // 搜索相关
  let requestDataForSearch: Search<CensorColumns> = reactive({
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
  const changeMode = () => {
    jsonOptionsForSearch.jsonMode = !jsonOptionsForSearch.jsonMode;
    if (jsonOptionsForSearch.jsonMode) {
      jsonOptionsForSearch.jsonData = JSON.stringify(cleanOption(requestDataForSearch.fields!));
    } else if (!jsonOptionsForSearch.jsonMode) {
      requestDataForSearch.fields = JSON.parse(jsonOptionsForSearch.jsonData);
      addOption(requestDataForSearch.fields!);
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
  let requestDataForDelete: Search<CensorColumns> = reactive({
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

  const sendDeleteRequest = async (obj: Search<CensorColumns>) => {
    try {
      const ret = await deleteCensorApi(obj);
      message.success(ret.message);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送删除请求

  const deleteOne = async (obj: Censor) => {
    await sendDeleteRequest({
      offset: 0,
      limit: 1,
      fields: [{ key: CensorColumns.ID, operator: Operator.EQ, value: obj.id }],
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
    const srs: Array<Censor> = await getSelectRows();
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
      fields: [{ key: CensorColumns.ID, operator: 'IN', value: tmpIDs }],
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

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  }; // 随机获取颜色

  const pullCensor = async (obj: Censor, record: WatchRecord) => {
    try {
      const ret = await sendCensorApi({ id: obj.id, record: record });
      message.success(ret.message);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
    await getSourceData(requestDataForSearch);
  }; // 推送数据

  const pullSelected = async (record: WatchRecord) => {
    const srs: Array<Censor> = await getSelectRows();
    for (const v in srs) {
      try {
        const ret = await sendCensorApi({ id: srs[v].id, record: record });
        message.success(ret.message);
      } catch (identifier: any) {
        message.error(identifier.toString());
      }
    }
    await clearSelectedRowKeys();
    await getSourceData(requestDataForSearch);
  }; // 推送已选数据

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
</script>
