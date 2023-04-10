<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="logger">
    <Layout class="menu-demo">
      <LayoutSider breakpoint="lg" collapsible>
        <Menu>
          <MenuItem v-for="item of log_list" :key="item" @click="handleClick(item)">
            {{ item }}
          </MenuItem>
        </Menu>
      </LayoutSider>
      <LayoutContent
        ><v-ace-editor
          v-model:value="content"
          lang="json"
          :options="{
            enableSnippets: true,
            fontSize: 14,
            tabSize: 4,
            showPrintMargin: false,
            highlightActiveLine: true,
            readOnly: true,
          }"
          theme="monokai"
          style="height: 850px; width: 100%"
      /></LayoutContent>
    </Layout>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Layout, LayoutSider, LayoutContent, Menu, MenuItem } from 'ant-design-vue';

  export default defineComponent({
    name: 'Logger',
    components: {
      Layout,
      LayoutSider,
      LayoutContent,
      Menu,
      MenuItem,
    },
  });
</script>
<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { getLogsApi } from '/@/api/st/log';
  import { useUserStore } from '/@/store/modules/user';
  import { VAceEditor } from 'vue3-ace-editor';
  import * as ace from 'ace-builds';
  import './ace-config';
  ace.config.set('basePath', '/static/src-min-noconflict/');

  function handleClick(values) {
    if (nowWatch) {
      content.value = '';
      sendWSPush({ stop_watch: nowWatch });
    }
    nowWatch = values;
    sendWSPush({ watch: nowWatch });
  }

  let Socket: WebSocket;
  let setIntervalWesocketPush;
  let url = 'ws://' + window.document.location.host + '/api/log/watch';

  let nowWatch: string;

  /**
   * 建立websocket连接
   * @param {string} url ws地址
   */
  const createSocket = (url) => {
    Socket && Socket.close();
    if (!Socket) {
      console.log('建立websocket连接');
      Socket = new WebSocket(url);
      Socket.onopen = onopenWS;
      Socket.onmessage = onmessageWS;
      Socket.onerror = onerrorWS;
      Socket.onclose = oncloseWS;
    } else {
      console.log('websocket已连接');
    }
  };

  /**打开WS之后发送心跳 */
  const onopenWS = () => {
    const userStore = useUserStore();
    const token = userStore.getToken;
    sendWSPush({ authorization: token });
    sendPing();
  };

  /**连接失败重连 */
  const onerrorWS = () => {
    Socket.close();
    clearInterval(setIntervalWesocketPush);
    console.log('连接失败重连中');
    if (Socket.readyState !== 3) {
      //   createSocket();
    }
  };

  /**WS数据接收统一处理 */
  const onmessageWS = (e) => {
    window.dispatchEvent(
      new CustomEvent('onmessageWS', {
        detail: {
          data: e.data,
        },
      }),
    );
  };

  /**
   * 发送数据但连接未建立时进行处理等待重发
   * @param {any} message 需要发送的数据
   */
  const connecting = (message) => {
    setTimeout(() => {
      if (Socket.readyState === 0) {
        connecting(message);
      } else {
        Socket.send(JSON.stringify(message));
      }
    }, 1000);
  };

  /**
   * 发送数据
   * @param {any} message 需要发送的数据
   */
  const sendWSPush = (message) => {
    if (Socket !== null && Socket.readyState === 3) {
      Socket.close();
      createSocket(url);
    } else if (Socket.readyState === 1) {
      Socket.send(JSON.stringify(message));
    } else if (Socket.readyState === 0) {
      connecting(message);
    }
  };

  /**断开重连 */
  const oncloseWS = () => {
    clearInterval(setIntervalWesocketPush);
    console.log('websocket已断开....正在尝试重连');
    if (Socket.readyState !== 2) {
      createSocket(url);
    }
  };

  const content = ref('');

  const getsocketData = (e) => {
    // 创建接收消息函数
    const raw = e && e.detail.data;
    if (raw) {
      const data = JSON.parse(raw);
      content.value += data.data;
    }
  };

  /**发送心跳
   * @param {number} time 心跳间隔毫秒 默认5000
   * @param {string} ping 心跳名称 默认字符串ping
   */
  const sendPing = (time = 5000, ping = 'ping') => {
    clearInterval(setIntervalWesocketPush);
    Socket.send(ping);
    setIntervalWesocketPush = setInterval(() => {
      Socket.send(JSON.stringify({ keepAlive: true }));
    }, time);
  };

  const log_list = ref<Array<string>>([]);

  async function getLogFiles() {
    const response = await getLogsApi();
    if (response.status == 1) {
      log_list.value = response.data!;
      log_list.value.reverse();
    } else {
      window['$message'].error('预期外响应');
    }
  }

  onMounted(async () => {
    await getLogFiles();
    createSocket(url);
    window.addEventListener('onmessageWS', getsocketData);
  });

  onBeforeUnmount(() => {
    Socket.close();
    window.removeEventListener('onmessageWS', getsocketData);
  });
</script>

<style lang="less" scoped>
  /* 修改光标颜色 */
  .ace_cursor {
    color: #fff !important;
  }

  .menu-demo {
    width: 100%;
    height: 850px;
    box-sizing: border-box;
    background-color: var(--color-neutral-2);
  }

  .menu-demo .arco-menu {
    width: 200px;
    height: 100%;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
  }

  .menu-demo .arco-menu :deep(.arco-menu-collapse-button) {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .menu-demo .arco-menu:not(.arco-menu-collapsed) :deep(.arco-menu-collapse-button) {
    right: 0;
    bottom: 8px;
    transform: translateX(50%);
  }

  .menu-demo .arco-menu:not(.arco-menu-collapsed)::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 48px;
    height: 48px;
    background-color: inherit;
    border-radius: 50%;
    box-shadow: -4px 0 2px var(--color-bg-2), 0 0 1px rgba(0, 0, 0, 0.3);
    transform: translateX(50%);
  }

  .menu-demo .arco-menu.arco-menu-collapsed {
    width: 48px;
    height: auto;
    padding-top: 24px;
    padding-bottom: 138px;
    border-radius: 22px;
  }

  .menu-demo .arco-menu.arco-menu-collapsed :deep(.arco-menu-collapse-button) {
    right: 8px;
    bottom: 8px;
  }
</style>
