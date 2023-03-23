<template>
  <a-card :hoverable="true" :title="title" size="small"
    ><div id="column" class="h-112.5"></div
  ></a-card>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Card } from 'ant-design-vue';

  export default defineComponent({
    components: {
      [Card.name]: Card,
    },
  });
</script>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { Column, ColumnOptions } from '@antv/g2plot';

  const props = defineProps({
    defaultData: {
      type: Object as PropType<Array<{ source: string; count: number; category: string }>>,
      default: () => {
        return [];
      },
    },
    title: {
      type: String,
      default: () => {
        return '数据源各板块数据统计';
      },
    },
    options: {
      type: Object as PropType<ColumnOptions>,
      default: () => {
        return {};
      },
    },
  });

  const columnView = ref<Column>();

  const newView = (options: ColumnOptions) => {
    return new Column('column', options);
  };

  const updateView = (data: Array<{ source: string; count: number; category: string }>) => {
    // lineView.value!.changeData(data);
    columnView.value!.update({
      data,
      // isGroup: true,
      xField: 'category',
      yField: 'count',
      // seriesField: 'category',
      xAxis: {
        label: {
          autoRotate: true,
          style: {
            fill: '#aaa',
            fontSize: 15,
          },
        },
      },
      tooltip: {
        showTitle: true,
        title: (title: string, datum) => {
          return datum.source + '\n' + title;
        },
      },
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle', // 'top', 'middle', 'bottom'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          { type: 'interval-adjust-position' },
          // 数据标签防遮挡
          { type: 'interval-hide-overlap' },
          // 数据标签文颜色自动调整
          { type: 'adjust-color' },
        ],
      },
      scrollbar: {
        type: 'horizontal',
      },
    });
  };

  onMounted(() => {
    columnView.value = newView(props.options);
    // updateView(props.defaultData);
  });

  defineExpose({ columnView, updateView });
</script>
