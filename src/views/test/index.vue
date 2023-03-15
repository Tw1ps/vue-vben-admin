<template>
  <div class="grid lg:grid-cols-10 h-full w-full sm:grid-cols-1">
    <div class="lg:col-span-7 p-4">
      <div class="grid lg:grid-cols-5 w-full lg:h-3/25">
        <a-card :hoverable="true" title="数据总数" size="small" class="lg:col-span-1"
          ><template #extra
            ><a-affix :offset-top="100"><filter-outlined @click="showModal" /></a-affix
            ><a-modal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
              <a-form :model="search" :rules="rules" layout="vertical">
                <div class="grid lg:grid-cols-2 sm:grid-cols-1 p-4">
                  <a-form-item label="Offset" name="offset">
                    <a-input v-model:value="search.offset" placeholder="Please enter offset" />
                  </a-form-item>
                  <a-form-item label="Limit" name="limit">
                    <a-input v-model:value="search.limit" placeholder="Please enter limit" />
                  </a-form-item>
                  <a-form-item label="Order Field" name="order_field">
                    <a-select v-model:value="search.order_field" :options="options" />
                  </a-form-item>
                  <a-form-item label="Order" name="order">
                    <a-input v-model:value="search.order" placeholder="Please enter order" />
                  </a-form-item>
                  <!-- <a-form-item label="Fields" name="fields">
                    <a-input v-model:value="search.fields" placeholder="Please enter fields" />
                  </a-form-item> -->
                </div>
                <div>
                  <a-card size="small" title="筛选条件" class="grid grid-cols-1">
                    <div :key="fie.uuid" v-for="fie in fieldList">
                      <WhereClause
                        :data="fie"
                        :columns="cols"
                        :date-columns="datecols"
                        :bool-columns="boolcols"
                        :del-function="deleteField"
                        :add-function="addField"
                      />
                    </div>

                    <div class="col-span-1" v-if="fieldList.length == 0">
                      <a class="text-gray-50 p-1" @click="fclick"
                        ><plus-outlined class="bg-blue-500"
                      /></a>
                    </div>
                  </a-card>
                </div>
              </a-form>
            </a-modal>
          </template>
        </a-card>
        <a-card :hoverable="true" title="最新数据" size="small" class="lg:col-span-4 w-full" />
      </div>
      <TestPageC class="!my-2 w-full lg:h-47/100" />
      <TestPage class="!my-2 w-full lg:h-2/5" />
    </div>
    <div class="lg:col-span-3 p-4">
      <TestPageA class="lg:h-2/6 w-full" />
      <TestPageB class="lg:h-4/6 w-full !my-2" />
    </div>
  </div>
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
    SelectOption,
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
      [BarsOutlined.name]: BarsOutlined,
      [SelectOption.name]: SelectOption,
      [FilterOutlined.name]: FilterOutlined,
      [PlusOutlined.name]: PlusOutlined,
      [CloseOutlined.name]: CloseOutlined,
    },
  });
</script>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import TestPage from './components/grouped.vue';
  import TestPageA from './components/pie.vue';
  import TestPageB from './components/hot.vue';
  import TestPageC from './components/tree.vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import type { SelectProps } from 'ant-design-vue';
  import { v4 as uuid4 } from 'uuid';

  import { SearchBase, Operator, Field, Bop } from '/@/api/model/baseModel';
  import { GoodsColumns } from '/@/api/dashBroad';
  import { WhereClause } from '/@/components/Search';

  const loading = ref<boolean>(true);

  // const afterVisibleChange = (bool: boolean) => {
  //   console.log('showSearchBar', bool);
  // };

  const search: SearchBase<GoodsColumns> = reactive({
    offset: 0,
    limit: -1,
  });

  const fieldList = ref<Array<Field<GoodsColumns>>>([]);

  const options = ref<SelectProps['options']>([{ label: 'NULL', value: null }]);
  const cols: Array<string> = reactive([]);

  for (var v in GoodsColumns) {
    options.value?.push({ label: v, value: GoodsColumns[v] });
    cols.push(GoodsColumns[v]);
  }
  const datecols = [GoodsColumns.DATE, GoodsColumns.CREATED_DATE];
  const boolcols = [GoodsColumns.UNIQUE_HASH, GoodsColumns.INFO];

  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: 'Please enter user name' }],
    url: [{ required: true, message: 'please enter url' }],
    owner: [{ required: true, message: 'Please select an owner' }],
    type: [{ required: true, message: 'Please choose the type' }],
    approver: [{ required: true, message: 'Please choose the approver' }],
    dateTime: [{ required: true, message: 'Please choose the dateTime', type: 'object' }],
    description: [{ required: true, message: 'Please enter url description' }],
  };

  const visible = ref<boolean>(false);

  const showModal = () => {
    visible.value = true;
  };

  const handleOk = (e: MouseEvent) => {
    console.log(e);
    console.log(search);
    console.log(fieldList);
    visible.value = false;
  };

  const fclick = (k: any) => {
    console.log(k);
    fieldList.value.push({ uuid: uuid4(), key: GoodsColumns.ID, operator: Operator.EQ });
  };

  const deleteField = (obj: Field<GoodsColumns>) => {
    console.log(obj);
    fieldList.value = fieldList.value.filter((f) => f.uuid != obj.uuid);
    console.log(fieldList.value);
  };

  const addField = (obj: Field<GoodsColumns>) => {
    console.log(obj);
    fieldList.value.push({ uuid: uuid4(), bop: Bop.AND });
  };

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
