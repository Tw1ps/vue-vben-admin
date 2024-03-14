<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'action'">
          <Flex wrap="wrap" gap="small">
            <a @click="updateOne(record)" v-if="userInfo.rank <= 10"
              ><FormOutlined />{{ t('st.base.edit') }}</a
            >
            <Popconfirm
              title="确定删除吗？"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteOne(record)"
            >
              <a v-if="userInfo.rank <= 10"><DeleteOutlined />{{ t('st.base.delete') }}</a>
            </Popconfirm>
          </Flex>
        </template>
        <template v-if="column.key === 'active'">
          <Tag color="green" v-if="text">True</Tag>
          <Tag color="red" v-if="!text">False</Tag>
        </template>
        <template v-if="column.key === 'keyword'">
          <Card
            :key="idx"
            v-for="(kws, idx) in text"
            :bordered="true"
            mode="small"
            class="!m-2 border-zinc-300"
          >
            <Flex wrap="wrap" gap="small">
              <Tag :key="k" v-for="k in kws">{{ k }}</Tag>
            </Flex>
          </Card>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { BasicTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useUserStore } from '@/store/modules/user';
  import { DeleteOutlined, FormOutlined } from '@ant-design/icons-vue';
  import { Popconfirm, Tag, Flex, Card } from 'ant-design-vue';
  import { computed, defineComponent, onMounted } from 'vue';

  import { registerTable } from './table';

  import { deleteOne } from '../delete';
  import { updateOne } from '../edit';
  import { getSourceData, requestDataForSearch } from '../search';

  export default defineComponent({
    name: 'TableView',
    components: {
      BasicTable,
      Popconfirm,
      Tag,
      Flex,
      Card,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  onMounted(async () => {
    await getSourceData(requestDataForSearch);
  });

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);
</script>
