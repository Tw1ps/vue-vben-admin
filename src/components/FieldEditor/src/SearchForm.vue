<script lang="ts">
  import { BaseOptions, Field, OrderArray, Search } from '@/api/st/model/base';
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { FieldList } from '@/components/FieldEditor';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card, Form, FormItem, InputNumber, Select, SelectOption } from 'ant-design-vue';
  import { v4 as uuid4 } from 'uuid';
  import { defineComponent, ref, toRefs } from 'vue';

  export default defineComponent({
    components: {
      ACard: Card,
      AForm: Form,
      AFormItem: FormItem,
      ASelect: Select,
      AInputNumber: InputNumber,
      CodeEditor,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const props = defineProps({
    data: {
      type: Object as PropType<Search<any>>,
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
    showOffset: {
      type: Boolean,
      default: true,
    },
    showOrder: {
      type: Boolean,
      default: true,
    },
    showFields: {
      type: Boolean,
      default: true,
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
    if (obj.length == 0) {
      return;
    }
    delete obj[0].blop;
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

<template>
  <a-form :model="data" layout="vertical">
    <div class="grid lg:grid-cols-2 sm:grid-cols-1 p-4">
      <a-form-item :label="t('st.base.offset')" name="offset" v-if="showOffset">
        <a-input-number v-model:value="offset" :min="0" placeholder="number" :defaultValue="0" />
      </a-form-item>
      <a-form-item :label="t('st.base.limit')" name="limit" v-if="showOffset">
        <a-input-number v-model:value="limit" :min="-1" placeholder="number" :defaultValue="100" />
      </a-form-item>
      <a-form-item :label="t('st.base.order_field')" name="order_field" v-if="showOrder">
        <a-select ref="select" v-model:value="order_field" allowClear>
          <SelectOption :value="itm.value" :key="itm.label" v-for="itm in options.columns">{{
            t('st.columns.' + itm.label.toLowerCase())
          }}</SelectOption>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('st.base.order')" name="order" v-if="showOrder">
        <a-select ref="select" v-model:value="order" allowClear>
          <SelectOption :value="itm.value" :key="itm.label" v-for="itm in OrderArray">
            {{ t('st.base.' + itm.label.toLowerCase()) }}
          </SelectOption>
        </a-select>
      </a-form-item>
    </div>
    <a-card
      size="small"
      :title="t('st.simple.filter_criteria')"
      class="grid grid-cols-1"
      v-if="showFields"
    >
      <FieldList :data="fields!" :options="options" v-if="!jsonMode" />
      <CodeEditor v-model:value="jsonData" :mode="modeValue" v-if="jsonMode" />
      <template #extra
        ><a v-if="!jsonMode" @click="changeMode"> JSON </a
        ><a v-if="jsonMode" @click="changeMode"> VIEW </a></template
      >
    </a-card>
  </a-form>
</template>
