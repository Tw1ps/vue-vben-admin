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
          <FormItem :label="t('st.columns.username')" v-bind="validateInfos.username">
            <Input
              v-model:value="createData.username"
              :maxlength="255"
              placeholder="请输入用户名"
            />
          </FormItem>
          <FormItem :label="t('st.columns.nickname')">
            <Input v-model:value="createData.nickname" :maxlength="255" placeholder="请输入昵称" />
          </FormItem>
          <FormItem :label="t('st.columns.password')" v-bind="validateInfos.password">
            <InputPassword
              v-model:value="createData.password"
              :maxlength="255"
              placeholder="请输入密码"
            />
          </FormItem>
          <FormItem :label="t('st.columns.email')">
            <Input v-model:value="createData.email" :maxlength="255" placeholder="请输入邮箱" />
          </FormItem>
          <FormItem :label="t('st.columns.note')">
            <Input v-model:value="createData.note" :maxlength="63" placeholder="请输入备注" />
          </FormItem>
          <FormItem :label="t('st.columns.license')" v-bind="validateInfos.license">
            <Input v-model:value="createData.license" placeholder="请输入许可证" />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="createData.active" />
          </FormItem>
          <FormItem :label="t('st.columns.rank')">
            <Select ref="select" v-model:value="createData.rank">
              <SelectOption :value="10000" v-if="userInfo.rank < 10000">{{
                t('st.privilege.tour')
              }}</SelectOption>
              <SelectOption :value="101" v-if="userInfo.rank < 101">{{
                t('st.privilege.zd')
              }}</SelectOption>
              <SelectOption :value="1000" v-if="userInfo.rank < 1000">{{
                t('st.privilege.general')
              }}</SelectOption>
              <SelectOption :value="600" v-if="userInfo.rank < 600">{{
                t('st.privilege.service')
              }}</SelectOption>
              <SelectOption :value="10" v-if="userInfo.rank < 10">{{
                t('st.privilege.admin')
              }}</SelectOption>
            </Select>
          </FormItem>
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Space>
              <a-button type="primary" @click.prevent="confirmCreate">{{
                t('st.base.create')
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
  import { useUserStore } from '@/store/modules/user';
  import {
    Card,
    Form,
    FormItem,
    Input,
    Modal,
    Space,
    Switch,
    Select,
    SelectOption,
    InputPassword,
  } from 'ant-design-vue';
  import { defineComponent, computed } from 'vue';

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
      SelectOption,
      InputPassword,
    },
  });
</script>
<script lang="ts" setup>
  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);

  const { t } = useI18n();
</script>
