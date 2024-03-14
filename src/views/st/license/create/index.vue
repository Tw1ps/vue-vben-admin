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
        <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <FormItem :label="t('st.columns.authorized')" v-bind="validateInfos.authorized">
            <Input
              v-model:value="createData.authorized"
              :maxlength="63"
              placeholder="请输入授权对象"
            />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="createData.active" />
          </FormItem>
          <FormItem :label="t('st.columns.rank')">
            <InputNumber id="inputNumber" v-model:value="createData.rank" :min="0" />
          </FormItem>
          <FormItem :label="t('st.columns.max_members')">
            <InputNumber
              id="inputNumber"
              v-model:value="createData.max_members"
              :min="1"
              :max="31"
            />
          </FormItem>
          <FormItem :label="t('st.columns.validity')">
            <DatePicker
              v-model:value="createData.validity"
              valueFormat="YYYY-MM-DDTHH:mm:ss"
              show-time
            />
          </FormItem>
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Space>
              <a-button type="primary" @click.prevent="confirmCreate">{{
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
  import {
    Card,
    Form,
    FormItem,
    Input,
    Modal,
    Space,
    Switch,
    InputNumber,
    DatePicker,
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
      InputNumber,
      DatePicker,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
