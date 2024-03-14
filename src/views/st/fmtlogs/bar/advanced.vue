<template>
  <div>
    <FieldList
      :data="requestDataForSearch.fields!"
      :options="columnsOptions"
      v-if="!jsonOptionsForSearch.jsonMode"
    />
    <CodeEditor
      v-model:value="jsonOptionsForSearch.jsonData"
      :mode="MODE.JSON"
      v-if="jsonOptionsForSearch.jsonMode"
    />
    <Card size="small" class="!my-2 text-right" :bordered="false"
      ><Space>
        <a @click="changeMode(jsonOptionsForSearch, requestDataForSearch.fields!)"
          ><RetweetOutlined />{{ t('st.base.change_mode') }}</a
        >
        <Popconfirm
          title="确定重置搜索条件吗？"
          ok-text="Yes"
          cancel-text="No"
          @confirm="clearSearchCondition"
        >
          <a><RestOutlined />{{ t('st.base.reset') }}</a>
        </Popconfirm>
        <a @click="sendSearchRequest()"><SearchOutlined />{{ t('st.base.search') }}</a>
      </Space></Card
    >
  </div>
</template>
<script lang="ts">
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { FieldList } from '@/components/FieldEditor';
  import { useI18n } from '@/hooks/web/useI18n';
  import { RestOutlined, RetweetOutlined, SearchOutlined } from '@ant-design/icons-vue';
  import { Card, Popconfirm, Space } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { changeMode } from './utils';

  import {
    clearSearchCondition,
    jsonOptionsForSearch,
    requestDataForSearch,
    sendSearchRequest,
  } from '../search';
  import { columnsOptions } from '../table';

  export default defineComponent({
    name: 'AdvancedSearch',
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
