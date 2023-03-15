<!-- <template>
  <a-card size="small" title="筛选条件" class="grid grid-cols-1">
    <div :key="fie.key" v-for="fie in fieldList">
      <div>
        <a-input-group compact>
          <a-dropdown :trigger="['click']" class="p-1" v-if="fie.bop">
            <a class="ant-dropdown-link" @click.prevent>
              {{ fie.bop }}
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item :key="k.value" v-for="k in boolOperator">
                  <a @click="fie.bop = k.value">{{ k.label }}</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-dropdown :trigger="['click']" class="p-1">
            <a class="ant-dropdown-link" @click.prevent>
              {{ fie.key ? fie.key : '_?_' }}
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item :key="k.value" v-for="k in options">
                  <a @click="fie.key = k.value">{{ k.label }}</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-dropdown :trigger="['click']" class="p-1">
            <a class="ant-dropdown-link" @click.prevent>
              {{ fie.operator ? fie.operator : 'null' }}
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item :key="op.value" v-for="op in optionsOperator">
                  <a @click="fie.operator = op.value">{{ op.label }}</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-date-picker
            v-if="datetype.indexOf(fie.key) > -1"
            v-model:value="fie.value"
            :bordered="false"
            @change="onChange"
            @ok="onOk"
            show-time
          />
          <a-input v-else v-model:value="fie.value" style="width: 50%" />
          <a-dropdown :trigger="['click']" class="p-1">
            <a class="ant-dropdown-link text-gray-50 bg-blue-500" @click.prevent>
              <bars-outlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a><close-outlined /> 删除</a>
                </a-menu-item>
                <a-menu-item>
                  <a><plus-outlined /> 新增</a>
                </a-menu-item>
                <a-menu-item>
                  <a>( ) 新增</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-input-group>
      </div>
    </div>

    <div class="col-span-1" v-if="fieldList.length == 0">
      <a class="text-gray-50 p-1" @click="fclick"><plus-outlined class="bg-blue-500" /></a>
    </div>
  </a-card>
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
  import type { SelectProps } from 'ant-design-vue';
  import { Dayjs } from 'dayjs';

  import { Operator, Field, Bop } from '/@/api/model/baseModel';
  import { GoodsColumns } from '/@/api/dashBroad';

  export interface FieldOption {
    dateType: [];
  }

  const props = defineProps({
    data: { type: Array<Object> },
    options: { type: Object },
    /**
     * The theme of the current parent component
     */
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    /**
     * Whether to show title
     */
    showTitle: { type: Boolean, default: true },
    /**
     * The title is also displayed when the menu is collapsed
     */
    alwaysShowTitle: { type: Boolean },
  });

  console.log(props);

  const loading = ref<boolean>(true);

  // const afterVisibleChange = (bool: boolean) => {
  //   console.log('showSearchBar', bool);
  // };

  const fieldList: Array<Field<GoodsColumns>> = reactive([]);

  const options = ref<SelectProps['options']>([{ label: 'NULL', value: null }]);

  for (var v in GoodsColumns) {
    options.value?.push({ label: v, value: GoodsColumns[v] });
  }
  const datetype = [GoodsColumns.DATE, GoodsColumns.CREATED_DATE];

  const optionsOperator = ref<SelectProps['options']>([{ label: 'NULL', value: null }]);

  for (var v in Operator) {
    optionsOperator.value?.push({ label: Operator[v], value: Operator[v] });
  }

  const boolOperator = ref([{ label: 'NULL', value: null }]);
  for (var v in Bop) {
    boolOperator.value?.push({ label: v, value: Bop[v] });
  }

  const fclick = (k: any) => {
    console.log(k);
    fieldList.push({ operator: '==' });
  };

  const print = (v: any) => {
    console.log(v);
  };

  const onChange = (value: Dayjs, dateString: string) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const onOk = (value: Dayjs) => {
    console.log('onOk: ', value);
  };

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script> -->
