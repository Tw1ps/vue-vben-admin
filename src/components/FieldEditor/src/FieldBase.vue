<template>
  <a-card
    :hoverable="true"
    :bordered="false"
    size="small"
    @mouseover="show.menu = true"
    @mouseleave="
      () => {
        show.menu = false;
        show.add = false;
        show.addSub = false;
        show.clean = false;
        show.del = false;
      }
    "
  >
    <a-input-group size="small">
      <a-dropdown
        :trigger="['click']"
        class="p-1 hover:underline"
        v-if="dataLocal.bop && !options.noOperator"
      >
        <a class="ant-dropdown-link" @click.prevent>
          {{ t('st.op.' + dataLocal.bop.toLowerCase()) }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item :key="k" v-for="k in BopArray">
              <a @click="dataLocal.bop = k.value">{{ t('st.op.' + k.label.toLowerCase()) }}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-dropdown :trigger="['click']" class="p-1 hover:underline">
        <a class="ant-dropdown-link" @click.prevent>
          {{ dataLocal.key ? t('st.columns.' + dataLocal.key.toLowerCase()) : '_?_' }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item :key="k.value" v-for="k in options.columns">
              <a @click="dataLocal.key = k.value">{{ t('st.columns.' + k.label.toLowerCase()) }}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-dropdown
        :trigger="['click']"
        class="p-1 hover:underline"
        v-if="dataLocal.key && !options.noOperator"
      >
        <a class="ant-dropdown-link" @click.prevent>
          {{
            dataLocal.operator
              ? t('st.op.' + dataLocal.operator.toLowerCase().replace(' ', '_'))
              : '_?_'
          }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item :key="k.label" v-for="k in OperatorArray">
              <a @click="dataLocal.operator = k.value">{{ t('st.op.' + k.label.toLowerCase()) }}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-date-picker
        v-if="options.columnsType!.datetime!.indexOf(dataLocal.key) > -1"
        v-model:value="dataLocal.value"
        :bordered="false"
        valueFormat="YYYY-MM-DDTHH:mm:ssZ[Z]"
        show-time
      />
      <a-space v-else-if="options.columnsType!.number!.indexOf(dataLocal.key) > -1" class="w-auto">
        <a-input-number
          :bordered="false"
          v-model:value="dataLocal.value"
          :min="-1"
          placeholder="number"
        />
      </a-space>
      <a-dropdown
        :trigger="['click']"
        class="p-1 hover:underline"
        v-else-if="options.columnsType!.boolean!.indexOf(dataLocal.key) > -1"
      >
        <a class="ant-dropdown-link" @click.prevent>
          {{ getBoolLabel(dataLocal.value) }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="dataLocal.value = true"> {{ t('st.op.true') }} </a>
            </a-menu-item>
            <a-menu-item>
              <a @click="dataLocal.value = false"> {{ t('st.op.false') }} </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-dropdown
        :trigger="['click']"
        class="p-1 hover:underline"
        v-else-if="dataLocal.key in options.columnsType!.select!"
      >
        <a class="ant-dropdown-link" @click.prevent>
          {{ dataLocal.value in options.columnsType!.select![dataLocal.key] }}
        </a>
        <template #overlay>
          <a-select ref="select" v-model:value="dataLocal.value" :bordered="false" allowClear>
            <SelectOption
              :value="options.columnsType!.select![dataLocal.key][v]"
              :key="v"
              v-for="v in options.columnsType!.select![dataLocal.key]"
            >
              {{ t('st.base.' + v.toLowerCase()) }}
            </SelectOption>
          </a-select>
        </template>
      </a-dropdown>
      <a-space v-else-if="dataLocal.key" class="transform translate-y-1.25 w-auto">
        <a-input :bordered="false" v-model:value="dataLocal.value" placeholder="string" />
      </a-space>
      <a-dropdown :trigger="['click']" class="p-1" v-if="isPhone">
        <a class="ant-dropdown-link" @click.prevent>
          <bars-outlined class="bg-blue-500" :style="{ fontSize: '16px', color: '#F0F8FF' }" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="options.actions.del(dataLocal)"
                ><delete-outlined /> {{ t('st.base.delete') }}</a
              >
            </a-menu-item>
            <a-menu-item v-if="data.value != null">
              <a @click="dataLocal.value = null"><close-outlined /> {{ t('st.base.setNull') }}</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="options.actions.add(dataLocal)"
                ><plus-outlined /> {{ t('st.base.add') }}</a
              >
            </a-menu-item>
            <a-menu-item v-if="!options.noOperator">
              <a @click="options.actions.addSub(dataLocal)">(+) {{ t('st.base.subSet') }}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a
        class="p-1"
        v-if="show.menu && !isPhone"
        @click="options.actions.add(dataLocal)"
        @mouseover="show.add = true"
        ><plus-outlined /> <span v-if="show.add">{{ t('st.base.add') }}</span></a
      >
      <a
        class="p-1"
        v-if="show.menu && !isPhone && !options.noOperator"
        @click="options.actions.addSub(dataLocal)"
        @mouseover="show.addSub = true"
        >(+) <span v-if="show.addSub">{{ t('st.base.subSet') }}</span></a
      >
      <a
        class="p-1"
        v-if="show.menu && !isPhone && data.value != null"
        @click="dataLocal.value = null"
        @mouseover="show.clean = true"
        ><close-outlined /> <span v-if="show.clean">{{ t('st.base.setNull') }}</span></a
      >
      <a
        class="p-1"
        v-if="show.menu && !isPhone"
        @click="options.actions.del(dataLocal)"
        @mouseover="show.del = true"
        ><delete-outlined /> <span v-if="show.del">{{ t('st.base.delete') }}</span></a
      >
    </a-input-group>
  </a-card>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PlusOutlined, CloseOutlined, BarsOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import {
    Card,
    Input,
    DatePicker,
    Menu,
    MenuItem,
    Dropdown,
    InputGroup,
    InputNumber,
    Space,
    Select,
    SelectOption,
  } from 'ant-design-vue';
  import { BaseOptions } from '/@/api/st/model/base';

  export default defineComponent({
    components: {
      [Card.name]: Card,
      [Input.name]: Input,
      [DatePicker.name]: DatePicker,
      [Menu.name]: Menu,
      [MenuItem.name]: MenuItem,
      [Dropdown.name]: Dropdown,
      [InputGroup.name]: InputGroup,
      [InputNumber.name]: InputNumber,
      [Space.name]: Space,
      [Select.name]: Select,
      [BarsOutlined.name]: BarsOutlined,
      [PlusOutlined.name]: PlusOutlined,
      [CloseOutlined.name]: CloseOutlined,
      [DeleteOutlined.name]: DeleteOutlined,
    },
  });

  interface Actions {
    add: Function;
    addSub: Function;
    del: Function;
  }

  export interface Options extends BaseOptions {
    noOperator?: boolean;
    actions: Actions;
  }
</script>
<script lang="ts" setup>
  import { PropType, ref } from 'vue';
  import { Field, BopArray, OperatorArray } from '/@/api/st/model/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const props = defineProps({
    data: {
      type: Object as PropType<Field<any>>,
      default: () => {},
      required: true,
    },
    options: {
      type: Object as PropType<Options>,
      required: true,
    },
    isPhone: {
      type: Boolean,
      default: false,
    },
  });

  const dataLocal = ref<Field<any>>(props.data);
  const isPhone = ref(false);

  const show = ref({
    add: false,
    del: false,
    addSub: false,
    clean: false,
    menu: false,
  });

  const getBoolLabel = (v: any) => {
    if (v == false) {
      return t('st.op.false');
    } else if (v == true) {
      return t('st.op.true');
    } else if (v != null) {
      return v;
    }
    return '_?_';
  };
</script>
