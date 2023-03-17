<template>
  <div class="grid lg:grid-cols-10 h-full w-full sm:grid-cols-1">
    <div class="lg:col-span-7 p-4">
      <div class="grid lg:grid-cols-5 w-full lg:h-3/25">
        <a-card :hoverable="true" title="数据总数" size="small" class="lg:col-span-1"
          ><template #extra
            ><a-affix :offset-top="100"><filter-outlined @click="showModal" /></a-affix
            ><a-modal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
              <SearchForm :data="search" :options="wcOptions" :json-options="jsonOptions" />
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
    Alert,
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
      [Alert.name]: Alert,
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

  import { SearchBase } from '/@/api/model/baseModel';
  import { GoodsColumns, GoodsColumnsType, GoodsColumnsArray } from '/@/api/model/goods';
  import { SearchForm } from '/@/components/FieldEditor';

  const loading = ref<boolean>(true);

  // const afterVisibleChange = (bool: boolean) => {
  //   console.log('showSearchBar', bool);
  // };

  let search: SearchBase<GoodsColumns> = reactive({
    offset: 0,
    limit: -1,
    order: null,
    order_field: null,
    fields: [],
  });

  let jsonOptions = reactive({
    jsonMode: false,
    jsonData: '[]',
  });

  const visible = ref<boolean>(false);

  const showModal = () => {
    visible.value = true;
  };

  const handleOk = (e: MouseEvent) => {
    if (jsonOptions.jsonMode) {
      search.fields = JSON.parse(jsonOptions.jsonData);
      jsonOptions.jsonMode = !jsonOptions.jsonMode;
    }

    console.log(e);
    console.log(search);

    visible.value = false;
  };

  const wcOptions = {
    columns: GoodsColumnsArray,
    columnsType: GoodsColumnsType,
  };

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
