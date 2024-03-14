<template>
  <Card :bordered="bordered" size="small" :loading="loading">
    <div id="container" v-if="!simpleView"></div>
    <Descriptions :title="dt.hostname" :column="column">
      <template #extra>
        <Badge
          status="processing"
          :text="checkStatusText(dt.heartbeat)"
          :color="checkStatus(dt.heartbeat)"
        />
      </template>
      <DescriptionsItem :label="t('st.columns.heartbeat')" v-if="simpleView">
        {{ formattedTime(dt.heartbeat) }}
      </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.boot_process')">
        {{ formattedDuration(dt.boot_process) }}
      </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.boot_time')">
        {{ formattedDuration(dt.boot_time) }}
      </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.user')"> {{ dt.user }} </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.ip')">
        <div :key="idx2" v-for="(ip, idx2) in dt.ip">
          <Tag>{{ ip }}</Tag>
        </div>
      </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.os')"> {{ dt.os }} </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.os_version')">
        {{ dt.os_version }}
      </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.process_memory_used')" v-if="simpleView">
        {{ toFixedTwo(dt.process_memory_used / 1024 / 1024) }}MB
      </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.process_memory_used_max')">
        {{ toFixedTwo(dt.process_memory_used_max / 1024 / 1024) }}MB
      </DescriptionsItem>
      <DescriptionsItem
        :label="t('st.columns.cpu_used')"
        :labelStyle="{ width: '125px' }"
        v-if="simpleView"
      >
        <Progress stroke-linecap="square" :percent="dt.cpu_used" />
      </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.cpu_used_max')" v-if="!simpleView">
        {{ dt.cpu_used_max }}%
      </DescriptionsItem>
      <DescriptionsItem
        :label="t('st.columns.cpu_used_max')"
        :labelStyle="{ width: '125px' }"
        v-if="simpleView"
      >
        <Progress stroke-linecap="square" :percent="dt.cpu_used_max" />
      </DescriptionsItem>
      <DescriptionsItem
        :label="t('st.columns.system_memory_used')"
        :labelStyle="{ width: '125px' }"
        v-if="simpleView"
      >
        <Progress
          stroke-linecap="square"
          :percent="toFixedTwo((dt.system_memory_used / dt.system_memory_total) * 100)"
        />
      </DescriptionsItem>
      <DescriptionsItem :label="t('st.columns.system_memory_used_max')" v-if="!simpleView">
        {{ toFixedTwo((dt.system_memory_used_max / dt.system_memory_total) * 100) }}%
      </DescriptionsItem>
      <DescriptionsItem
        :label="t('st.columns.system_memory_used_max')"
        :labelStyle="{ width: '125px' }"
        v-if="simpleView"
      >
        <Progress
          stroke-linecap="square"
          :percent="toFixedTwo((dt.system_memory_used_max / dt.system_memory_total) * 100)"
        />
      </DescriptionsItem>
    </Descriptions>
    <div class="h-50 overflow-x-auto">
      <ImagePreviewGroup>
        <Flex horizontal>
          <div :key="idx" v-for="(d, idx) in dataSource">
            <div class="!m-2" v-if="d.screenshot && d.screenshot != '-'">
              <Image :src="'data:image/png;base64,' + d.screenshot" /></div
          ></div>
        </Flex>
      </ImagePreviewGroup>
    </div>
    <slot name="footer"></slot>
  </Card>
</template>
<script lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    Card,
    Descriptions,
    DescriptionsItem,
    Tag,
    Image,
    Progress,
    Badge,
    ImagePreviewGroup,
    Flex,
  } from 'ant-design-vue';
  import { defineComponent, onMounted, ref } from 'vue';

  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import zhCn from 'dayjs/locale/zh-cn';
  import relativeTime from 'dayjs/plugin/relativeTime';

  import { Line } from '@antv/g2plot';

  import { NodeInfo } from '@/api/st/model/system';

  export default defineComponent({
    name: 'StatusView',
    components: {
      Card,
      Descriptions,
      DescriptionsItem,
      Tag,
      Image,
      Progress,
      Badge,
      ImagePreviewGroup,
      Flex,
    },
  });
