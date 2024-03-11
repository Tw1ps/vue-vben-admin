<template>
  <PageWrapper :title="t('st.page.task')">
    <div class="!my-2">
      <Flex horizontal>
        <Card
          class="w-full"
          :bordered="false"
          mode="small"
          :loading="loading"
          :title="t('st.base.schedule') + t('st.base.tasklist')"
        >
          <div class="h-190 overflow-x-auto">
            <Flex vertical>
              <Card
                class="!my-2 border-zinc-300"
                mode="small"
                :bordered="true"
                :key="dt.sched.id"
                v-for="dt in scheds"
              >
                <Descriptions :column="2" :title="dt.sched.name + ': ' + dt.sched.id">
                  <template #extra>
                    <Badge
                      status="processing"
                      :text="checkStatusText(dt.status)"
                      :color="checkStatus(dt.status)"
                    />
                  </template>
                  <!-- <DescriptionsItem :label="t('st.columns.id')">
                    {{ dt.sched.id }}
                  </DescriptionsItem> -->
                  <DescriptionsItem :label="t('st.base.rel') + t('st.base.task')" :span="2">
                    {{ dt.sched.task.name }}: {{ dt.sched.task.id }}
                  </DescriptionsItem>
                  <DescriptionsItem :label="t('st.columns.job')" :span="2">
                    {{ dt.job }}
                  </DescriptionsItem>
                  <DescriptionsItem :label="t('st.columns.ktype')">
                    {{ t('st.enum.' + dt.sched.type) }}
                  </DescriptionsItem>
                  <DescriptionsItem :label="t('st.columns.tactics')">
                    {{ t('st.enum.' + dt.sched.tactics) }}
                  </DescriptionsItem>
                  <DescriptionsItem :label="t('st.enum.single_limit')">
                    {{ dt.sched.single_limit }}
                  </DescriptionsItem>
                  <DescriptionsItem :label="t('st.enum.total_limit')">
                    {{ dt.sched.total_limit }}
                  </DescriptionsItem>
                </Descriptions>
                <Collapse ghost>
                  <CollapsePanel :header="t('st.columns.task') + t('st.columns.stat')">
                    <Card
                      mode="small"
                      :bordered="false"
                      :key="stat.id"
                      v-for="stat in getStatistics(dt.sched.id)"
                    >
                      <Descriptions>
                        <DescriptionsItem :label="t('st.columns.execute') + t('st.columns.count')">
                          {{ stat.run_count }}
                        </DescriptionsItem>
                        <DescriptionsItem :label="t('st.columns.last') + t('st.columns.execute')">
                          {{ stat.last_time }}
                        </DescriptionsItem>
                        <DescriptionsItem :label="t('st.enum.running') + t('st.columns.ing')">
                          {{ stat.running }}
                        </DescriptionsItem>
                      </Descriptions>
                      <div class="max-w-280 overflow-auto">
                        <Flex class="w-fit" horizontal>
                          <Card
                            class="!mx-2 border-zinc-300"
                            mode="small"
                            :bordered="true"
                            :key="nd.node"
                            v-for="nd in arrayStatLogs(stat)"
                          >
                            <Descriptions class="w-40" :column="1">
                              <DescriptionsItem :label="t('st.columns.node')">
                                {{ nd.node }}
                              </DescriptionsItem>
                              <DescriptionsItem :label="t('st.columns.elapsed')">
                                {{ toFixedTwo(nd.elapsed) }}
                              </DescriptionsItem>
                              <DescriptionsItem :label="t('st.enum.running') + t('st.columns.ing')">
                                {{ nd.running }}
                              </DescriptionsItem>
                              <DescriptionsItem :label="t('st.columns.msg')">
                                {{ nd.msg }}
                              </DescriptionsItem>
                            </Descriptions>
                          </Card>
                        </Flex>
                      </div>
                    </Card>
                  </CollapsePanel>
                </Collapse>
                <template #actions>
                  <div class="text-black">
                    {{ t('st.columns.lock_time') }}: {{ getLocks(dt.sched.id) }}
                  </div>
                  <div class="text-black">
                    {{ t('st.columns.execute') + t('st.columns.ing') }}:
                    {{ getTaskCount(dt.sched.id) }}
                  </div>
                  <div class="text-black">
                    <Dropdown trigger="click">
                      <SettingOutlined />
                      <template #overlay>
                        <Menu>
                          <MenuItem>
                            <a><PauseCircleOutlined /> 暂停</a>
                          </MenuItem>
                          <MenuItem>
                            <a><RightCircleOutlined /> 恢复</a>
                          </MenuItem>
                          <MenuItem>
                            <a><DeleteOutlined /> 删除</a>
                          </MenuItem>
                        </Menu>
                      </template>
                    </Dropdown>
                  </div>
                </template>
              </Card>
            </Flex>
          </div>
        </Card>
        <Card
          class="!mx-2 w-3/7"
          :bordered="false"
          mode="small"
          :loading="loading"
          :title="t('st.base.tasklist')"
        >
          <template #extra> {{ t('st.base.total') }}: {{ data.length }} </template>
          <div class="h-190 overflow-x-auto">
            <Flex vertical>
              <Card
                class="!my-2 border-zinc-300"
                mode="small"
                :bordered="true"
                :key="dt.id"
                v-for="dt in data"
              >
                <Tooltip>
                  <template #title v-if="dt.desc_args">
                    <p>{{ dt.desc_args }}</p>
                  </template>
                  <Descriptions :column="1" :title="dt.name + ': ' + dt.id">
                    <template #extra>
                      <a>{{ t('st.base.add') + t('st.base.schedule') }}</a>
                    </template>
                    <!-- <DescriptionsItem :label="t('st.columns.id')">
                      {{ dt.id }}
                    </DescriptionsItem> -->
                    <DescriptionsItem :label="t('st.columns.desc')">
                      {{ dt.desc }}
                    </DescriptionsItem>
                    <DescriptionsItem
                      :label="t('st.columns.required_memory')"
                      v-if="dt.required_memory"
                    >
                      {{ toFixedTwo(dt.required_memory / 1024 / 1024) }}MB
                    </DescriptionsItem>
                    <DescriptionsItem :label="t('st.columns.required_os')" v-if="dt.required_os">
                      {{ dt.required_os }}
                    </DescriptionsItem>
                    <DescriptionsItem :label="t('st.columns.note')" v-if="dt.note">
                      {{ dt.note }}
                    </DescriptionsItem>
                  </Descriptions>
                </Tooltip>
              </Card>
            </Flex>
          </div>
        </Card>
      </Flex>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    message,
    Flex,
    Card,
    Descriptions,
    DescriptionsItem,
    Tooltip,
    Badge,
    Collapse,
    CollapsePanel,
    Dropdown,
    Menu,
    MenuItem,
  } from 'ant-design-vue';
  import {
    SettingOutlined,
    PauseCircleOutlined,
    RightCircleOutlined,
    DeleteOutlined,
  } from '@ant-design/icons-vue';
  import { defineComponent, onMounted, ref } from 'vue';

  import {
    getTaskApi,
    getWorkersApi,
    getLocksApi,
    getStatisticsApi,
    getTaskCountApi,
  } from '@/api/st/task';
  import { getSchedApi } from '@/api/st/schedule';
  import { Statistics, Task, Worker, TaskExecuteInfo } from '@/api/st/model/task';
  import { SchedCache, SchedStatus } from '@/api/st/model/schedule';

  export default defineComponent({
    name: 'Task',
    components: {
      PageWrapper,
      Flex,
      Card,
      Descriptions,
      DescriptionsItem,
      Tooltip,
      Badge,
      Collapse,
      CollapsePanel,
      Dropdown,
      Menu,
      MenuItem,
    },
  });
