<template>
  <PageWrapper>
    <!-- <PageWrapper contentFullHeight :title="t('st.page.host')" :content="t('st.pageIntro.host')"> -->
    <div class="!my-2 w-full">
      <Card size="small" :bordered="false"> <UtilsBar /> </Card>
      <Card class="!my-2">
        <TableView />
      </Card>
      <!-- <Card :title="t('st.base.usage')" :bordered="false">使用说明 </Card> -->
    </div>

    <CreateModal />
    <DeleteModal />
    <EditModal />

    {{ padding }}
  </PageWrapper>
</template>
<script lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { Card } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';

  import { UtilsBar } from './bar';
  import { CreateModal } from './create';
  import { EditModal } from './edit';
  import { DeleteModal } from './delete';
  import { TableView } from './table';

  export default defineComponent({
    name: 'Host',
    components: {
      PageWrapper,
      Card,
      CreateModal,
      EditModal,
      UtilsBar,
      TableView,
      DeleteModal,
    },
  });
</script>
<script lang="ts" setup>
  const padding = ref('');
</script>
