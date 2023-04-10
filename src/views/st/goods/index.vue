<template>
  <PageWrapper contentFullHeight :title="t('st.page.goods')" :content="t('st.pageIntro.goods')">
    <div class="!my-2 w-full">
      <Card size="small" :bordered="false">
        <Collapse ghost>
          <CollapsePanel key="1" :header="searchBarHeader">
            <FieldList :data="search.fields" :options="fieldOptions" v-if="!jsonOptions.jsonMode" />
            <CodeEditor
              v-model:value="jsonOptions.jsonData"
              :mode="modeValue"
              v-if="jsonOptions.jsonMode"
            />
            <Card size="small" class="!my-2 text-right" :bordered="false"
              ><Space>
                <a @click="changeMode"><RetweetOutlined />{{ t('st.base.change_mode') }}</a>
                <Popconfirm
                  title="确定重置搜索条件吗？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="reSetFields"
                >
                  <a><RestOutlined />{{ t('st.base.reset') }}</a>
                </Popconfirm>
                <a @click="doSearch()"><SearchOutlined />{{ t('st.base.search') }}</a>
              </Space></Card
            >
            <!-- <template #extra
              ><Space
                ><span :key="f.uuid" v-for="f in search.fields"
                  >{{ t('st.columns.' + f.key) }} {{ f.operator }} {{ f.value }}</span
                ></Space
              ></template
            > -->
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
            <template v-else-if="column.key === 'tag'">
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
              <a @click="showModal(record)"><ProfileOutlined />{{ t('st.base.detail') }}</a>
            </template>
          </template>
        </BasicTable>
      </Card>
    </div>
    <Modal v-model:visible="visible" class="w-auto h-auto">
      <Card size="small" :bordered="false" class="w-auto h-auto" v-if="!visibleSource">
        <Descriptions class="p-6" :title="showModalField!.title" :column="1">
          <DescriptionsItem :label="t('st.columns.title')">{{
            showModalField!.title
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.url')">{{
            showModalField!.url
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.unique_hash')">{{
            showModalField!.unique_hash
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.category')">{{
            showModalField!.category
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.source')">{{
            showModalField!.source
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.date')">{{
            showModalField!.date
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.created_date')">{{
            showModalField!.created_date
          }}</DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.info')" v-if="showModalField!.info">
            <Card size="small" :bordered="false">
              <Tag :color="getRandomColor()" v-if="showModalField!.info?.user"
                >{{ t('st.info.user') }}: {{ showModalField!.info!.user }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="showModalField!.info?.amount"
                >{{ t('st.info.amount') }}(?): {{ showModalField!.info!.amount }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="showModalField!.info?.gid"
                >{{ t('st.info.gid') }}: {{ showModalField!.info!.gid }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="showModalField!.info?.origin"
                >{{ t('st.info.origin') }}: {{ showModalField!.info!.origin }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="showModalField!.info?.trading"
                >{{ t('st.info.trading') }}: {{ showModalField!.info!.trading }}</Tag
              >
              <Tag :color="getRandomColor()" v-if="showModalField!.info?.quick_ratio"
                >{{ t('st.info.quick_ratio') }}: {{ showModalField!.info!.quick_ratio }}</Tag
              >
            </Card>
          </DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.keyword')" v-if="showModalField!.keyword?.length"
            ><Card size="small" :bordered="false">
              <Tag
                class="p-1"
                :color="getRandomColor()"
                :key="k"
                v-for="k in showModalField!.keyword"
                >{{ k }}</Tag
              ></Card
            >
          </DescriptionsItem>
          <DescriptionsItem :label="t('st.columns.tag')" v-if="showModalField!.tag?.length"
            ><Card size="small" :bordered="false">
              <Tag
                class="p-1"
                :color="getRandomColor()"
                :key="k"
                v-for="k in showModalField!.tag"
                >{{ k }}</Tag
              ></Card
            >
          </DescriptionsItem>
          <DescriptionsItem
            :label="t('st.columns.pic_urls')"
            v-if="showModalField!.pic_urls?.length"
            ><Card size="small" :bordered="false">
              <TableImg :size="200" class="w-full" :imgList="showModalField!.pic_urls" />
            </Card>
          </DescriptionsItem>
        </Descriptions>
        <CodeEditor v-model:value="showModalField!.detail" :readonly="true" :mode="MODE.HTML" />
      </Card>
      <CodeEditor
        class="!my-4"
        v-model:value="showModalField"
        :readonly="true"
        :mode="MODE.JSON"
        v-if="visibleSource"
      />
      <template #footer>
        <Button type="primary" @click="visibleSource = !visibleSource" v-if="!visibleSource"
          >JSON</Button
        >
        <Button type="primary" @click="visibleSource = !visibleSource" v-if="visibleSource"
          >VIEW</Button
        >
      </template>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, reactive } from 'vue';
  import {
    BasicTable,
    BasicColumn,
    PaginationProps,
    useTable,
    TableImg,
  } from '/@/components/Table';
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
  } from 'ant-design-vue';
  import {
    SearchOutlined,
    RestOutlined,
    RetweetOutlined,
    ProfileOutlined,
  } from '@ant-design/icons-vue';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';

  export default defineComponent({
    name: 'Goods',
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
    },
  });
</script>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { FieldList } from '/@/components/FieldEditor';
  import { Search, Field } from '/@/api/st/model/base';
  import { Goods, GoodsColumns, GoodsColumnsArray, GoodsColumnsType } from '/@/api/st/model/goods';
  import { getGoodsApi } from '/@/api/st/goods';
  import { v4 as uuid4 } from 'uuid';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
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
      title: t('st.columns.detail'),
      dataIndex: 'detail',
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
      title: t('st.columns.tag'),
      dataIndex: 'tag',
      width: 200,
    },
    {
      title: t('st.columns.created_date'),
      dataIndex: 'created_date',
      defaultHidden: true,
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
    },
    {
      title: t('st.columns.source'),
      dataIndex: 'source',
    },
    {
      title: t('st.base.action'),
      dataIndex: 'action',
      fixed: 'right',
      width: 120,
    },
    // {
    //   title: t('st.columns.pic_urls'),
    //   dataIndex: 'pic_urls',
    // },
  ];

  const visible = ref<boolean>(false);
  const visibleSource = ref<boolean>(false);
  const dataSource = ref<Array<any>>([]);
  const pagination = ref<PaginationProps>({
    pageSize: 20,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
  });
  const searchBarHeader = ref<string>(t('st.base.search_bar'));
  const fieldOptions = {
    columns: GoodsColumnsArray,
    columnsType: GoodsColumnsType,
  };
  const modeValue = ref<MODE>(MODE.JSON);
  let jsonOptions = reactive({
    jsonMode: false,
    jsonData: '[]',
  });

  let search: Search<GoodsColumns> = reactive({
    offset: 0,
    limit: 20,
    order: null,
    order_field: null,
    fields: [],
  });

  const showModalField = ref<Goods>();
  const showModal = (obj: Goods) => {
    visible.value = !visible.value;
    showModalField.value = obj;
  };

  const reSetFields = () => {
    jsonOptions.jsonData = '[]';
    search.fields.splice(0, search.fields.length);
  };

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const doSearch = async () => {
    search.offset = 0;
    await getGoodsData(search);
  };

  const getGoodsData = async (v: Search<GoodsColumns>) => {
    if (jsonOptions.jsonMode) {
      try {
        search.fields = JSON.parse(jsonOptions.jsonData);
        jsonOptions.jsonMode = !jsonOptions.jsonMode;
      } catch (identifier: any) {
        message.error(identifier.toString());
        return;
      }
    }
    setLoading(true);
    try {
      const ret = await getGoodsApi(v);
      const { data, total } = ret;
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

  const change = async (pagination, filters, sorter) => {
    console.log(pagination);
    console.log(filters);
    console.log(sorter);

    search.offset = (pagination.current - 1) * pagination.pageSize;
    search.limit = pagination.pageSize;
    search.order = sorter.order?.replace('end', '');
    search.order_field = sorter.field;

    await getGoodsData(search);
  };

  const changeMode = () => {
    jsonOptions.jsonMode = !jsonOptions.jsonMode;
    if (jsonOptions.jsonMode) {
      jsonOptions.jsonData = JSON.stringify(cleanOption(search.fields!));
    } else if (!jsonOptions.jsonMode) {
      search.fields = JSON.parse(jsonOptions.jsonData);
      addOption(search.fields!);
    }
  };

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

  const [registerTable, { setTableData, setPagination, setLoading }] = useTable({
    // title: '数据展示',
    columns: columns,
    dataSource: dataSource,
    canResize: false,
    striped: false,
    bordered: false,
    showTableSetting: true,
    pagination: pagination,
    showIndexColumn: false,
    onChange: change,
    tableSetting: {
      redo: false,
    },
  });

  onMounted(async () => {
    await getGoodsData(search);
  });
</script>
