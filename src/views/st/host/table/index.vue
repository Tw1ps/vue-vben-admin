<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'action'">
          <Flex wrap="wrap" gap="small">
            <a @click="handleClickGo(record.id)"><ProfileOutlined />{{ t('st.base.detail') }}</a>
            <a @click="EditTag(record.id, record.tag)"
              ><FormOutlined />{{ t('st.base.edit') + t('st.columns.tag') }}</a
            >
            <a @click="updateOne(record.id)" v-if="userInfo.rank <= 10"
              ><FormOutlined />{{ t('st.base.edit') }}</a
            >
            <Popconfirm
              title="确定删除吗？"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteOne(record)"
            >
              <a v-if="userInfo.rank <= 10"><DeleteOutlined />{{ t('st.base.delete') }}</a>
            </Popconfirm>
          </Flex>
        </template>
        <template v-if="column.key === 'ip'">
          {{ numberToIp(text) }}
        </template>
        <template v-if="column.key === 'alert_msg'">
          <div v-if="text">站点网页疑似被篡改</div>
        </template>
        <template v-if="column.key === 'active'">
          <Tag color="green" v-if="text">True</Tag>
          <Tag color="red" v-if="!text">False</Tag>
        </template>
        <template v-if="column.key === 'alive'">
          <Tag color="green" v-if="text">True</Tag>
          <Tag color="red" v-if="!text">False</Tag>
        </template>
        <template v-else-if="column.key === 'tag'">
          <Tooltip placement="bottom">
            <template v-if="text.length > 5" #title>
              <span
                ><Tag class="p-1" :color="getRandomColor()" :key="k" v-for="k in text">{{
                  k
                }}</Tag></span
              >
            </template>
            <Tag :color="getRandomColor()" :key="k" v-for="k in text.slice(0, 5)">{{ k }}</Tag
            ><span class="p-2" v-if="text.length > 5"> ... {{ text.length - 5 }} </span>
          </Tooltip>
        </template>
        <template v-else-if="column.key === 'titles'">
          <p :key="k" v-for="k in text">{{ k }}</p>
        </template>
        <template v-else-if="column.key === 'auto_tag'">
          <Tooltip placement="bottom">
            <template v-if="text.length > 5" #title>
              <span
                ><Tag class="p-1" :color="getRandomColor()" :key="k" v-for="k in text">{{
                  k
                }}</Tag></span
              >
            </template>
            <Tag :color="getRandomColor()" :key="k" v-for="k in text.slice(0, 15)">{{ k }}</Tag
            ><span class="p-2" v-if="text.length > 15"> ... {{ text.length - 15 }} </span>
          </Tooltip>
        </template>
        <template v-if="column.key === 'screenshot'">
          <div v-if="globSetting.ossUrl">
            <ImagePreview v-for="k in text" :key="k" :imageList="[globSetting.ossUrl + k]" />
          </div>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { ImagePreview } from '@/components/Preview';
  import { BasicTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useGlobSetting } from '@/hooks/setting';
  import { useUserStore } from '@/store/modules/user';
  import { DeleteOutlined, FormOutlined, ProfileOutlined } from '@ant-design/icons-vue';
  import { Popconfirm, Tag, Tooltip, Flex } from 'ant-design-vue';
  import { computed, defineComponent, onMounted } from 'vue';
  import { useGo } from '@/hooks/web/usePage';

  import { registerTable } from './table';

  import { deleteOne } from '../delete';
  import { updateOne, EditTag } from '../edit';
  import { getSourceData, requestDataForSearch } from '../search';

  export default defineComponent({
    name: 'TableShow',
    components: {
      BasicTable,
      Popconfirm,
      Tag,
      Tooltip,
      ImagePreview,
      Flex,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];

  const numberToIp = (number) => {
    if (!number) {
      return '';
    }

    const octet1 = (number >>> 24) & 255;
    const octet2 = (number >>> 16) & 255;
    const octet3 = (number >>> 8) & 255;
    const octet4 = number & 255;

    return `${octet1}.${octet2}.${octet3}.${octet4}`;
  };

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const go = useGo();

  const handleClickGo = (hid: number) => {
    // const { name } = unref(currentRoute);
    go('/data/host/detail/' + hid.toString());
  };

  onMounted(async () => {
    await getSourceData(requestDataForSearch);
  });

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);
  const globSetting = useGlobSetting();
</script>
