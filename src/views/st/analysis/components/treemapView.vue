<template>
  <a-card :hoverable="true" :title="title" size="small"
    ><div id="treemap" class="w-full h-full"></div>
  </a-card>
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
  import { Treemap, TreemapOptions } from '@antv/g2plot';

  const props = defineProps({
    defaultData: {
      type: Object as PropType<Array<any>>,
      default: () => {
        return [];
      },
    },
    title: {
      type: String,
      default: () => {
        return '各数据源数据总量占比';
      },
    },
    options: {
      type: Object as PropType<TreemapOptions>,
      default: () => {
        return {
          colorField: 'name',
          legend: {
            position: 'top-left',
          },
          tooltip: {
            formatter: (v) => {
              const root = v.path[v.path.length - 1];
              return {
                name: v.name,
                value: `${v.value}(总占比${((v.value / root.value) * 100).toFixed(2)}%)`,
              };
            },
          },
          autoFit: true,
          interactions: [{ type: 'treemap-drill-down' }],
          animation: {},
        };
      },
    },
  });

  const treemapView = ref<Treemap>();

  const newView = (options: TreemapOptions) => {
    return new Treemap('treemap', options);
  };

  const updateView = (data: Array<any>) => {
    // lineView.value!.changeData(data);
    treemapView.value!.update({
      data,
      colorField: 'name',
      legend: {
        position: 'top-left',
      },
      tooltip: {
        formatter: (v) => {
          const root = v.path[v.path.length - 1];
          return {
            name: v.name,
            value: `${v.value}(总占比${((v.value / root.value) * 100).toFixed(2)}%)`,
          };
        },
      },
      autoFit: true,
      interactions: [{ type: 'treemap-drill-down' }],
      animation: {},
    });
  };

  onMounted(() => {
    treemapView.value = newView(props.options);
  });

  defineExpose({ treemapView, updateView });
</script>
