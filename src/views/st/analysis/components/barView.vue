<template>
  <a-card :hoverable="true" :title="title" size="small"
    ><div id="bar" class="w-full h-170"></div
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
  import { Bar, BarOptions } from '@antv/g2plot';

  const props = defineProps({
    defaultData: {
      type: Object as PropType<Array<{ keyword: string; count: number }>>,
      default: () => {
        return [];
      },
    },
    title: {
      type: String,
      default: () => {
        return '关键词排行';
      },
    },
    options: {
      type: Object as PropType<BarOptions>,
      default: () => {
        return {
          title: {
            visible: true,
            text: 'baseBar',
          },
          forceFit: true,
          xField: 'count',
          yField: 'keyword',
          label: {
            visible: true,
            // formatter: (v) => v.count,
          },
          yAxis: {
            label: {
              autoRotate: false,
            },
          },
          slider: { start: 0, end: 0.02 },
          // scrollbar: {
          //   type: 'vertical',
          // },
          brush: {
            enabled: true,
            type: 'x-rect',
          },
        };
      },
    },
  });

  const barView = ref<Bar>();

  const newBarView = (options: BarOptions) => {
    return new Bar('bar', options);
  };

  const updateView = (
    data: Array<{
      keyword: string;
      count: number;
    }>,
  ) => {
    barView.value!.changeData(data);
    barView.value!.render();
  };

  onMounted(() => {
    barView.value = newBarView(props.options);
    updateView(props.defaultData);
  });
  defineExpose({ barView, updateView });
</script>
