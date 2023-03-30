<template>
  <div class="grid lg:grid-cols-10 h-99% w-full sm:grid-cols-1"> </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
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
  import { ref, onMounted } from 'vue';

  const loading = ref<boolean>(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);

  onMounted(async () => {
    loading.value = false;
  });
</script>
