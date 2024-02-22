<template>
  <a-card
    :hoverable="true"
    :bordered="false"
    size="small"
    @mouseover="show.menu = true"
    @mouseleave="
      () => {
        show.menu = false;
        show.clean = false;
        show.del = false;
      }
    "
  >
    <a-input-group size="small">
      <a-space>
        <a-dropdown :trigger="['click']" class="p-1 hover:underline">
          <a class="ant-dropdown-link" @click.prevent>
            {{ dataLocal.key ? t('st.columns.' + dataLocal.key.toLowerCase()) : '_?_' }}
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item :key="k.value" v-for="k in getColumns()">
                <a @click="dataLocal.key = k.value">{{
                  t('st.columns.' + k.label.toLowerCase())
                }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <span>{{ dataLocal.key ? '=' : '' }}</span>
        <a-input-password
          :bordered="false"
          v-model:value="dataLocal.value"
          v-if="dataLocal.key == 'password'"
          placeholder="password"
        />
        <a-date-picker
          class="w-auto"
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
          class="w-auto"
          v-else-if="
            options.columnsType!.number && options.columnsType!.number.indexOf(dataLocal.key) > -1
          "
          :bordered="false"
          v-model:value="dataLocal.value"
          :min="-1"
          placeholder="number"
        />
        <a-select
          v-else-if="
            options.columnsType!.array && options.columnsType!.array.indexOf(dataLocal.key) > -1
          "
          class="w-auto"
          :bordered="true"
          mode="tags"
          v-model:value="dataLocal.value"
          placeholder="Array"
        />
        <a-dropdown
          v-else-if="
            options.columnsType!.boolean && options.columnsType!.boolean.indexOf(dataLocal.key) > -1
          "
          :trigger="['click']"
          class="hover:underline w-auto"
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
          v-else-if="options.columnsType!.select && dataLocal.key in options.columnsType!.select"
          :trigger="['click']"
          class="hover:underline w-auto"
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
                v-for="v in createLabelArray(options.columnsType!.select![dataLocal.key])"
                :key="v.label"
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
          class="w-auto"
          :bordered="false"
          v-model:value="dataLocal.value"
          placeholder="string"
        />
        <a-dropdown :trigger="['click']" v-if="isPhone">
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
            </a-menu>
          </template>
        </a-dropdown>
        <a
          v-if="show.menu && !isPhone && data.value != null"
          @click="dataLocal.value = undefined"
          @mouseover="show.clean = true"
          ><close-outlined /> <span v-if="show.clean">{{ t('st.base.setNull') }}</span></a
        >
        <a
          v-if="show.menu && !isPhone"
          @click="options.actions.del(dataLocal)"
          @mouseover="show.del = true"
          ><delete-outlined /> <span v-if="show.del">{{ t('st.base.delete') }}</span></a
        >
      </a-space>
    </a-input-group>
  </a-card>
</template>
<script lang="ts">
  import { BaseOptions, Field, createLabelArray } from '@/api/st/model/base';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BarsOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import {
    Card,
    DatePicker,
    Dropdown,
    Input,
    InputGroup,
    InputNumber,
    InputPassword,
    Menu,
    MenuItem,
    Select,
    Space,
  } from 'ant-design-vue';
  import { PropType, defineComponent, ref } from 'vue';

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
      AInputPassword: InputPassword,
      ASpace: Space,
      ASelect: Select,
      [BarsOutlined.name]: BarsOutlined,
      [PlusOutlined.name]: PlusOutlined,
      [CloseOutlined.name]: CloseOutlined,
      [DeleteOutlined.name]: DeleteOutlined,
    },
  });

  interface Actions {
    del: Function;
  }

  export interface Options extends BaseOptions {
    actions: Actions;
  }
</script>
<script lang="ts" setup>
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
    getColumns: {
      type: Function,
      required: true,
    },
  });

  const dataLocal = ref<Field<any>>(props.data);
  const isPhone = ref<Boolean>(props.isPhone);

  const show = ref({
    del: false,
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
