<template>
  <PageWrapper>
    <!-- <PageWrapper contentFullHeight :title="t('st.page.host')" :content="t('st.pageIntro.host')"> -->
    <div class="!my-2 w-full">
      <Card size="small" :bordered="false">
        <Collapse v-model:activeKey="activeKey" ghost>
          <CollapsePanel key="1" :header="t('st.base.advanced_search_bar')">
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
          <CollapsePanel
            key="3"
            :header="t('st.base.quick') + t('st.base.search') + t('st.base.bar')"
          >
            <Card size="small" :bordered="false" title='模糊搜索请在搜索内容前后添加"%"'>
              <Space class="p-2">
                {{ t('st.columns.id') }}
                <InputSearch
                  v-model:value="quickSearchValue.value1"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.ID, quickSearchValue.value1)"
                />

                {{ t('st.columns.city') }}
                <InputSearch
                  v-model:value="quickSearchValue.value2"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.CITY, quickSearchValue.value2)"
                />

                {{ t('st.columns.organizer') }}
                <InputSearch
                  v-model:value="quickSearchValue.value3"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.ORGANIZER, quickSearchValue.value3)"
                />

                {{ t('st.columns.location') }}
                <InputSearch
                  v-model:value="quickSearchValue.value4"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.LOCATION, quickSearchValue.value4)"
                />
              </Space>
              <Space class="p-2">
                {{ t('st.columns.record') }}
                <InputSearch
                  v-model:value="quickSearchValue.value5"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.RECORD, quickSearchValue.value5)"
                />

                {{ t('st.base.icp') + t('st.columns.site') }}
                <InputSearch
                  v-model:value="quickSearchValue.value6"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.SITE, quickSearchValue.value6)"
                />

                {{ t('st.columns.response') + t('st.columns.site') }}
                <InputSearch
                  v-model:value="quickSearchValue.value7"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.TITLES, quickSearchValue.value7)"
                />

                {{ t('st.columns.homepage') }}
                <InputSearch
                  v-model:value="quickSearchValue.value8"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.HOMEPAGE, quickSearchValue.value8)"
                />
              </Space>
              <Space class="p-2">
                {{ t('st.columns.tag') }}
                <InputSearch
                  v-model:value="quickSearchValue.value9"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.TAG, quickSearchValue.value9)"
                />

                {{ t('st.columns.auto_tag') }}
                <InputSearch
                  v-model:value="quickSearchValue.value10"
                  placeholder="请输入搜索内容"
                  @search="onQuickSearch(HostColumns.AUTO_TAG, quickSearchValue.value10)"
                />
                <Button @click="onQuickSearchAlive" :icon="h(SearchOutlined)"
                  >仅展示存活条目</Button
                >
                <Button @click="onQuickSearchAlert" :icon="h(SearchOutlined)"
                  >仅展示告警条目</Button
                >
                <Button @click="onQuickSearchClear">展示全部数据</Button>
              </Space>
            </Card>
          </CollapsePanel>
        </Collapse>
      </Card>
      <Card class="!my-2">
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.key === 'action'">
              <Flex wrap="wrap" gap="small">
                <a @click="handleClickGo(record.id)"
                  ><ProfileOutlined />{{ t('st.base.detail') }}</a
                >
                <a @click="EditTag(record.id, record.tag)"
                  ><FormOutlined />{{ t('st.base.edit') + t('st.columns.tag') }}</a
                >
                <a @click="updateOne(record.id)" v-if="userInfo.rank <= 10"
                  ><FormOutlined />{{ t('st.base.edit') }}</a
                >
                <Popconfirm
                  title="确定删除吗？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteOne(record)"
                >
                  <a v-if="userInfo.rank <= 10"><DeleteOutlined />{{ t('st.base.delete') }}</a>
                </Popconfirm>
              </Flex>
            </template>
            <template v-if="column.key === 'ip'">
              {{ numberToIp(text) }}
            </template>
            <template v-if="column.key === 'alert_msg'">
              <div v-if="text">站点网页疑似被篡改</div>
            </template>
            <template v-if="column.key === 'active'">
              <Tag color="green" v-if="text">True</Tag>
              <Tag color="red" v-if="!text">False</Tag>
            </template>
            <template v-if="column.key === 'alive'">
              <Tag color="green" v-if="text">True</Tag>
              <Tag color="red" v-if="!text">False</Tag>
            </template>
            <template v-else-if="column.key === 'tag'">
              <Tooltip placement="bottom">
                <template v-if="text.length > 5" #title>
                  <span
                    ><Tag class="p-1" :color="getRandomColor()" :key="k" v-for="k in text">{{
                      k
                    }}</Tag></span
                  >
                </template>
                <Tag :color="getRandomColor()" :key="k" v-for="k in text.slice(0, 5)">{{ k }}</Tag
                ><span class="p-2" v-if="text.length > 5"> ... {{ text.length - 5 }} </span>
              </Tooltip>
            </template>
            <template v-else-if="column.key === 'titles'">
              <p :key="k" v-for="k in text">{{ k }}</p>
            </template>
            <template v-else-if="column.key === 'auto_tag'">
              <Tooltip placement="bottom">
                <template v-if="text.length > 5" #title>
                  <span
                    ><Tag class="p-1" :color="getRandomColor()" :key="k" v-for="k in text">{{
                      k
                    }}</Tag></span
                  >
                </template>
                <Tag :color="getRandomColor()" :key="k" v-for="k in text.slice(0, 15)">{{ k }}</Tag
                ><span class="p-2" v-if="text.length > 15"> ... {{ text.length - 15 }} </span>
              </Tooltip>
            </template>
            <template v-if="column.key === 'screenshot'">
              <div>
                <ImagePreview
                  v-for="k in text"
                  :key="k"
                  :imageList="['http://192.168.2.238:9000/d14faebb691947929d762e5abf4a4087/' + k]"
                />
              </div>
            </template>
          </template>
        </BasicTable>
      </Card>
      <!-- <Card :title="t('st.base.usage')" :bordered="false">使用说明 </Card> -->
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
      v-model:visible="visibleEditTagModal"
      @ok="sendUpdateRequestForTag"
      class="w-auto h-auto"
      title="编辑标签"
    >
      <Card size="small" :bordered="false">
        输入内容后请按下回车键以生成标签, 点击确定保存标签
        <Select
          v-model:value="newTags"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          placeholder="请输入标签并按下回车键以生成标签"
        />
      </Card>
    </Modal>
    <Modal
      v-model:visible="visibleUpdateModal"
      class="h-auto"
      width="1000px"
      @ok="confirmUpdate"
      title="按条件修改"
      :footer="null"
    >
      <div class="grid md:grid-cols-2 gap-4">
        <Card title="修改条件" size="small" :bordered="true">
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
        <Card title="修改字段" size="small" :bordered="true">
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
        <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <FormItem
            :label="t('st.columns.organizer') + t('st.columns.name')"
            v-bind="validateInfos.organizer"
          >
            <Input :maxlength="127" v-model:value="createData.organizer" />
          </FormItem>
          <FormItem
            :label="t('st.columns.organizer') + t('st.columns.city')"
            v-bind="validateInfos.city"
          >
            <Input :maxlength="31" v-model:value="createData.city" />
          </FormItem>
          <FormItem :label="t('st.columns.organizer') + t('st.columns.location')">
            <Input :maxlength="255" v-model:value="createData.location" />
          </FormItem>
          <FormItem :label="t('st.columns.record')">
            <Input :maxlength="63" v-model:value="createData.record" />
          </FormItem>
          <FormItem :label="t('st.columns.site') + t('st.columns.name')">
            <Input :maxlength="127" v-model:value="createData.site" />
          </FormItem>
          <FormItem :label="t('st.columns.homepage')">
            <Input v-model:value="createData.homepage" />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="createData.active" />
          </FormItem>
          <FormItem :label="t('st.columns.alive')">
            <Switch v-model:checked="createData.alive" />
          </FormItem>
          <FormItem :label="t('st.columns.tag')">
            <Select mode="tags" v-model:value="createData.tag" />
          </FormItem>
          <FormItem :label="t('st.columns.note')">
            <Input v-model:value="createData.note" />
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
  import { createHostApi, deleteHostApi, getHostApi, updateHostApi } from '@/api/st/host';
  import { Field, Operator, Search } from '@/api/st/model/base';
  import {
    Host,
    HostColumns,
    HostColumnsArray,
    HostColumnsType,
    HostColumnsUpdate,
    HostColumnsUpdateArray,
    HostCreate,
  } from '@/api/st/model/host';
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { FieldList, SearchForm, UpdateFieldList } from '@/components/FieldEditor';
  import { PageWrapper } from '@/components/Page';
  import { ImagePreview } from '@/components/Preview';
  import { BasicColumn, BasicTable, useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useUserStore } from '@/store/modules/user';
  import {
    DeleteOutlined,
    FormOutlined,
    PlusSquareOutlined,
    RestOutlined,
    RetweetOutlined,
    SearchOutlined,
    SendOutlined,
    ProfileOutlined,
  } from '@ant-design/icons-vue';
  import {
    Card,
    Collapse,
    CollapsePanel,
    Form,
    FormItem,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Switch,
    Tag,
    Tooltip,
    message,
    InputSearch,
    Button,
    Flex,
  } from 'ant-design-vue';
  import { v4 as uuid4 } from 'uuid';
  import { computed, defineComponent, onMounted, reactive, ref, h } from 'vue';
  import { useGo } from '@/hooks/web/usePage';

  export default defineComponent({
    name: 'Host',
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
      Form,
      FormItem,
      Input,
      Tag,
      Switch,
      Select,
      Tooltip,
      ImagePreview,
      InputSearch,
      Button,
      Flex,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
  const columns: BasicColumn[] = [
    {
      title: t('st.columns.id'),
      dataIndex: 'id',
      sorter: true,
      width: 120,
      defaultHidden: true,
    },
    {
      title: t('st.columns.organizer') + t('st.columns.city'),
      dataIndex: 'city',
      // align: 'left',
      width: 120,
    },
    {
      title: t('st.columns.record'),
      dataIndex: 'record',
      defaultHidden: true,
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.organizer') + t('st.columns.name'),
      dataIndex: 'organizer',
      align: 'left',
      width: 220,
    },
    {
      title: t('st.base.icp') + t('st.columns.site') + t('st.columns.name'),
      dataIndex: 'site',
      width: 220,
      align: 'left',
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.response') + t('st.columns.site') + t('st.columns.name'),
      dataIndex: 'titles',
      width: 220,
      align: 'left',
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.alive'),
      dataIndex: 'alive',
      width: 100,
      // sorter: true,
    },
    {
      title: t('st.columns.screenshot'),
      dataIndex: 'screenshot',
      width: 200,
    },
    {
      title: t('st.columns.tag'),
      dataIndex: 'tag',
      width: 220,
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.auto') + t('st.columns.tag'),
      dataIndex: 'auto_tag',
      width: 220,
      defaultHidden: true,
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.homepage'),
      dataIndex: 'homepage',
      width: 200,
      align: 'left',
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.active'),
      dataIndex: 'active',
      defaultHidden: true,
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.ip'),
      dataIndex: 'ip',
      defaultHidden: true,
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.note'),
      dataIndex: 'note',
      defaultHidden: true,
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.organizer') + t('st.columns.location'),
      dataIndex: 'location',
      align: 'left',
      width: 220,
      defaultHidden: true,
      // width: 120,
      // sorter: true,
    },
    {
      title: t('st.columns.alert_msg'),
      dataIndex: 'alert_msg',
      // defaultHidden: true,
      width: 200,
    },
    {
      title: t('st.columns.last_check'),
      dataIndex: 'last_check',
      // width: 120,
      sorter: true,
    },
    {
      title: t('st.columns.created_time'),
      dataIndex: 'created_time',
      // width: 120,
      sorter: true,
      defaultHidden: true,
    },
    {
      title: t('st.columns.created_user'),
      dataIndex: 'created_user',
      defaultHidden: true,
      // width: 120,
    },
    {
      title: t('st.columns.created_username'),
      dataIndex: 'created_username',
      defaultHidden: true,
      // width: 120,
    },
    {
      title: t('st.columns.license'),
      dataIndex: 'license',
      defaultHidden: true,
      width: 400,
    },
    {
      title: t('st.columns.response_body'),
      dataIndex: 'response_body',
      defaultHidden: true,
      width: 400,
    },
    {
      title: t('st.columns.keyword'),
      dataIndex: 'keywords',
      defaultHidden: true,
      width: 300,
    },
    {
      title: t('st.columns.alert'),
      dataIndex: 'alert',
      defaultHidden: true,
      width: 120,
    },
    {
      title: t('st.columns.executed_node'),
      dataIndex: 'executed_node',
      defaultHidden: true,
      width: 200,
    },
    {
      title: t('st.base.action'),
      dataIndex: 'action',
      fixed: 'right',
      width: 180,
    },
  ]; // 数据字段定义
  const columnsOptions = {
    columns: HostColumnsArray,
    columnsType: HostColumnsType,
  }; // 字段设置

  const activeKey = ref(['3']);

  const numberToIp = (number) => {
    if (!number) {
      return '';
    }

    const octet1 = (number >>> 24) & 255;
    const octet2 = (number >>> 16) & 255;
    const octet3 = (number >>> 8) & 255;
    const octet4 = number & 255;

    return `${octet1}.${octet2}.${octet3}.${octet4}`;
  };

  // 获取数据请求
  const getSourceData = async (v: Search<HostColumns>) => {
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
      console.log(v);
      const { data, total } = await getHostApi(v);
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
    requestDataForSearch.order = sorter.order?.replace('end', '').toUpperCase();
    requestDataForSearch.order_field = sorter.field;

    await getSourceData(requestDataForSearch);
  };

  // 更新数据
  const visibleUpdateModal = ref<boolean>(false);
  const showModalForUpdate = () => {
    visibleUpdateModal.value = !visibleUpdateModal.value;
  }; // 展示更新框开关函数
  let requestDataForUpdate: Search<HostColumns> = reactive({
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
  const updateFields = ref<Array<Field<HostColumnsUpdate>>>([]);
  const columnsOptionsForUpdate = {
    columns: HostColumnsUpdateArray,
    columnsType: HostColumnsType,
  }; // 字段设置

  const updateOne = (id: number) => {
    // clearUpdateCondition();
    requestDataForUpdate.fields.splice(0, requestDataForUpdate.fields.length, {
      uuid: uuid4(),
      key: HostColumns.ID,
      op: Operator.EQ,
      value: id,
    });
    showModalForUpdate();
  };

  const sendUpdateRequest = async (
    obj: Search<HostColumns>,
    values: Array<Field<HostColumnsUpdate>>,
  ) => {
    try {
      await updateHostApi({ keyword: obj, values: values });
      // message.success(ret.msg);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送更新请求

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
    const srs: Array<Host> = await getSelectRows();
    if (srs.length == 0) {
      return;
    }
    let tmpIDs = Array<number>();
    for (const v in srs) {
      tmpIDs.push(srs[v].id);
    }
    requestDataForUpdate.fields.splice(0, requestDataForUpdate.fields.length, {
      key: HostColumns.ID,
      op: 'IN',
      value: tmpIDs,
    });
    showModalForUpdate();
  }; // 更新已选数据

  // 新增数据
  const useForm = Form.useForm;
  const createRules = reactive({
    organizer: [
      {
        required: true,
        message: '请输入主办单位名称',
      },
    ],
    city: [
      {
        required: true,
        message: '请输入主办单位所在市',
      },
    ],
    homepage: [
      {
        required: true,
        message: '请输入首页网址',
      },
    ],
  });
  let createData = reactive<HostCreate>({
    organizer: undefined,
    city: undefined,
    location: undefined,
    record: undefined,
    site: undefined,
    homepage: undefined,
    ip: undefined,
    active: true,
    alive: true,
    tag: Array<string>(),
    note: undefined,
  });
  const { resetFields, validate, validateInfos } = useForm(createData, createRules);
  const visibleCreateModal = ref<boolean>(false);
  const showModalForCreate = () => {
    visibleCreateModal.value = !visibleCreateModal.value;
  }; // 展示创建框开关函数

  const sendCreateRequest = async (obj: HostCreate) => {
    try {
      await createHostApi(obj);
      // message.success(ret.msg);
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
  let requestDataForSearch: Search<HostColumns> = reactive({
    offset: 0,
    limit: 10,
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
    delete obj[0].blop;
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
  let requestDataForDelete: Search<HostColumns> = reactive({
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

  const sendDeleteRequest = async (obj: Search<HostColumns>) => {
    try {
      await deleteHostApi(obj);
      // message.success(ret.msg);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送删除请求

  const deleteOne = async (obj: Host) => {
    await sendDeleteRequest({
      offset: 0,
      limit: 1,
      fields: [{ key: HostColumns.ID, op: Operator.EQ, value: obj.id }],
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
    const srs: Array<Host> = await getSelectRows();
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
      fields: [{ key: HostColumns.ID, op: 'IN', value: tmpIDs }],
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

  // 编辑标签相关
  const visibleEditTagModal = ref<boolean>(false); // 展示编辑标签框开关

  const showModalForEditTag = () => {
    visibleEditTagModal.value = !visibleEditTagModal.value;
  }; // 展示更新框开关函数

  let requestDataForEditTag: Search<HostColumns> = reactive({
    offset: 0,
    limit: 1,
    order: null,
    order_field: null,
    fields: [],
  });
  let requestDataForNewTag: Field<HostColumns> = reactive([]);
  const newTags = ref([]);

  const EditTag = (id: number, tags: Array<string>) => {
    // clearUpdateCondition();
    requestDataForEditTag.fields = [
      {
        uuid: uuid4(),
        key: HostColumns.ID,
        op: Operator.EQ,
        value: id,
      },
    ];
    newTags.value = tags;
    showModalForEditTag();
  };

  const sendUpdateRequestForTag = async () => {
    requestDataForNewTag = [{ key: HostColumns.TAG, value: newTags.value }];
    await sendUpdateRequest(requestDataForEditTag, requestDataForNewTag);
    visibleEditTagModal.value = false;
    await getSourceData(requestDataForSearch);
    return;
  };

  const go = useGo();

  const handleClickGo = (hid: number) => {
    // const { name } = unref(currentRoute);
    go('/data/host/detail/' + hid.toString());
  };

  const onQuickSearch = async (key: string, value: string) => {
    console.log(key, value);

    if (!value) {
      return;
    }

    let op = '==';

    if (typeof value === 'string') {
      if (value.includes('%')) {
        op = 'like';
      }
    }

    requestDataForSearch.fields = [{ uuid: uuid4(), key: key, op: op, value: value }];
    await getSourceData(requestDataForSearch);

    return;
  };

  const onQuickSearchAlive = () => {
    return onQuickSearch(HostColumns.ALIVE, true);
  };

  const onQuickSearchAlert = () => {
    return onQuickSearch(HostColumns.ALERT, true);
  };

  const onQuickSearchClear = async () => {
    requestDataForSearch.fields = [];
    await getSourceData(requestDataForSearch);
  };

  const quickSearchValue = reactive({
    value1: undefined,
    value2: undefined,
    value3: undefined,
    value4: undefined,
    value5: undefined,
    value6: undefined,
    value7: undefined,
    value8: undefined,
    value9: undefined,
    value10: undefined,
  });

  const [
    registerTable,
    { setTableData, setPagination, setLoading, clearSelectedRowKeys, getSelectRows },
  ] = useTable({
    // title: '数据展示',
    columns: columns,
    dataSource: [],
    canResize: false,
    striped: false,
    bordered: true,
    showTableSetting: true,
    tableSetting: {
      redo: false,
    },
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
