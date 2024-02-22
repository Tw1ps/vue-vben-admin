<template>
  <PageWrapper :title="'编号 ' + data.id + ' | ' + data.site" contentBackground headerSticky>
    <template #extra>
      <a-button @click="showModalForUpdate"> 修改 </a-button>

      <Popconfirm title="确定删除吗？" ok-text="Yes" cancel-text="No" @confirm="deleteOne">
        <a-button> 删除 </a-button>
      </Popconfirm>
    </template>

    <div class="pt-4 m-4 desc-wrap">
      <Card
        v-if="data.alert"
        :title="t('st.columns.alert') + t('st.columns.info')"
        :bordered="true"
      >
        <Descriptions :column="2">
          <Descriptions.Item :label="t('st.columns.alert')">
            {{ data.alert_msg }}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card :title="t('st.base.icp') + t('st.columns.info')" :bordered="true" class="mt-5">
        <Descriptions :column="3">
          <Descriptions.Item :label="t('st.columns.city')">
            {{ data.city }}
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.organizer')">
            {{ data.organizer }}
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.location')">
            {{ data.location }}
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.record')">
            {{ data.record }}
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.site')">
            {{ data.site }}
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.homepage')">
            {{ data.homepage }}
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.tag')">
            <div class="text-container">
              <Tag v-for="k in data.tag" :key="k">{{ k }}</Tag></div
            >
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.note')">
            {{ data.note }}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card :title="t('st.columns.site') + t('st.columns.info')" :bordered="true" class="mt-5">
        <Descriptions :column="2">
          <Descriptions.Item
            :label="t('st.columns.response') + t('st.columns.site') + t('st.columns.name')"
          >
            <p v-for="k in data.titles" :key="k"> {{ k }} ; </p>
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.ip')">
            {{ numberToIp(data.ip) }}
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.alive')">
            <Tag color="green" v-if="data.alive">{{ t('st.base.true') }}</Tag>
            <Tag color="red" v-if="!data.alive">{{ t('st.base.false') }}</Tag>
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.last_check')">
            {{ data.last_check }}
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.keyword')">
            <div class="text-container">
              <Tag v-for="k in data.keywords" :key="k">{{ k }}</Tag>
            </div>
          </Descriptions.Item>
          <Descriptions.Item :label="t('st.columns.auto_tag')">
            <div class="text-container">
              <Tag v-for="k in data.auto_tag" :key="k">{{ k }}</Tag>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card :bordered="false">
        <Collapse ghost>
          <CollapsePanel key="1" :header="t('st.columns.ext') + t('st.columns.info')">
            <Descriptions :column="4">
              <Descriptions.Item :label="t('st.columns.active')">
                <Tag color="green" v-if="data.active">{{ t('st.base.true') }}</Tag>
                <Tag color="red" v-if="!data.active">{{ t('st.base.false') }}</Tag>
              </Descriptions.Item>
              <Descriptions.Item :label="t('st.columns.created_time')">
                {{ data.created_time }}
              </Descriptions.Item>
              <Descriptions.Item :label="t('st.columns.created_user')">
                {{ data.created_user }}
              </Descriptions.Item>
              <Descriptions.Item :label="t('st.columns.created_username')">
                {{ data.created_username }}
              </Descriptions.Item>
              <Descriptions.Item :label="t('st.columns.executed_node')">
                {{ data.executed_node }}
              </Descriptions.Item>
            </Descriptions>
          </CollapsePanel>
          <CollapsePanel key="2" :header="t('st.columns.response_body')">
            <Card
              :title="t('st.columns.response_body') + t('st.enum.text') + ': ' + idx"
              :bordered="true"
              v-for="(k, idx) in data.response_body"
              :key="k"
            >
              <p> {{ k }}</p>
            </Card>
          </CollapsePanel>
        </Collapse>
      </Card>

      <Card
        :title="t('st.columns.site') + t('st.columns.screenshot')"
        :bordered="true"
        class="mt-5"
      >
        <ImagePreviewGroup>
          <Image
            :width="500"
            v-for="k in data.screenshot"
            :key="k"
            :src="'http://192.168.2.238:9000/d14faebb691947929d762e5abf4a4087/' + k"
          />
        </ImagePreviewGroup>
      </Card>
    </div>

    <Modal
      v-model:visible="visibleUpdateModal"
      class="w-auto h-auto"
      @ok="confirmUpdate"
      :title="t('st.base.update')"
      :footer="null"
    >
      <Card :bordered="false" size="small">
        <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <FormItem
            :label="t('st.columns.organizer') + t('st.columns.name')"
            v-bind="validateInfos.organizer"
          >
            <Input
              :maxlength="127"
              v-model:value="updateData.organizer"
              :placeholder="data.organizer"
            />
          </FormItem>
          <FormItem
            :label="t('st.columns.organizer') + t('st.columns.city')"
            v-bind="validateInfos.city"
          >
            <Input :maxlength="31" v-model:value="updateData.city" :placeholder="data.city" />
          </FormItem>
          <FormItem :label="t('st.columns.organizer') + t('st.columns.location')">
            <Input
              :maxlength="255"
              v-model:value="updateData.location"
              :placeholder="data.location"
            />
          </FormItem>
          <FormItem :label="t('st.columns.record')">
            <Input :maxlength="63" v-model:value="updateData.record" :placeholder="data.record" />
          </FormItem>
          <FormItem :label="t('st.columns.site') + t('st.columns.name')">
            <Input :maxlength="127" v-model:value="updateData.site" :placeholder="data.site" />
          </FormItem>
          <FormItem :label="t('st.columns.homepage')">
            <Input v-model:value="updateData.homepage" :placeholder="data.homepage" />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="updateData.active" :default="data.active" />
          </FormItem>
          <FormItem :label="t('st.columns.alive')">
            <Switch v-model:checked="updateData.alive" :default="data.alive" />
          </FormItem>
          <FormItem :label="t('st.columns.tag')">
            <Select mode="tags" v-model:value="updateData.tag" :placeholder="data.tag" />
          </FormItem>
          <FormItem :label="t('st.columns.note')">
            <Input v-model:value="updateData.note" :placeholder="data.note" />
          </FormItem>
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Space>
              <a-button type="primary" @click.prevent="confirmUpdate">{{
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
  import { deleteHostApi, getHostDetailApi, updateHostApi } from '@/api/st/host';
  import { Operator, Search, Field } from '@/api/st/model/base';
  import { Host, HostColumns, HostColumnsUpdate } from '@/api/st/model/host';
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
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
    Switch,
    Tag,
    message,
    Descriptions,
    ImagePreviewGroup,
    Image,
    Space,
  } from 'ant-design-vue';
  import { computed, defineComponent, onMounted, reactive, ref, unref, Ref } from 'vue';
  import { useTabs } from '@/hooks/web/useTabs';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'HostDetail',
    components: {
      PageWrapper,
      Card,
      Collapse,
      CollapsePanel,
      Popconfirm,
      Modal,
      Form,
      FormItem,
      Input,
      Tag,
      Switch,
      Select,
      ImagePreviewGroup,
      Image,
      Space,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const { setTitle, closeCurrent } = useTabs();

  const { currentRoute } = useRouter();

  const computedParams = computed(() => unref(currentRoute).params);

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

  let data: Ref<Host> = ref({});

  // 获取数据请求
  const getSourceData = async (v: number | string | Array<any>) => {
    try {
      data.value = await getHostDetailApi(v);
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };

  // 删除相关
  const sendDeleteRequest = async (obj: Search<HostColumns>) => {
    try {
      await deleteHostApi(obj);
      // message.success(ret.msg);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送删除请求

  const deleteOne = async () => {
    await sendDeleteRequest({
      offset: 0,
      limit: 1,
      fields: [{ key: HostColumns.ID, op: Operator.EQ, value: computedParams.value.id }],
      order_field: null,
      order: null,
    });
    closeCurrent();
  }; // 按ID删除单个数据

  // 修改相关
  const useForm = Form.useForm;
  let updateData = reactive({
    organizer: undefined,
    city: undefined,
    location: undefined,
    record: undefined,
    site: undefined,
    homepage: undefined,
    active: undefined,
    alive: undefined,
    tag: undefined,
    note: undefined,
  });

  const { resetFields, validate, validateInfos } = useForm(updateData);
  const visibleUpdateModal = ref<boolean>(false);
  const showModalForUpdate = () => {
    updateData.active = data.value.active;
    updateData.alive = data.value.alive;
    updateData.tag = data.value.tag;
    visibleUpdateModal.value = !visibleUpdateModal.value;
  }; // 展示创建框开关函数

  const sendUpdateRequest = async (obj: {
    keyword: Search<HostColumns>;
    values: Array<Field<HostColumnsUpdate>>;
  }) => {
    try {
      await updateHostApi(obj);
      // message.success(ret.msg);
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    }
  }; // 发送创建请求

  const transformData = () => {
    // 使用Object.entries()方法获取对象的键值对数组，并利用reduce()方法进行筛选和生成新对象
    console.log(updateData);

    const filteredData: Array<{ key: string; value: any }> = Object.entries(updateData).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          if (value === 'null') {
            if (
              key !== HostColumns.ALERT &&
              key !== HostColumns.ALIVE &&
              key !== HostColumns.CITY &&
              key !== HostColumns.ORGANIZER
            ) {
              acc.push({ key: key, value: null });
            } else {
              message.warning(
                t('st.columns.' + key) + t('st.base.not_allow') + t('st.op.eq') + value.toString(),
              );
            }
          } else {
            acc.push({ key: key, value: value }); // 将包含 key 和 value 属性的对象推入数组
          }
        }
        return acc;
      },
      [],
    );

    console.log(filteredData);

    return filteredData;
  };

  const confirmUpdate = async () => {
    validate()
      .then(async () => {
        const filteredData = transformData();

        const searchData: Search<HostColumns> = {
          offset: 0,
          limit: 1,
          order: null,
          order_field: null,
          fields: [{ key: HostColumns.ID, op: Operator.EQ, value: computedParams.value.id }],
        };
        const requestDataForUpdate = {
          keyword: searchData,
          values: filteredData,
        };

        await sendUpdateRequest(requestDataForUpdate);
        await getSourceData(computedParams.value.id);
        showModalForUpdate();
      })
      .catch((identifier) => {
        console.log('error', identifier);
        message.error('wrong');
      });
  }; // 发起创建请求

  onMounted(async () => {
    await getSourceData(computedParams.value.id);
    setTitle('编号' + computedParams.value.id + ' | ' + data.value.site);
  });
</script>
<style>
  .text-container {
    word-wrap: break-word;
  }
</style>
