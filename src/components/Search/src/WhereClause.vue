<template>
  <a-input-group compact>
    <a-dropdown :trigger="['click']" class="p-1" v-if="data.bop">
      <a class="ant-dropdown-link" @click.prevent>
        {{ data.bop }}
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item :key="k" v-for="k in BopArray">
            <a @click="data.bop = k.value">{{ k.label }}</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-dropdown :trigger="['click']" class="p-1">
      <a class="ant-dropdown-link" @click.prevent>
        {{ data.key ? data.key : '_?_' }}
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item :key="k" v-for="k in columns">
            <a @click="data.key = k">{{ k }}</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-dropdown :trigger="['click']" class="p-1">
      <a class="ant-dropdown-link" @click.prevent>
        {{ data.operator ? data.operator : '_?_' }}
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item :key="k" v-for="k in OperatorArray">
            <a @click="data.operator = k.value">{{ k.value }}</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-date-picker
      v-if="dateColumns.indexOf(data.key) > -1"
      v-model:value="data.value"
      :bordered="false"
      valueFormat="YYYY-MM-DDTHH:mm:ssZ[Z]"
      show-time
    />
    <a-space v-else-if="numColumns.indexOf(data.key) > -1" class="w-auto">
      <a-input-number v-model:value="data.value" :min="-1" />
    </a-space>
    <a-dropdown :trigger="['click']" class="p-1" v-else-if="boolColumns.indexOf(data.key) > -1">
      <a class="ant-dropdown-link" @click.prevent>
        {{ getBoolLabel(data.value) }}
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a @click="data.value = true"> true </a>
          </a-menu-item>
          <a-menu-item>
            <a @click="data.value = false"> false </a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-space v-else class="w-auto">
      <a-input v-model:value="data.value" />
    </a-space>
    <a-dropdown :trigger="['click']" class="p-1">
      <a class="ant-dropdown-link text-gray-50 bg-blue-500" @click.prevent>
        <bars-outlined />
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a @click="delFunction(data)"><close-outlined /> 删除</a>
          </a-menu-item>
          <a-menu-item>
            <a @click="addFunction(data)"><plus-outlined /> 新增</a>
          </a-menu-item>
          <a-menu-item>
            <a @click="addSubFunction(data)">( ) 新增</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-input-group>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { FilterOutlined, PlusOutlined, CloseOutlined, BarsOutlined } from '@ant-design/icons-vue';
  import {
    Button,
    Affix,
    Card,
    Modal,
    Form,
    FormItem,
    Textarea,
    Row,
    Col,
    Select,
    Input,
    DatePicker,
    Menu,
    MenuItem,
    Dropdown,
    InputGroup,
    InputNumber,
    SelectOption,
    Checkbox,
    Space,
  } from 'ant-design-vue';

  export default defineComponent({
    components: {
      [Button.name]: Button,
      [Affix.name]: Affix,
      [Card.name]: Card,
      [Modal.name]: Modal,
      [Form.name]: Form,
      [FormItem.name]: FormItem,
      [Row.name]: Row,
      [Textarea.name]: Textarea,
      [Col.name]: Col,
      [Select.name]: Select,
      [Input.name]: Input,
      [DatePicker.name]: DatePicker,
      [Menu.name]: Menu,
      [MenuItem.name]: MenuItem,
      [Dropdown.name]: Dropdown,
      [InputGroup.name]: InputGroup,
      [InputNumber.name]: InputNumber,
      [Checkbox.name]: Checkbox,
      [Space.name]: Space,
      [BarsOutlined.name]: BarsOutlined,
      [SelectOption.name]: SelectOption,
      [FilterOutlined.name]: FilterOutlined,
      [PlusOutlined.name]: PlusOutlined,
      [CloseOutlined.name]: CloseOutlined,
    },
  });
</script>
<script lang="ts" setup>
  import { PropType, reactive } from 'vue';
  import { Field, BopArray, OperatorArray } from '/@/api/model/baseModel';

  const props = defineProps({
    data: {
      type: Object as PropType<Field<any>>,
      default: () => {},
      require: true,
    },
    subClause: { type: Boolean, default: false },
    columns: { type: Array<string>, default: () => [], require: true },
    dateColumns: { type: Array<string>, default: () => ['date'] },
    numColumns: { type: Array<string>, default: () => ['id', 'rank'] },
    boolColumns: { type: Array<string>, default: () => ['active'] },
    delFunction: {
      type: Function as unknown as () => { (obj: Field<any>) },
      default: (obj: Field<any>) => {
        console.log(obj);
      },
    },
    addFunction: {
      type: Function as unknown as () => { (obj: Field<any>) },
      default: (obj: Field<any>) => {
        console.log(obj);
      },
    },
    addSubFunction: {
      type: Function as unknown as () => { (obj: Field<any>) },
      default: (obj: Field<any>) => {
        console.log(obj);
      },
    },
  });

  const data = reactive<Field<any>>(props.data);

  const getBoolLabel = (v: any) => {
    if (v == false) {
      return v;
    } else if (v == true) {
      return v;
    }
    return '_?_';
  };
</script>