</script>
<script lang="ts" setup>
  const { t } = useI18n();

  const data = ref<Array<Task>>([]);
  const loading = ref<boolean>(true);
  const scheds = ref<Array<SchedCache>>([]);
  const workers = ref<Map<string, Worker>>();
  const locks = ref<Map<string, Date>>();
  const statistics = ref<Map<string, Statistics>>();
  const taskCount = ref<Map<string, number>>();

  const getLocks = (id: string) => {
    if (!locks.value) return null;
    return locks.value[id];
  };
  const getStatistics = (id: string) => {
    if (!statistics.value) return null;
    return [statistics.value[id]];
  };
  const getTaskCount = (id: string) => {
    if (!taskCount.value) return null;
    return taskCount.value[id];
  };

  const arrayStatLogs = (obj: Statistics) => {
    const result: Array<TaskExecuteInfo> = [];
    Object.entries(obj.logs).forEach(([key, value]) => {
      result.push(value);
    });
    return result;
  };

  const checkStatus = (v: string) => {
    if (v === SchedStatus.PENDING) return '#8b98b0';
    if (v === SchedStatus.RUNNING) return 'green';
    if (v === SchedStatus.FINISHED) return 'red';
    return 'yellow';
  };

  const checkStatusText = (v: string) => {
    if (v === SchedStatus.PAUSE) return t('st.enum.pause');
    if (v === SchedStatus.RUNNING) return t('st.enum.running');
    if (v === SchedStatus.FINISHED) return t('st.enum.finished');
    return t('st.enum.pending');
  };

  const toFixedTwo = (value, fix: number = 2) => {
    return Number(value.toFixed(fix));
  };

  const getSched = async () => {
    try {
      const result = await getSchedApi();
      console.log(result);

      Object.entries(result).forEach(([key, value]) => {
        scheds.value.push(value);
      });

      locks.value = await getLocksApi();
      console.log(locks.value);
      statistics.value = await getStatisticsApi();
      console.log(statistics.value);
      taskCount.value = await getTaskCountApi();
      console.log(taskCount.value);
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };

  // 获取数据请求
  const getSourceData = async () => {
    try {
      loading.value = true;
      const result = await getTaskApi();
      console.log(result);

      Object.entries(result).forEach(([key, value]) => {
        data.value.push(value);
      });
    } catch (identifier: any) {
      message.error(identifier.toString());
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await getSourceData();
    await getSched();

    workers.value = await getWorkersApi();
    console.log(workers.value);
  });
</script>
