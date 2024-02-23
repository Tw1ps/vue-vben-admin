<template>
  <div class="!my-2 w-full">
    <Card size="small" :bordered="false" title='模糊搜索请在搜索内容前后添加"%"'>
      <Space class="p-2">
        {{ t('st.columns.id') }}
        <InputSearch
          v-model:value="quickSearchValue.value1"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.ID, quickSearchValue.value1)"
        />

        {{ t('st.columns.city') }}
        <InputSearch
          v-model:value="quickSearchValue.value2"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.CITY, quickSearchValue.value2)"
        />

        {{ t('st.columns.organizer') }}
        <InputSearch
          v-model:value="quickSearchValue.value3"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.ORGANIZER, quickSearchValue.value3)"
        />

        {{ t('st.columns.location') }}
        <InputSearch
          v-model:value="quickSearchValue.value4"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.LOCATION, quickSearchValue.value4)"
        />
      </Space>
      <Space class="p-2">
        {{ t('st.columns.record') }}
        <InputSearch
          v-model:value="quickSearchValue.value5"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.RECORD, quickSearchValue.value5)"
        />

        {{ t('st.base.icp') + t('st.columns.site') }}
        <InputSearch
          v-model:value="quickSearchValue.value6"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.SITE, quickSearchValue.value6)"
        />

        {{ t('st.columns.response') + t('st.columns.site') }}
        <InputSearch
          v-model:value="quickSearchValue.value7"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.TITLES, quickSearchValue.value7)"
        />

        {{ t('st.columns.homepage') }}
        <InputSearch
          v-model:value="quickSearchValue.value8"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.HOMEPAGE, quickSearchValue.value8)"
        />
      </Space>
      <Space class="p-2">
        {{ t('st.columns.tag') }}
        <InputSearch
          v-model:value="quickSearchValue.value9"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.TAG, quickSearchValue.value9)"
        />

        {{ t('st.columns.auto_tag') }}
        <InputSearch
          v-model:value="quickSearchValue.value10"
          placeholder="请输入搜索内容"
          @search="onQuickSearch(HostColumns.AUTO_TAG, quickSearchValue.value10)"
        />
        <Button @click="onQuickSearchAlive" :icon="h(SearchOutlined)">仅展示存活条目</Button>
        <Button @click="onQuickSearchAlert" :icon="h(SearchOutlined)">仅展示告警条目</Button>
        <Button @click="onQuickSearchClear">展示全部数据</Button>
      </Space>
    </Card></div
  >
</template>
<script lang="ts">
  import { HostColumns } from '@/api/st/model/host';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { Card, Space, InputSearch, Button } from 'ant-design-vue';
  import { defineComponent, h } from 'vue';

  import {
    quickSearchValue,
    onQuickSearchClear,
    onQuickSearchAlert,
    onQuickSearchAlive,
    onQuickSearch,
  } from '../search';

  export default defineComponent({
    name: 'QuickBar',
    components: {
      Card,
      Space,
      InputSearch,
      Button,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
