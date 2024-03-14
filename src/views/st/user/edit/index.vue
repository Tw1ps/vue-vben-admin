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
      <div class="grid md:grid-cols-2 gap-4">
        <Card title="修改条件" size="small" :bordered="true">
          <FieldList
            :data="requestDataForUpdate.fields!"
            :options="columnsOptions"
            v-if="!jsonOptionsForUpdate.jsonMode"
          />
          <CodeEditor
            v-model:value="jsonOptionsForUpdate.jsonData"
            :mode="MODE.JSON"
            v-if="jsonOptionsForUpdate.jsonMode"
          />
        </Card>
        <Card title="修改字段" size="small" :bordered="true">
          <UpdateFieldList
            :data="updateFields"
            :options="columnsOptionsForUpdate"
            v-if="!jsonOptionsForUpdateField.jsonMode"
          />
          <CodeEditor
            v-model:value="jsonOptionsForUpdateField.jsonData"
            :mode="MODE.JSON"
            v-if="jsonOptionsForUpdateField.jsonMode"
          />
        </Card>
      </div>
      <Card size="small" class="!my-2 text-right" :bordered="false"
        ><Space>
          <a
            @click="
              () => {
                changeMode(jsonOptionsForUpdate, requestDataForUpdate.fields!);
                changeMode(jsonOptionsForUpdateField, updateFields);
              }
            "
            ><RetweetOutlined />{{ t('st.base.change_mode') }}</a
          >
          <Popconfirm
            title="确定重置更新条件吗？"
            ok-text="Yes"
            cancel-text="No"
            @confirm="clearUpdateCondition"
          >
            <a><RestOutlined />{{ t('st.base.reset') }}</a>
          </Popconfirm>
          <a @click="confirmUpdate()"><SendOutlined />{{ t('st.base.update') }}</a>
        </Space></Card
      >
    </Modal>
  </div>
</template>
<script lang="ts">
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { FieldList, UpdateFieldList } from '@/components/FieldEditor';
  import { useI18n } from '@/hooks/web/useI18n';
  import { RestOutlined, RetweetOutlined, SendOutlined } from '@ant-design/icons-vue';
  import { Card, Modal, Popconfirm, Space } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  import {
    confirmUpdate,
    clearUpdateCondition,
    jsonOptionsForUpdateField,
    updateFields,
    jsonOptionsForUpdate,
    requestDataForUpdate,
    columnsOptionsForUpdate,
    visibleUpdateModal,
  } from './edit';

  import { changeMode } from '../bar';
  import { columnsOptions } from '../table';

  export default defineComponent({
    name: 'EditModal',
    components: {
      Card,
      Space,
      Popconfirm,
      CodeEditor,
      Modal,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();
</script>
