<template>
  <div :key="dt.uuid" v-for="dt in dataLocal">
    <FieldBase :data="dt" :options="optionsNext" :is-phone="isPhone" v-if="!dt.fields" />
    <a-card
      :hoverable="true"
      :bordered="false"
      size="small"
      class="p-4"
      @mouseover="dt.options!.show.menu = true"
      @mouseleave="
        () => {
          dt.options!.show.menu = false;
          dt.options!.show.add = false;
          dt.options!.show.addSub = false;
          dt.options!.show.del = false;
        }
      "
      v-if="dt.fields"
    >
      <a-dropdown :trigger="['click']" class="p-1" v-if="dt.blop">
        <a class="ant-dropdown-link hover:underline" @click.prevent>
          {{ t('st.op.' + dt.blop.toLowerCase()) }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item :key="k.label" v-for="k in BlopArray">
              <a @click="dt.blop = k.value">{{ t('st.op.' + k.label.toLowerCase()) }}</a>
            </a-menu-item>
          </a-menu>
        </template> </a-dropdown
      >( <FieldList :data="dt.fields" :options="options" :uuid="dt.uuid" :del-sub="del" />
      <span class="p-2">)</span>
      <a-dropdown :trigger="['click']" class="p-1" v-if="isPhone">
        <a class="ant-dropdown-link" @click.prevent>
          <bars-outlined class="bg-blue-500" :style="{ fontSize: '16px', color: '#F0F8FF' }" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="del(dt)"><delete-outlined /> {{ t('st.base.delete') }}</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="add(dt)"><plus-outlined /> {{ t('st.base.add') }}</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="addSub(dt)">(+) {{ t('st.base.subSet') }}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a
        class="p-1"
        v-if="dt.options?.show.menu && !isPhone"
        @click="add(dt)"
        @mouseover="dt.options!.show.add = true"
        ><plus-outlined /> <span v-if="dt.options?.show.add">{{ t('st.base.add') }}</span></a
      >
      <a
        class="p-1"
        v-if="dt.options?.show.menu && !isPhone"
        @click="addSub(dt)"
        @mouseover="dt.options!.show.addSub = true"
        >(+) <span v-if="dt.options?.show.addSub">{{ t('st.base.subSet') }}</span></a
      >
      <a
        class="p-1"
        v-if="dt.options?.show.menu && !isPhone"
        @click="del(dt)"
        @mouseover="dt.options!.show.del = true"
        ><delete-outlined /> <span v-if="dt.options?.show.del">{{ t('st.base.delete') }}</span></a
      >
    </a-card>
  </div>
  <div class="col-span-1" v-if="dataLocal.length < 1">
    <a class="p-1" @click="addFirst()" @mouseover="show.add = true" @mouseleave="show.add = false"
      ><plus-outlined /> <span v-if="show.add && !isPhone">{{ t('st.base.add') }}</span></a
    >
  </div>
</template>
<script lang="ts">
  import { BaseOptions, Blop, BlopArray, Field } from '@/api/st/model/base';
  import { FieldBase, FieldList } from '@/components/FieldEditor';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BarsOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { Card, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { v4 as uuid4 } from 'uuid';
  import { PropType, defineComponent, ref } from 'vue';

  export default defineComponent({
    components: {
      ACard: Card,
      AMenu: Menu,
      AMenuItem: MenuItem,
      ADropdown: Dropdown,
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
        addSub: boolean;
        clean: boolean;
        menu: boolean;
      };
    };
  }
</script>
<script lang="ts" setup>
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
          addSub: false,
          clean: false,
          menu: false,
        };
      },
    },
    delSub: {
      type: Function,
      default: (v: any) => {
        console.log(v);
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

  const addFirst = () => {
    dataLocal.value.push({ uuid: uuid4() });
  };

  const add = (obj: Field<any>) => {
    const idx = dataLocal.value.findIndex((f) => obj.uuid == f.uuid);
    dataLocal.value.splice(idx + 1, 0, { uuid: uuid4(), blop: Blop.AND });
  };

  const addSub = (obj: Field<any>) => {
    const idx = dataLocal.value.findIndex((f) => obj.uuid == f.uuid);
    dataLocal.value.splice(idx + 1, 0, {
      uuid: uuid4(),
      blop: Blop.AND,
      fields: [{ uuid: uuid4() }],
      options: {
        show: {
          add: false,
          del: false,
          addSub: false,
          clean: false,
          menu: false,
        },
      },
    });
  };

  const del = (obj: Field<any>) => {
    dataLocal.value.forEach(function (item, index, arr) {
      if (item.uuid == obj.uuid) {
        arr.splice(index, 1);
        return;
      }
    });
    if (dataLocal.value.length == 0) {
      if (props.uuid && props.delSub) {
        props.delSub({ uuid: props.uuid });
      }
      return;
    }
    if (dataLocal.value[0].blop) {
      delete dataLocal.value[0].blop;
    }
  };

  const optionsNext = {
    columns: props.options.columns,
    columnsType: props.options.columnsType,
    actions: {
      add: add,
      addSub: addSub,
      del: del,
    },
  };
</script>
