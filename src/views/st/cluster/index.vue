<template>
  <PageWrapper contentFullHeight :title="t('st.page.cluster')">
    <div class="!my-2 w-full">
      <Card :loading="loading" :title="t('st.columns.node_list')" :border="false" mode="small">
        <template #extra>
          <Space>
            <div>
              {{ t('st.base.total') + ': ' + data.length }}
            </div>
            <div :key="idx" v-for="(tag, idx) in checkStatus(data)">
              {{ tag }}
            </div>
          </Space>
        </template>
        <div class="overflow-auto p-2 bg-slate-400">
          <Flex class="w-fit" v-if="data.length > 0" horizontal>
            <StatusView
              class="w-80 !m-2"
              :bordered="true"
              :simpleView="true"
              :data="retArray(dt)"
              :key="idx"
              :column="1"
              v-for="(dt, idx) in data"
            >
              <template #footer>
                <div class="!my-2 text-center">
                  <Button @click="handleClickGo(dt.cid)" type="primary" ghost>
                    {{ t('st.base.detail') }}
                  </Button></div
                >
              </template>
            </StatusView>
          </Flex>
        </div>
      </Card>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { message, Flex, Card, Space, Button } from 'ant-design-vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useGo } from '@/hooks/web/usePage';

  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import zhCn from 'dayjs/locale/zh-cn';
  import relativeTime from 'dayjs/plugin/relativeTime';

  import { getFullNodeApi } from '@/api/st/node';
  import { NodeInfo } from '@/api/st/model/system';

  import { StatusView } from '../components/StatusView';

  export default defineComponent({
    name: 'Nodes',
    components: {
      PageWrapper,
      StatusView,
      Flex,
      Card,
      Space,
      Button,
    },
  });
</script>
<script lang="ts" setup>
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
  dayjs.locale(zhCn);

  const { t } = useI18n();

  const data = ref<Array<NodeInfo>>([]);
  const loading = ref<boolean>(true);
  const currentTime = ref(dayjs()); // 当前时间

  const go = useGo();

  const handleClickGo = (hid: string) => {
    // const { name } = unref(currentRoute);
    go('/cluster/nodes/detail/' + hid);
  };

  const retArray = (v) => {
    let ret = Array<NodeInfo>();
    ret.push(v);
    return ret;
  };

  const checkStatus = (data: Array<NodeInfo>) => {
    let green = 0;
    let yellow = 0;
    let red = 0;

    data.forEach((dt) => {
      const diff = currentTime.value.diff(dt.heartbeat * 1000, 'second'); // 计算当前时间与时间戳之间的差值，以秒为单位
      if (diff < 60) {
        green += 1;
      } else if (diff < 120) {
        yellow += 1;
      } else {
        red += 1;
      }
    });

    let ret = Array<string>();
    ret.push(`${t('st.base.normal')}: ${green}`);
    ret.push(`${t('st.base.delay')}: ${yellow}`);
    ret.push(`${t('st.base.abnormal')}: ${red}`);
    return ret;
  };

  // 获取数据请求
  const getSourceData = async (v?: string) => {
    try {
      const result = await getFullNodeApi();
      console.log(result);
      data.value = result.data;
      loading.value = false;
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };

  onMounted(async () => {
    await getSourceData();
  });
</script>
