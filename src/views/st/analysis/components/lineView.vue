<template>
  <a-card :hoverable="true" :title="title" size="small"
    ><template #extra>
      <a-dropdown :trigger="['click']" class="p-1">
        <a class="ant-dropdown-link" @click.prevent> 单位: 日 </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a>单位: 年</a>
            </a-menu-item>
            <a-menu-item>
              <a>单位: 月</a>
            </a-menu-item>
            <a-menu-item>
              <a>单位: 日</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown> </template
    ><div id="line" class="h-112.5"></div
  ></a-card>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Card, Dropdown, Menu, MenuItem } from 'ant-design-vue';

  export default defineComponent({
    components: {
      [Card.name]: Card,
      [Dropdown.name]: Dropdown,
      [Menu.name]: Menu,
      [MenuItem.name]: MenuItem,
    },
  });
</script>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { Line, LineOptions } from '@antv/g2plot';

  const props = defineProps({
    defaultData: {
      type: Object as PropType<Array<{ source: string; date: Date; count: number }>>,
      default: () => {
        return [];
      },
    },
    title: {
      type: String,
      default: () => {
        return '活跃趋势';
      },
    },
    options: {
      type: Object as PropType<LineOptions>,
      default: () => {
        return {
          padding: 'auto',
          autoFit: true,
          smooth: true,
          xField: 'date',
          yField: 'count',
          seriesField: 'source',
          xAxis: {
            label: {
              style: {
                fill: '#aaa',
                fontSize: 17,
              },
              formatter: (v: string) => {
                return v.split('T')[0];
              },
            },
          },
          slider: {
            formatter: (v: string) => {
              return v.split('T')[0];
            },
          },
          legend: {
            flipPage: true,
            // 两行分页
            maxRow: 2,
            pageNavigator: {
              marker: {
                style: {
                  fill: 'rgba(0,0,0,0.65)',
                },
              },
            },
          },
          lineStyle: {
            lineWidth: 2.5,
          },
        };
      },
    },
  });
  const lineView = ref<Line>();
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

  const newLineView = (options: LineOptions) => {
    return new Line('line', options);
  };

  const updateView = (data: Array<{ source: string; date: Date; count: number }>) => {
    // lineView.value!.changeData(data);
    lineView.value!.update({
      data,
      padding: 'auto',
      autoFit: true,
      smooth: true,
      xField: 'date',
      yField: 'count',
      seriesField: 'source',
      xAxis: {
        label: {
          style: {
            fill: '#aaa',
            fontSize: 17,
          },
          formatter: (v: string) => {
            return v.split('T')[0];
          },
        },
      },
      color: COLOR_PLATE_10,
      slider: {
        formatter: (v: string) => {
          return v.split('T')[0];
        },
      },
      legend: {
        flipPage: true,
        // 两行分页
        maxRow: 2,
        pageNavigator: {
          marker: {
            style: {
              fill: 'rgba(0,0,0,0.65)',
            },
          },
        },
      },
      lineStyle: {
        lineWidth: 2.5,
      },
    });
  };

  onMounted(() => {
    lineView.value = newLineView(props.options);
    updateView(props.defaultData);
  });

  defineExpose({ lineView, updateView });
</script>
