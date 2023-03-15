<template>
  <a-card :hoverable="true" title="活跃趋势" size="small"
    ><div id="canvas3" class="w-full h-full"></div
  ></a-card>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { basicProps } from './props';
  import { Card } from 'ant-design-vue';

  export default defineComponent({
    components: {
      [Card.name]: Card,
    },
  });
</script>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { Line } from '@antv/g2plot';
  import { uniq, findIndex } from '@antv/util';

  defineProps({
    ...basicProps,
  });
  const data = [
    {
      date: '2018/8/1',
      type: 'download',
      value: 4623,
    },
    {
      date: '2018/8/1',
      type: 'register',
      value: 2208,
    },
    {
      date: '2018/8/1',
      type: 'bill',
      value: 182,
    },
    {
      date: '2018/8/2',
      type: 'download',
      value: 6145,
    },
    {
      date: '2018/8/2',
      type: 'register',
      value: 2016,
    },
    {
      date: '2018/8/2',
      type: 'bill',
      value: 257,
    },
    {
      date: '2018/8/3',
      type: 'download',
      value: 508,
    },
    {
      date: '2018/8/3',
      type: 'register',
      value: 2916,
    },
    {
      date: '2018/8/3',
      type: 'bill',
      value: 289,
    },
    {
      date: '2018/8/4',
      type: 'download',
      value: 6268,
    },
    {
      date: '2018/8/4',
      type: 'register',
      value: 4512,
    },
    {
      date: '2018/8/4',
      type: 'bill',
      value: 428,
    },
    {
      date: '2018/8/5',
      type: 'download',
      value: 6411,
    },
    {
      date: '2018/8/5',
      type: 'register',
      value: 8281,
    },
    {
      date: '2018/8/5',
      type: 'bill',
      value: 619,
    },
    {
      date: '2018/8/6',
      type: 'download',
      value: 1890,
    },
    {
      date: '2018/8/6',
      type: 'register',
      value: 2008,
    },
    {
      date: '2018/8/6',
      type: 'bill',
      value: 87,
    },
    {
      date: '2018/8/7',
      type: 'download',
      value: 4251,
    },
    {
      date: '2018/8/7',
      type: 'register',
      value: 1963,
    },
    {
      date: '2018/8/7',
      type: 'bill',
      value: 706,
    },
    {
      date: '2018/8/8',
      type: 'download',
      value: 2978,
    },
    {
      date: '2018/8/8',
      type: 'register',
      value: 2367,
    },
    {
      date: '2018/8/8',
      type: 'bill',
      value: 387,
    },
    {
      date: '2018/8/9',
      type: 'download',
      value: 3880,
    },
    {
      date: '2018/8/9',
      type: 'register',
      value: 2956,
    },
    {
      date: '2018/8/9',
      type: 'bill',
      value: 488,
    },
    {
      date: '2018/8/10',
      type: 'download',
      value: 3606,
    },
    {
      date: '2018/8/10',
      type: 'register',
      value: 678,
    },
    {
      date: '2018/8/10',
      type: 'bill',
      value: 507,
    },
    {
      date: '2018/8/11',
      type: 'download',
      value: 4311,
    },
    {
      date: '2018/8/11',
      type: 'register',
      value: 3188,
    },
    {
      date: '2018/8/11',
      type: 'bill',
      value: 548,
    },
    {
      date: '2018/8/12',
      type: 'download',
      value: 4116,
    },
    {
      date: '2018/8/12',
      type: 'register',
      value: 3491,
    },
    {
      date: '2018/8/12',
      type: 'bill',
      value: 456,
    },
    {
      date: '2018/8/13',
      type: 'download',
      value: 6419,
    },
    {
      date: '2018/8/13',
      type: 'register',
      value: 2852,
    },
    {
      date: '2018/8/13',
      type: 'bill',
      value: 689,
    },
    {
      date: '2018/8/14',
      type: 'download',
      value: 1643,
    },
    {
      date: '2018/8/14',
      type: 'register',
      value: 4788,
    },
    {
      date: '2018/8/14',
      type: 'bill',
      value: 280,
    },
    {
      date: '2018/8/15',
      type: 'download',
      value: 445,
    },
    {
      date: '2018/8/15',
      type: 'register',
      value: 4319,
    },
    {
      date: '2018/8/15',
      type: 'bill',
      value: 176,
    },
  ];
  const COLOR_PLATE_10 = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
  ];

  onMounted(() => {
    const container = document.getElementById('canvas3');
    const containerBox = container?.getBoundingClientRect();
    const series = uniq(data.map((d) => d.type));
    const markerSize = 6;

    const lo = {
      title: {
        visible: true,
        text: '自定义 marker point 激活样式',
      },
      padding: 'auto',
      forceFit: true,
      data,
      xField: 'date',
      yField: 'value',
      seriesField: 'type',
      yAxis: {
        label: {
          // 数值格式化为千分位
          formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        },
      },
      legend: {
        position: 'right-top',
      },
      color: COLOR_PLATE_10,
      point: {
        visible: true,
        shape: {
          fields: ['type'],
          callback: (v) => {
            if (v === 'Gas fuel') {
              return 'square';
            }
            return 'circle';
          },
        },
        style: (seriesField, xField) => {
          let r = markerSize / 2;
          // 自定义规则
          const maxCount = containerBox.width / (r * 4);
          const interval = Math.floor(data.length / maxCount);
          const fieldIdx = data.findIndex((d) => d['year'] === xField);
          if (fieldIdx && interval > 1 && fieldIdx % interval !== 0) {
            r = 0;
          }
          let fill = '';
          let lineWidth = 0;
          if (seriesField === 'Gas fuel') {
            fill = 'transparent';
            lineWidth = 1;
          }

          return {
            lineWidth,
            fill,
            r,
            stroke: COLOR_PLATE_10[findIndex(series, (s) => s === seriesField)] || 'transparent',
          };
        },
      },
      interactions: [{ type: 'marker-active' }, { type: 'element-active' }],
      responsive: true,
      theme: {
        pointStyle: {
          normal: {},
          active: () => {
            return {
              stroke: 'rgba(0, 0, 0, 0.85)',
              r: markerSize / 2,
              lineWidth: 1,
            };
          },
        },
        geometries: {
          point: {
            square: {
              active: {
                style: {
                  stroke: 'rgba(0, 0, 0, 0.85)',
                  lineWidth: 1,
                  r: markerSize / 2,
                },
              },
            },
          },
        },
      },
    };

    const linePlot = new Line('canvas3', lo);

    linePlot.render();
  });
</script>
