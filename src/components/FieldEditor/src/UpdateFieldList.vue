<template>
  <div :key="dt.uuid" v-for="dt in dataLocal">
    <UpdateField :data="dt" :options="optionsNext" :is-phone="isPhone" :getColumns="getColumns" />
  </div>
  <div class="col-span-1 p-2" v-if="dataLocal.length < options.columns.length">
    <a class="p-1" @click="add()" @mouseover="show.add = true" @mouseleave="show.add = false"
      ><plus-outlined /> <span v-if="show.add && !isPhone">{{ t('st.base.add') }}</span></a
    >
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PlusOutlined, CloseOutlined, BarsOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Card, Menu, MenuItem, Dropdown } from 'ant-design-vue';
  import { BaseOptions, Field } from '/@/api/st/model/base';
  import { UpdateField } from '/@/components/FieldEditor';

  export default defineComponent({
    components: {
      [Card.name]: Card,
      [Menu.name]: Menu,
      [MenuItem.name]: MenuItem,
      [Dropdown.name]: Dropdown,
      [BarsOutlined.name]: BarsOutlined,
      [PlusOutlined.name]: PlusOutlined,
      [CloseOutlined.name]: CloseOutlined,
      [DeleteOutlined.name]: DeleteOutlined,
    },
  });

  export interface FieldExt extends Field<any> {
    options?: {
      show: {
        add: boolean;
        del: boolean;
        clean: boolean;
        menu: boolean;
      };
    };
  }
</script>
<script lang="ts" setup>
  import { PropType, ref } from 'vue';
  import { v4 as uuid4 } from 'uuid';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const props = defineProps({
    data: {
      type: Object as PropType<Array<Field<any>>>,
      required: true,
    },
    options: {
      type: Object as PropType<BaseOptions>,
      required: true,
    },
    show: {
      type: Object,
      default: () => {
        return {
          add: false,
          del: false,
          clean: false,
          menu: false,
        };
      },
    },
    uuid: {
      type: String,
    },
  });

  const dataLocal = ref<Array<FieldExt>>(props.data);
  const show = ref(props.show);
  const isPhone = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  )
    ? true
    : false;

  const add = () => {
    dataLocal.value.splice(dataLocal.value.length + 1, 0, { uuid: uuid4() });
  };

  const del = (obj: Field<any>) => {
    dataLocal.value.forEach(function (item, index, arr) {
      if (item.uuid == obj.uuid) {
        arr.splice(index, 1);
        return;
      }
    });
  };

  const getColumns = () => {
    let tmpKeys = Array<string>();
    for (const f in dataLocal.value) {
      tmpKeys.push(dataLocal.value[f].key);
    }
    return props.options.columns.filter((v) => {
      if (tmpKeys.indexOf(v.value) > -1) {
        return false;
      }
      return true;
    });
  };

  const optionsNext = {
    columns: props.options.columns,
    columnsType: props.options.columnsType,
    actions: {
      del: del,
    },
  };
</script>
