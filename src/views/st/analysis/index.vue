<template>
  <div class="grid lg:grid-cols-10 h-99% w-full sm:grid-cols-1">
    <div class="lg:col-span-7 p-4">
      <div class="grid lg:grid-cols-5 w-full lg:h-auto">
        <a-card :hoverable="true" size="small" class="lg:col-span-1"
          ><a-statistic title="数据总数" :value="total" class="text-center p-4" />
        </a-card>
        <a-card
          :hoverable="true"
          size="small"
          class="lg:col-span-4 w-full overflow-auto lg:h-40 sm:h-80 md:h-80"
        >
          <a-card :hoverable="false" class="w-full" :key="dt.id" v-for="dt in lastGoodsData">
            <a-descriptions size="small" :title="dt.url">
              <a-descriptions-item :label="t('st.columns.title')">{{
                dt.title
              }}</a-descriptions-item>
              <a-descriptions-item :label="t('st.columns.category')">{{
                dt.category
              }}</a-descriptions-item>
              <a-descriptions-item :label="t('st.columns.source')">{{
                dt.source
              }}</a-descriptions-item>
              <a-descriptions-item :label="t('st.columns.date')">{{ dt.date }}</a-descriptions-item>
              <a-descriptions-item :label="t('st.columns.info')" v-if="dt.info">
                <a-tag :color="getRandomColor()" v-if="dt.info?.user"
                  >{{ t('st.info.user') }}: {{ dt.info!.user }}</a-tag
                >
                <a-tag :color="getRandomColor()" v-if="dt.info?.amount"
                  >{{ t('st.info.amount') }}(?): {{ dt.info!.amount }}</a-tag
                >
                <a-tag :color="getRandomColor()" v-if="dt.info?.gid"
                  >{{ t('st.info.gid') }}: {{ dt.info!.gid }}</a-tag
                >
              </a-descriptions-item>
              <a-descriptions-item :label="t('st.columns.keyword')" v-if="dt.keyword?.length">
                <a-tooltip placement="bottom">
                  <template v-if="dt.keyword!.length > 4" #title>
                    <span
                      ><a-tag
                        class="p-1"
                        :color="getRandomColor()"
                        :key="k"
                        v-for="k in dt.keyword"
                        >{{ k }}</a-tag
                      ></span
                    >
                  </template>
                  <a-tag :color="getRandomColor()" :key="k" v-for="k in dt.keyword?.slice(0, 4)">{{
                    k
                  }}</a-tag
                  ><a-tag :color="getRandomColor()" v-if="dt.keyword!.length > 4">...</a-tag>
                </a-tooltip>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-card>
      </div>
      <LineView ref="line" class="!my-2 w-full lg:h-auto" />
      <ColumnView ref="column" class="!my-2 w-full lg:h-auto" />
    </div>
    <div class="lg:col-span-3 p-4">
      <TreemapView ref="pie" class="lg:h-19/50 w-full" />
      <BarView ref="bar" class="lg:h-auto w-full !my-2" />
    </div>
    <filter-outlined
      class="fixed bottom-25 right-5 rounded-full bg-gray-700 bg-opacity-50 p-3.5"
      style="color: aliceblue"
      @click="showModal"
    />
    <a-modal
      v-model:visible="visible"
      title="数据筛选"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
    >
      <SearchForm :data="search" :options="wcOptions" :json-options="jsonOptions" />
    </a-modal>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { FilterOutlined } from '@ant-design/icons-vue';
  import {
    Card,
    Modal,
    Statistic,
    Carousel,
    Descriptions,
    DescriptionsItem,
    Tag,
    Tooltip,
  } from 'ant-design-vue';

  export default defineComponent({
    name: 'Analysis',
    components: {
      [Card.name]: Card,
      [Modal.name]: Modal,
      [Statistic.name]: Statistic,
      [Carousel.name]: Carousel,
      [Descriptions.name]: Descriptions,
      [DescriptionsItem.name]: DescriptionsItem,
      [Tag.name]: Tag,
      [Tooltip.name]: Tooltip,
    },
  });