</script>
<script lang="ts" setup>
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
  dayjs.locale(zhCn);

  const { t } = useI18n();

  const props = defineProps({
    data: {
      type: Object as PropType<Array<NodeInfo>>,
      required: true,
    },
    // xField: {
    //   type: string,
    //   required: true,
    // },
    // yField: {
    //   type: string,
    //   required: true,
    // },
    // seriesField: {
    //   type: string,
    //   required: true,
    // },
    sliderStart: {
      type: Number,
      default: () => {
        return 0.0;
      },
    },
    sliderEnd: {
      type: Number,
      default: () => {
        return 1.0;
      },
    },
    column: {
      type: Number,
      default: () => {
        return 3;
      },
    },
    simpleView: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    bordered: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  });

  const dt = ref<NodeInfo>({
    cid: '-',
    system_memory_total: 0,
    system_memory_used: 0,
    system_memory_used_max: 0,
    system_memory_free: 0,
    process_memory_used: 0,
    process_memory_used_max: 0,
    heartbeat: 0,
    boot_time: 0,
    boot_process: 0,
    cpu_used: 0,
    cpu_used_max: 0,
    hostname: '-',
    ip: ['-'],
    os: '-',
    os_version: '-',
    user: '-',
    screenshot: '-',
  });
  const dataSource = ref<Array<NodeInfo>>(props.data);
  const column = ref<number>(props.column);
  const bordered = ref<boolean>(props.bordered);
  const currentTime = ref(dayjs()); // 当前时间
  const loading = ref(false);

  const toFixedTwo = (value, fix: number = 2) => {
    return Number(value.toFixed(fix));
  };

  const formattedTime = (timestamp) => {
    return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
  };

  const formattedDuration = (duration) => {
    try {
      const durationObj = dayjs.duration(duration * 1000);
      return durationObj.format('D 天 H 小时 m 分钟 s 秒');
    } catch (identifier: any) {
      console.log(identifier.toString());
    }
  };

  const checkStatus = (timestamp) => {
    const diff = currentTime.value.diff(timestamp * 1000, 'second'); // 计算当前时间与时间戳之间的差值，以秒为单位
    if (diff < 60) {
      return 'green';
    } else if (diff < 120) {
      return 'yellow';
    }
    return 'red';
  };

  const checkStatusText = (timestamp) => {
    const diff = currentTime.value.diff(timestamp * 1000, 'second'); // 计算当前时间与时间戳之间的差值，以秒为单位
    if (diff < 60) {
      return t('st.base.normal');
    } else if (diff < 120) {
      return t('st.base.delay');
    }
    return t('st.base.abnormal');
  };

  const rebuildData = (data: Array<NodeInfo>) => {
    const newData: Array<{
      heartbeat: string;
      field: string;
      value: number;
    }> = [];
    data.forEach((dt: NodeInfo) => {
      newData.push({
        heartbeat: formattedTime(dt.heartbeat),
        field: t('st.columns.system_memory_used'),
        value: toFixedTwo((dt.system_memory_used / dt.system_memory_total) * 100),
      });
      newData.push({
        heartbeat: formattedTime(dt.heartbeat),
        field: t('st.columns.process_memory_used'),
        value: toFixedTwo((dt.process_memory_used / dt.system_memory_total) * 100),
      });
      newData.push({
        heartbeat: formattedTime(dt.heartbeat),
        field: t('st.columns.cpu_used'),
        value: dt.cpu_used,
      });
    });
    return newData;
  };

  const makePlot = () => {
    const newData = rebuildData(dataSource.value);

    console.log(newData);

    const linePlot = new Line('container', {
      data: newData,
      xField: 'heartbeat',
      yField: 'value',
      seriesField: 'field',
      // xAxis: {
      //   label: {
      //     formatter: (v) => formattedTime(v),
      //   },
      // },
      yAxis: {
        label: {
          formatter: (v) => `${v}%`,
        },
      },
      legend: {
        position: 'top',
      },
      smooth: true,
      // 配置折线趋势填充
      area: {
        style: {
          fillOpacity: 0.15,
        },
      },
      slider: {
        start: 0.0,
        end: 0.3,
      },
      // animation: {
      //   appear: {
      //     animation: 'wave-in',
      //     duration: 3000,
      //   },
      // },
    });

    linePlot.render();
  };

  onMounted(async () => {
    loading.value = true;
    dt.value = dataSource.value[0];
    if (props.simpleView === false) {
      makePlot();
    }
    loading.value = false;
  });
</script>
