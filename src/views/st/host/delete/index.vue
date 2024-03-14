<template>
  <div>
    <Modal
      v-model:open="visibleDeleteModal"
      class="w-auto h-auto"
      @ok="confirmDelete"
      :title="'按条件删除' + padding"
    >
      <SearchForm
        :data="requestDataForDelete"
        :options="columnsOptions"
        :jsonOptions="jsonOptionsForDelete"
        :showOffset="false"
        :showOrder="false"
      />
    </Modal>
  </div>
</template>
<script lang="ts">
  import { SearchForm } from '@/components/FieldEditor';
  import { Modal } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';

  import { columnsOptions } from '../table';

  import {
    visibleDeleteModal,
    confirmDelete,
    requestDataForDelete,
    jsonOptionsForDelete,
  } from './delete';

  export default defineComponent({
    name: 'DeleteModal',
    components: {
      Modal,
      SearchForm,
    },
  });
</script>
<script lang="ts" setup>
  const padding = ref('');
</script>
