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
          <FormItem
            :label="t('st.columns.organizer') + t('st.columns.name')"
            v-bind="validateInfos.organizer"
          >
            <Input :maxlength="127" v-model:value="createData.organizer" />
          </FormItem>
          <FormItem
            :label="t('st.columns.organizer') + t('st.columns.city')"
            v-bind="validateInfos.city"
          >
            <Input :maxlength="31" v-model:value="createData.city" />
          </FormItem>
          <FormItem :label="t('st.columns.organizer') + t('st.columns.location')">
            <Input :maxlength="255" v-model:value="createData.location" />
          </FormItem>
          <FormItem :label="t('st.columns.record')">
            <Input :maxlength="63" v-model:value="createData.record" />
          </FormItem>
          <FormItem :label="t('st.columns.site') + t('st.columns.name')">
            <Input :maxlength="127" v-model:value="createData.site" />
          </FormItem>
          <FormItem :label="t('st.columns.homepage')">
            <Input v-model:value="createData.homepage" />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="createData.active" />
          </FormItem>
          <FormItem :label="t('st.columns.alive')">
            <Switch v-model:checked="createData.alive" />
          </FormItem>
          <FormItem :label="t('st.columns.tag')">
            <Select mode="tags" v-model:value="createData.tag" />
          </FormItem>
          <FormItem :label="t('st.columns.note')">
            <Input v-model:value="createData.note" />
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
  import {
    Card,
    Form,
    FormItem,
    Input,
    Modal,
    Select,
    Space,
    Switch,
    Button,
  } from 'ant-design-vue';
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
      Select,
      Button,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
