<template>
  <div>
    <Card size="small" :bordered="false">
      <Collapse v-model:activeKey="activeKey" ghost>
        <CollapsePanel key="1" :header="t('st.base.advanced_search_bar')">
          <AdvancedSearch />
        </CollapsePanel>
        <CollapsePanel
          key="2"
          :header="t('st.base.tool') + t('st.base.bar')"
          v-if="userInfo.rank <= 10"
        >
          <ToolsBar />
        </CollapsePanel>
        <!-- <CollapsePanel
          key="3"
          :header="t('st.base.quick') + t('st.base.search') + t('st.base.bar')"
        >
          <QuickBar />
        </CollapsePanel> -->
      </Collapse>
    </Card>
  </div>
</template>
<script lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import { useUserStore } from '@/store/modules/user';
  import { Card, Collapse, CollapsePanel } from 'ant-design-vue';
  import { computed, defineComponent, ref } from 'vue';

  import AdvancedSearch from './advanced.vue';
  // import QuickBar from './quick.vue';
  import ToolsBar from './tools.vue';

  export default defineComponent({
    name: 'UtilsBar',
    components: {
      Card,
      Collapse,
      CollapsePanel,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const activeKey = ref(['2']);

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);
</script>
