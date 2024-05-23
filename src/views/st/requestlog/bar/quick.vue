<template>
  <div class="!my-2 w-full"><Card />{{ t('st.padding') }}</div>
</template>
<script lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'QuickBar',
    components: {
      Card,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
