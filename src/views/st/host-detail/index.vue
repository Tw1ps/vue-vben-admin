<template>
  <PageWrapper :title="'编号 ' + data.id + ' | ' + data.site" contentBackground headerSticky>
    <template #extra>
      <Button @click="showModalForUpdate(data.id)"> {{ t('st.base.edit') }} </Button>

      <Popconfirm title="确定删除吗？" ok-text="Yes" cancel-text="No" @confirm="deleteOne">
        <Button> {{ t('st.base.delete') }} </Button>
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
        <ImagePreviewGroup v-if="globSetting.ossUrl">
          <Image :width="500" v-for="k in data.screenshot" :key="k" :src="globSetting.ossUrl + k" />
        </ImagePreviewGroup>
      </Card>
    </div>

    <HostDetailUpdateModal />
  </PageWrapper>
</template>
<script lang="ts">
  import { deleteHostApi } from '@/api/st/host';
  import { Operator, Search } from '@/api/st/model/base';
  import { HostColumns } from '@/api/st/model/host';
  import { PageWrapper } from '@/components/Page';
  import { useGlobSetting } from '@/hooks/setting';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    Card,
    Collapse,
    CollapsePanel,
    Popconfirm,
    Tag,
    message,
    Descriptions,
    ImagePreviewGroup,
    Image,
    Button,
  } from 'ant-design-vue';
  import { computed, defineComponent, onMounted, unref } from 'vue';
  import { useTabs } from '@/hooks/web/useTabs';
  import { useRouter } from 'vue-router';

  import { HostDetailUpdateModal, data, showModalForUpdate, getSourceData } from './edit';

  export default defineComponent({
    name: 'HostDetail',
    components: {
      PageWrapper,
      Card,
      Collapse,
      CollapsePanel,
      Popconfirm,
      Tag,
      ImagePreviewGroup,
      Image,
      HostDetailUpdateModal,
      Button,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
  const globSetting = useGlobSetting();

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
