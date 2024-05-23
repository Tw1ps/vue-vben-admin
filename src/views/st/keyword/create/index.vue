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
          <FormItem :label="t('st.base.rel') + t('st.base.bot')">
            <Select v-model:value="botId" :option="botData" />
          </FormItem>
          <FormItem :label="t('st.columns.keyword')">
            <Flex :key="idx" v-for="(kws, idx) in createData.keyword">
              <Select
                mode="tags"
                :token-separators="[',', '，']"
                v-model:value="createData.keyword[idx]"
              />
              <Popconfirm
                :title="t('st.base.delete')"
                ok-text="Yes"
                cancel-text="No"
                @confirm="
                  () => {
                    createData.keyword.splice(idx, 1);
                  }
                "
              >
                <Button>{{ t('st.base.delete') }}</Button>
              </Popconfirm>
            </Flex>
            <Button
              @click="
                () => {
                  createData.keyword.push([]);
                }
              "
              >{{ t('st.base.add') + t('st.base.keywordArray') }}</Button
            >
          </FormItem>
          <FormItem :label="t('st.columns.note')">
            <Input v-model:value="createData.note" allowClear />
          </FormItem>
          <FormItem :label="t('st.columns.ktype')">
            <Select v-model:value="createData.ktype">
              <a-select-option :value="0">{{ t('st.enum.white') }}</a-select-option>
              <a-select-option :value="1">{{ t('st.enum.black') }}</a-select-option>
            </Select>
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
    Button,
    Flex,
    Popconfirm,
  } from 'ant-design-vue';
  import { defineComponent, onMounted } from 'vue';

  import {
    resetFields,
    confirmCreate,
    createData,
    visibleCreateModal,
    getBotData,
    botData,
    botId,
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
      Flex,
      Popconfirm,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  onMounted(async () => {
    await getBotData();
  });
</script>
