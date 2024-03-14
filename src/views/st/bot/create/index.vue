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
          <FormItem :label="t('st.columns.name')" v-bind="validateInfos.name">
            <Input v-model:value="createData.name" />
          </FormItem>
          <FormItem :label="t('st.columns.apikey')" v-bind="validateInfos.apikey">
            <Input v-model:value="createData.apikey" />
          </FormItem>
          <FormItem :label="t('st.columns.security')">
            <Tooltip>
              <template #title>机器人推送消息的安全验证方式</template>
              <InputGroup compact>
                <Select v-model:value="secType">
                  <SelectOption :value="BotSecurity[v]" :key="v" v-for="v in BotSecurity">
                    {{ t('st.enum.' + v.toLowerCase()) }}
                  </SelectOption>
                </Select>
                <Input
                  style="width: 70%"
                  v-model:value="createData.security.signature"
                  v-if="secType == BotSecurity.SIGNATURE"
                  allowClear
                />
                <Input
                  style="width: 70%"
                  v-model:value="createData.security.text"
                  v-if="secType == BotSecurity.TEXT"
                  allowClear
                />
              </InputGroup>
            </Tooltip>
          </FormItem>
          <FormItem :label="t('st.columns.ktype')">
            <Select v-model:value="createData.ktype">
              <SelectOption :value="v.value" :key="v.label" v-for="v in BotTypeArray">
                {{ t('st.enum.' + v.label.toLowerCase()) }}
              </SelectOption>
            </Select>
          </FormItem>
          <FormItem :label="t('st.columns.provider')">
            <Select v-model:value="createData.provider">
              <SelectOption :value="v.value" :key="v.label" v-for="v in BotProviderArray">
                {{ t('st.enum.' + v.label.toLowerCase()) }}
              </SelectOption>
            </Select>
          </FormItem>
          <FormItem :label="t('st.columns.note')">
            <Input v-model:value="createData.note" allowClear />
          </FormItem>
          <FormItem :label="t('st.columns.at_user')">
            <Select mode="tags" v-model:value="createData.at_user" />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="createData.active" />
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
    Select,
    SelectOption,
    InputGroup,
    Tooltip,
  } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { BotSecurity, BotTypeArray, BotProviderArray } from '@/api/st/model/bot';
  import {
    resetFields,
    confirmCreate,
    createData,
    validateInfos,
    visibleCreateModal,
    secType,
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
      InputGroup,
      Tooltip,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
