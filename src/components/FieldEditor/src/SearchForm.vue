<template>
  <a-form :model="data" layout="vertical">
    <div class="grid lg:grid-cols-2 sm:grid-cols-1 p-4">
      <a-form-item :label="t('st.base.offset')" name="offset">
        <a-input-number v-model:value="offset" :min="0" placeholder="number" :defaultValue="0" />
      </a-form-item>
      <a-form-item :label="t('st.base.limit')" name="limit">
        <a-input-number v-model:value="limit" :min="-1" placeholder="number" :defaultValue="100" />
      </a-form-item>
      <a-form-item :label="t('st.base.order_field')" name="order_field">
        <a-select ref="select" v-model:value="order_field" allowClear>
          <SelectOption :value="itm.value" :key="itm.label" v-for="itm in options.columns">{{
            t('st.columns.' + itm.label.toLowerCase())
          }}</SelectOption>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('st.base.order')" name="order">
        <a-select ref="select" v-model:value="order" allowClear>
          <SelectOption :value="itm.value" :key="itm.label" v-for="itm in OrderArray">
            {{ t('st.base.' + itm.label.toLowerCase()) }}
          </SelectOption>
        </a-select>
      </a-form-item>
    </div>
    <a-card size="small" :title="t('st.simple.filter_criteria')" class="grid grid-cols-1">
      <FieldList :data="fields!" :options="options" v-if="!jsonMode" />
      <CodeEditor v-model:value="jsonData" :mode="modeValue" v-if="jsonMode" />
      <template #extra
        ><a v-if="!jsonMode" @click="changeMode"> JSON </a
        ><a v-if="jsonMode" @click="changeMode"> VIEW </a></template
      >
    </a-card>
  </a-form>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Card, Form, FormItem, Select, SelectOption, InputNumber } from 'ant-design-vue';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';

  export default defineComponent({
    components: {
      [Card.name]: Card,
      [Form.name]: Form,
      [FormItem.name]: FormItem,
      [Select.name]: Select,
      [InputNumber.name]: InputNumber,
      CodeEditor,
    },
  });
</script>
<script lang="ts" setup>
  import { ref, toRefs } from 'vue';
  import { SearchBase, BaseOptions, OrderArray, Field } from '/@/api/st/model/base';
  import { FieldList } from '/@/components/FieldEditor';
  import { v4 as uuid4 } from 'uuid';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const props = defineProps({
    data: {
      type: Object as PropType<SearchBase<any>>,
      required: true,
    },
    options: {
      type: Object as PropType<BaseOptions>,
      required: true,
    },
    jsonOptions: {
      type: Object as PropType<{ jsonMode: boolean; jsonData: string }>,
      default: () => {
        return {
          jsonMode: false,
          jsonData: '[]',
        };
      },
    },
  });

  const { jsonData, jsonMode } = toRefs(props.jsonOptions);
  const { fields, offset, limit, order, order_field } = toRefs(props.data);
  const modeValue = ref<MODE>(MODE.JSON);

  const changeMode = () => {
    jsonMode.value = !jsonMode.value;
    if (jsonMode.value) {
      jsonData.value = JSON.stringify(cleanOption(fields.value!));
    } else if (!jsonMode.value) {
      fields.value = JSON.parse(jsonData.value);
      addOption(fields.value!);
    }
  };

  const addOption = (obj: Array<Field<any>>) => {
    delete obj[0].bop;
    obj.forEach((value: Field<any>) => {
      if (!value.uuid) {
        value.uuid = uuid4();
      }
      if (value.fields) {
        addOption(value.fields);
        value.options = {
          show: {
            add: false,
            del: false,
            addSub: false,
            clean: false,
            menu: false,
          },
        };
      }
    });
  };

  const cleanOption = (obj: Array<Field<any>>) => {
    return obj.filter((value: Field<any>) => {
      delete value.uuid;
      delete value.options;
      if (value.fields?.length) {
        value.fields = cleanOption(value.fields);
      }
      if (value.fields?.length) {
        return value;
      } else if (value.key) {
        return value;
      }
    });
  };
</script>
