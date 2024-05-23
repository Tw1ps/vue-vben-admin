<template>
  <div>
    <Modal
      v-model:open="visibleCreateModal"
      class="w-auto h-auto"
      @ok="confirmCreate"
      :title="t('st.base.create')"
      :footer="null"
    >
      <Card :bordered="false" size="small">
        <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <FormItem :label="t('st.columns.host')" v-bind="validateInfos.host">
            <Input :maxlength="256" v-model:value="createData.host" />
          </FormItem>
          <FormItem :label="t('st.columns.hostname')" v-bind="validateInfos.hostname">
            <Input :maxlength="127" v-model:value="createData.hostname" />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="createData.active" />
          </FormItem>
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Space>
              <Button type="primary" @click.prevent="confirmCreate">{{ t('st.base.add') }}</Button>
              <Button @click="resetFields">{{ t('st.base.reset') }}</Button>
            </Space>
          </FormItem>
        </Form>
      </Card>
    </Modal>
  </div>
</template>
<script lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card, Form, FormItem, Input, Modal, Space, Switch, Button } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import {
    resetFields,
    confirmCreate,
    createData,
    validateInfos,
    visibleCreateModal,
  } from './create';

  export default defineComponent({
    name: 'CreateModal',
    components: {
      Card,
      Space,
      Modal,
      Form,
      FormItem,
      Input,
      Switch,
      Button,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
