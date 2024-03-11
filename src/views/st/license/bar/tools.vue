<template>
  <div>
    <Card size="small" class="text-right" :bordered="false"
      ><Space>
        <a @click="showModalForCreate"><PlusSquareOutlined />{{ t('st.base.create') }}</a>
        <a @click="updateSelected"
          ><FormOutlined />{{ t('st.base.update') + t('st.base.selected') }}</a
        >
        <a @click="showModalForUpdate"
          ><FormOutlined />{{ t('st.base.condition') + t('st.base.update') }}</a
        >
        <Popconfirm
          title="确定删除已选数据吗？"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteSelected"
        >
          <a><RestOutlined />{{ t('st.base.delete') + t('st.base.selected') }}</a>
        </Popconfirm>
        <Popconfirm
          title="确定删除全部数据吗？"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteAll"
        >
          <a><RestOutlined />{{ t('st.base.delete') + t('st.base.all') }}</a>
        </Popconfirm>
        <a @click="showModalForDelete"
          ><DeleteOutlined />{{ t('st.base.condition') + t('st.base.delete') }}</a
        >
      </Space></Card
    ></div
  >
</template>
<script lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    DeleteOutlined,
    FormOutlined,
    PlusSquareOutlined,
    RestOutlined,
  } from '@ant-design/icons-vue';
  import { Card, Popconfirm, Space } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { showModalForCreate } from '../create';
  import { deleteAll, deleteSelected, showModalForDelete } from '../delete';
  import { showModalForUpdate, updateSelected } from '../edit';

  export default defineComponent({
    name: 'ToolsBar',
    components: {
      Card,
      Space,
      Popconfirm,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