</script>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import ColumnView from './components/columnView.vue';
  import TreemapView from './components/treemapView.vue';
  import BarView from './components/barView.vue';
  import LineView from './components/lineView.vue';
  import dayjs from 'dayjs';
  import { v4 as uuid4 } from 'uuid';
  import { message } from 'ant-design-vue';

  import { Search, Operator, Order, Bop } from '/@/api/st/model/base';
  import { GoodsColumns, GoodsColumnsType, GoodsColumnsArray, Goods } from '/@/api/st/model/goods';
  import {
    getKeywordAnalysisApi,
    getDateAnalysisApi,
    getCategoryAnalysisApi,
  } from '/@/api/st/analysis';
  import { getGoodsApi } from '/@/api/st/goods';
  import { SearchForm } from '/@/components/FieldEditor';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const loading = ref<boolean>(true);
  const confirmLoading = ref<boolean>(false);

  let search: Search<GoodsColumns> = reactive({
    offset: 0,
    limit: -1,
    order: null,
    order_field: null,
    fields: [
      {
        uuid: uuid4(),
        key: GoodsColumns.DATE,
        operator: Operator.GE,
        value: dayjs().subtract(30, 'day').format('YYYY-MM-DDTHH:mm:ss'),
      },
    ],
  });

  let jsonOptions = reactive({
    jsonMode: false,
    jsonData: '[]',
  });

  const visible = ref<boolean>(false);
  const total = ref<number>(0);
  const lastGoodsData = ref<Array<Goods>>([]);
  const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];

  const showModal = () => {
    visible.value = true;
  };

  const getLastGoods = async () => {
    return await getGoodsApi({
      offset: 0,
      limit: 10,
      order: Order.DESC,
      order_field: GoodsColumns.CREATED_DATE,
      fields: [
        {
          key: GoodsColumns.CATEGORY,
          operator: Operator.NE,
          value: 'Not Safe For Work',
        },
        {
          bop: Bop.AND,
          key: GoodsColumns.CATEGORY,
          operator: Operator.NE,
          value: '影视音像',
        },
        {
          bop: Bop.AND,
          key: GoodsColumns.CATEGORY,
          operator: Operator.NE,
          value: '影视猎奇',
        },
      ],
    });
  };

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleOk = async () => {
    confirmLoading.value = true;
    if (jsonOptions.jsonMode) {
      try {
        search.fields = JSON.parse(jsonOptions.jsonData);
        jsonOptions.jsonMode = !jsonOptions.jsonMode;
      } catch (identifier: any) {
        message.error(identifier.toString());
        confirmLoading.value = false;
        return;
      }
    }

    try {
      // 关键词排行
      const result = await getKeywordAnalysisApi(search);
      if (result != null) {
        bar.value.updateView(result.data);
      }
      // 趋势图
      const result2 = await getDateAnalysisApi(search);
      if (result2) {
        line.value.updateView(result2.data);
      }
      // 分类统计
      const result3 = await getCategoryAnalysisApi(search);
      total.value = 0;
      if (result3.data) {
        let data = {};
        for (const dt in result3.data) {
          total.value += result3.data[dt].count;
          if (data[result3.data[dt].source] == undefined) {
            data[result3.data[dt].source] = [];
            data[result3.data[dt].source].push({
              name: result3.data[dt].category,
              value: result3.data[dt].count,
            });
          } else {
            data[result3.data[dt].source].push({
              name: result3.data[dt].category,
              value: result3.data[dt].count,
            });
          }
        }
        let res: { name: string; children: Array<any> } = {
          name: 'root',
          children: [],
        };
        for (const k in data) {
          res.children.push({ name: k, children: data[k] });
        }
        pie.value.updateView(res);
        column.value.updateView(result3.data);
      }
    } catch (identifier: any) {
      message.error(identifier.toString());
      return;
    } finally {
      confirmLoading.value = false;
    }
    visible.value = false;
  };

  const wcOptions = {
    columns: GoodsColumnsArray,
    columnsType: GoodsColumnsType,
  };

  setTimeout(() => {
    loading.value = false;
  }, 1500);

  const bar = ref<any>(null);
  const line = ref<any>(null);
  const pie = ref<any>(null);
  const column = ref<any>(null);
  onMounted(async () => {
    try {
      const result = await getLastGoods();
      if (result.data) {
        lastGoodsData.value = result.data!;
      }
    } catch (identifier: any) {
      message.error(identifier.toString());
    }

    await handleOk();
    loading.value = false;
  });
</script>
