<template>
  <div>
    <Modal
      v-model:open="visibleUpdateModal"
      class="h-auto"
      width="1000px"
      @ok="confirmUpdate"
      title="按条件修改"
      :footer="null"
    >
      <Card :bordered="false" size="small">
        <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <FormItem :label="t('st.columns.keyword')">
            <Flex :key="idx" v-for="(kws, idx) in updateData.keyword">
              <Select
                mode="tags"
                :token-separators="[',', '，']"
                v-model:value="updateData.keyword[idx]"
              />
              <Popconfirm
                :title="t('st.base.delete')"
                ok-text="Yes"
                cancel-text="No"
                @confirm="
                  () => {
                    updateData.keyword.splice(idx, 1);
                  }
                "
              >
                <Button>{{ t('st.base.delete') }}</Button>
              </Popconfirm>
            </Flex>
            <Button
              @click="
                () => {
                  updateData.keyword.push([]);
                }
              "
              >{{ t('st.base.add') + t('st.base.keywordArray') }}</Button
            >
          </FormItem>
          <FormItem :label="t('st.columns.note')">
            <Input v-model:value="updateData.note" allowClear />
          </FormItem>
          <FormItem :label="t('st.columns.active')">
            <Switch v-model:checked="updateData.active" />
          </FormItem>
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Space>
              <Button type="primary" @click.prevent="confirmUpdate()">{{
                t('st.base.update')
              }}</Button>
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
    Modal,
    Popconfirm,
    Space,
    Form,
    FormItem,
    Flex,
    Select,
    Button,
    Switch,
    Input,
  } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  import { confirmUpdate, visibleUpdateModal, updateData } from './edit';

  export default defineComponent({
    name: 'EditModal',
    components: {
      Card,
      Space,
      Popconfirm,
      Modal,
      Form,
      FormItem,
      Flex,
      Select,
      Button,
      Switch,
      Input,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
