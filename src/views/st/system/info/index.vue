<template>
  <PageWrapper contentFullHeight :title="t('st.page.status')">
    <div class="!my-2 w-full">
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
  </PageWrapper>
</template>
<script lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { message, Card } from 'ant-design-vue';
  import { defineComponent, onMounted, ref } from 'vue';

  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  import { getInfoApi, getThreadsApi, getProcessApi, getAsyncTaskApi } from '@/api/st/system';
  import { NodeInfo } from '@/api/st/model/system';

  import { StatusView } from '../../components/StatusView';

  export default defineComponent({
    name: 'SystemInfo',
    components: {
      PageWrapper,
      Card,
      VueJsonPretty,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const data = ref<Array<NodeInfo>>([]);
  const threadData = ref<Array<string>>([]);
  const processData = ref<Array<string>>([]);
  const asyncTaskData = ref<Array<string>>([]);
  const loading = ref<boolean>(false);

  // 获取数据请求
  const getSourceData = async (v: { start?: number; stop?: number; step?: number }) => {
    try {
      loading.value = true;
      const result = await getInfoApi(v);
      console.log(result);
      data.value = result.data;

      const result2 = await getThreadsApi();
      threadData.value = result2;
      const result3 = await getProcessApi();
      processData.value = result3;
      const result4 = await getAsyncTaskApi();
      asyncTaskData.value = result4;
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await getSourceData({ step: -1 });
  });
</script>
