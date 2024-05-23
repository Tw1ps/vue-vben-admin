<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'active'">
          <Tag color="green" v-if="text">True</Tag>
          <Tag color="red" v-if="!text">False</Tag>
        </template>
        <template v-if="column.key === 'data'">
          <div>
            <Comment>
              <template #actions>
                <Button size="small" v-if="text" @click="b64decode(record)">{{
                  t('st.base.decode')
                }}</Button>
              </template>
              <template #content>
                <p>{{ text }}</p>
              </template>
            </Comment>
          </div>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { BasicTable } from '@/components/Table';
  import { Tag, Button, Comment } from 'ant-design-vue';
  import { defineComponent, onMounted } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  import { registerTable } from './table';

  import { getSourceData, requestDataForSearch } from '../search';

  export default defineComponent({
    name: 'TableView',
    components: {
      BasicTable,
      Tag,
      Comment,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const b64decode = (v: Record<string, any>) => {
    console.log(v);
    const ret = atob(v.data);
    v.data = ret;
    console.log(ret);
  };

  onMounted(async () => {
    await getSourceData(requestDataForSearch);
  });
</script>
