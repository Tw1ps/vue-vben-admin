<template>
  <a-card :hoverable="true" title="各数据源数据总量占比" size="small"
    ><div id="canvas2" class="w-full h-full"></div
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
  import { Pie, G2 } from '@antv/g2plot';

  defineProps({
    ...basicProps,
  });
  const data = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其它',
      value: 5,
    },
  ];

  onMounted(() => {
    const cfg = {
      appendPadding: 10,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      legend: false,
      label: {
        type: 'spider',
        labelHeight: 40,
        formatter: (data, mappingData) => {
          const G = G2.getEngine('canvas');
          const group = new G.Group({});
          group.addShape({
            type: 'circle',
            attrs: {
              x: 0,
              y: 0,
              width: 40,
              height: 50,
              r: 5,
              fill: mappingData.color,
            },
          });
          group.addShape({
            type: 'text',
            attrs: {
              x: 10,
              y: 8,
              text: `${data.type}`,
              fill: mappingData.color,
            },
          });
          group.addShape({
            type: 'text',
            attrs: {
              x: 0,
              y: 25,
              text: `${data.value}个 ${data.percent * 100}%`,
              fill: 'rgba(0, 0, 0, 0.65)',
              fontWeight: 700,
            },
          });
          return group;
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    };

    const linePlot = new Pie('canvas2', cfg);

    linePlot.render();
  });
</script>
