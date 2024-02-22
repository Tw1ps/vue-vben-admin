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
        v-if="dataLocal.blop && !options.noOperator"
      >
        <a class="ant-dropdown-link" @click.prevent>
          {{ t('st.op.' + dataLocal.blop.toLowerCase()) }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item :key="k.label" v-for="k in BlopArray">
              <a @click="dataLocal.blop = k.value">{{ t('st.op.' + k.label.toLowerCase()) }}</a>
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
          {{ dataLocal.op ? t('st.op.' + dataLocal.op.toLowerCase().replace(' ', '_')) : '_?_' }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item :key="k.label" v-for="k in OperatorArray">
              <a @click="dataLocal.op = k.value">{{ t('st.op.' + k.label.toLowerCase()) }}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-space v-if="dataLocal.op">
        <a-select
          v-if="dataLocal.op == Operator.IN || dataLocal.op == Operator.NOT_IN"
          style="width: 100%"
          :bordered="true"
          mode="tags"
          v-model:value="dataLocal.value"
          placeholder="array"
        />
        <a-date-picker
          v-else-if="
            options.columnsType!.datetime &&
            options.columnsType!.datetime.indexOf(dataLocal.key) > -1
          "
          v-model:value="dataLocal.value"
          :bordered="false"
          valueFormat="YYYY-MM-DDTHH:mm:ss"
          show-time
        />
        <a-input-number
          v-else-if="
            options.columnsType!.number && options.columnsType!.number.indexOf(dataLocal.key) > -1
          "
          :bordered="false"
          v-model:value="dataLocal.value"
          :min="-1"
          placeholder="number"
        />
        <a-dropdown
          :trigger="['click']"
          class="p-1 hover:underline"
          v-else-if="
            options.columnsType!.boolean && options.columnsType!.boolean.indexOf(dataLocal.key) > -1
          "
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
          v-else-if="options.columnsType!.select && dataLocal.key in options.columnsType!.select"
        >
          <a class="ant-dropdown-link" @click.prevent>
            {{
              dataLocal.value in options.columnsType!.select![dataLocal.key]
                ? t(
                    'st.enum.' +
                      options.columnsType!.select![dataLocal.key][dataLocal.value].toLowerCase(),
                  )
                : '_?_'
            }}
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item
                :key="v.label"
                v-for="v in createLabelArray(options.columnsType!.select![dataLocal.key])"
              >
                <a @click="dataLocal.value = v.value">{{
                  t('st.enum.' + v.label.toLocaleLowerCase())
                }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-input
          v-else-if="dataLocal.key"
          class="transform translate-y-1.25 w-auto"
          :bordered="false"
          v-model:value="dataLocal.value"
          placeholder="string"
        />
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
              <a @click="dataLocal.value = undefined"
                ><close-outlined /> {{ t('st.base.setNull') }}</a
              >
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
        @click="dataLocal.value = undefined"
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
  import { BarsOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import {
    Card,
    DatePicker,
    Dropdown,
    Input,
    InputGroup,
    InputNumber,
    Menu,
    MenuItem,
    Select,
    Space,
  } from 'ant-design-vue';
  import { defineComponent, PropType, ref } from 'vue';
  import {
    BaseOptions,
    BlopArray,
    Field,
    Operator,
    OperatorArray,
    createLabelArray,
  } from '@/api/st/model/base';

  import { useI18n } from '@/hooks/web/useI18n';

  export default defineComponent({
    components: {
      ACard: Card,
      AInput: Input,
      ADatePicker: DatePicker,
      AMenu: Menu,
      AMenuItem: MenuItem,
      ADropdown: Dropdown,
      AInputGroup: InputGroup,
      AInputNumber: InputNumber,
      ASpace: Space,
      ASelect: Select,
      [BarsOutlined.name]: BarsOutlined,
      [PlusOutlined.name]: PlusOutlined,
      [CloseOutlined.name]: CloseOutlined,
      [DeleteOutlined.name]: DeleteOutlined,
    },
  });
</script>
<script lang="ts" setup>
  interface Actions {
    add: Function;
    addSub: Function;
    del: Function;
  }

  interface Options extends BaseOptions {
    noOperator?: boolean;
    actions: Actions;
  }

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
  const isPhone = ref<Boolean>(props.isPhone);

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
