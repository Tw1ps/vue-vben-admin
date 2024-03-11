<template>
  <PageWrapper contentFullHeight :title="t('st.page.license')" :content="t('st.pageIntro.license')">
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
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';

  import { UtilsBar } from './bar';
  import { CreateModal } from './create';
  import { EditModal } from './edit';
  import { DeleteModal } from './delete';
  import { TableView } from './table';

  export default defineComponent({
    name: 'License',
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
  const { t } = useI18n();
  const padding = ref('');
</script>
