<template>
  <div>
    <Modal
      v-model:open="visibleUpdateModal"
      class="w-auto h-auto"
      @ok="confirmUpdate"
      :title="t('st.base.update')"
      :footer="null"
    >
      <Card :bordered="false" size="small">
        <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <FormItem
            :label="t('st.columns.organizer') + t('st.columns.name')"
            v-bind="validateInfos.organizer"
          >
            <Input
              :maxlength="127"
              v-model:value="updateData.organizer"
              :placeholder="data.organizer"
            />
          </FormItem>
          <FormItem
            :label="t('st.columns.organizer') + t('st.columns.city')"
            v-bind="validateInfos.city"
          >
            <Input :maxlength="31" v-model:value="updateData.city" :placeholder="data.city" />
          </FormItem>
          <FormItem :label="t('st.columns.organizer') + t('st.columns.location')">
            <Input
              :maxlength="255"
              v-model:value="updateData.location"
              :placeholder="data.location"
            />
          </FormItem>
          <FormItem :label="t('st.columns.record')">
            <Input :maxlength="63" v-model:value="updateData.record" :placeholder="data.record" />
          </FormItem>
          <FormItem :label="t('st.columns.site') + t('st.columns.name')">
            <Input :maxlength="127" v-model:value="updateData.site" :placeholder="data.site" />
          </FormItem>
          <FormItem :label="t('st.columns.homepage')">
            <Input v-model:value="updateData.homepage" :placeholder="data.homepage" />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="updateData.active" :default="data.active" />
          </FormItem>
          <FormItem :label="t('st.columns.alive')">
            <Switch v-model:checked="updateData.alive" :default="data.alive" />
          </FormItem>
          <FormItem :label="t('st.columns.tag')">
            <Select mode="tags" v-model:value="updateData.tag" :placeholder="data.tag" />
          </FormItem>
          <FormItem :label="t('st.columns.note')">
            <Input v-model:value="updateData.note" :placeholder="data.note" />
          </FormItem>
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Space>
              <a-button type="primary" @click.prevent="confirmUpdate">{{
                t('st.base.add')
              }}</a-button>
              <a-button @click="resetFields">{{ t('st.base.reset') }}</a-button>
            </Space>
          </FormItem>
        </Form>
      </Card>
    </Modal>
  </div>
</template>
<script lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card, Form, FormItem, Input, Modal, Select, Space, Switch } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import {
    confirmUpdate,
    data,
    resetFields,
    updateData,
    validateInfos,
    visibleUpdateModal,
  } from './edit';

  export default defineComponent({
    name: 'HostDetailUpdateModal',
    components: {
      Card,
      Modal,
      Form,
      FormItem,
      Input,
      Switch,
      Select,
      Space,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
<style>
  .text-container {
    word-wrap: break-word;
  }
</style>
