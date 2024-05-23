<template>
  <div>
    <Card size="small" class="text-right" :bordered="false"
      ><Space />{{ t('st.padding') }}</Card
    ></div
  >
</template>
<script lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card, Space } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ToolsBar',
    components: {
      Card,
      Space,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
