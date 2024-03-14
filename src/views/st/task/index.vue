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
          <template #extra> {{ t('st.base.total') }}: {{ scheds.length }} </template>
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
                            <Popconfirm
                              :title="t('st.enum.pause')"
                              ok-text="Yes"
                              cancel-text="No"
                              @confirm="pauseSched(dt.sched.id)"
                            >
                              <a><PauseCircleOutlined />{{ t('st.enum.pause') }}</a>
                            </Popconfirm>
                          </MenuItem>
                          <MenuItem>
                            <Popconfirm
                              :title="t('st.base.resume')"
                              ok-text="Yes"
                              cancel-text="No"
                              @confirm="resumeSched(dt.sched.id)"
                            >
                              <a><RightCircleOutlined />{{ t('st.base.resume') }}</a>
                            </Popconfirm>
                          </MenuItem>
                          <MenuItem>
                            <Popconfirm
                              :title="t('st.base.delete')"
                              ok-text="Yes"
                              cancel-text="No"
                              @confirm="removeSched(dt.sched.id)"
                            >
                              <a><DeleteOutlined />{{ t('st.base.delete') }}</a>
                            </Popconfirm>
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
                  <Descriptions :column="1" :title="dt.name">
                    <template #extra>
                      <a @click="showModal(dt)">{{ t('st.base.add') + t('st.base.schedule') }}</a>
                    </template>
                    <DescriptionsItem :label="t('st.columns.id')">
                      {{ dt.id }}
                    </DescriptionsItem>
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

    <Modal v-model:open="openModal" :footer="null">
      <Card :title="t('st.base.add') + t('st.base.schedule') + t('st.base.task')" size="small">
        <Card class="!my-2" :bordered="true" :title="useTask.name" size="small" v-if="useTask">
          <p :key="txt" v-for="txt in useTask?.desc_args?.split('\n')">{{ txt }}</p>
        </Card>
        <Card :bordered="true" size="small">
          <Form>
            <FormItem :label="t('st.base.type')" name="type">
              <Select v-model:value="createData.type">
                <SelectOption :value="SchedType.DATE">{{
                  t('st.enum.' + SchedType.DATE)
                }}</SelectOption>
                <SelectOption :value="SchedType.CRON">{{
                  t('st.enum.' + SchedType.CRON)
                }}</SelectOption>
                <SelectOption :value="SchedType.INTERVAL">
                  {{ t('st.enum.' + SchedType.INTERVAL) }}
                </SelectOption>
                <SelectOption :value="SchedType.LOOP">{{
                  t('st.enum.' + SchedType.LOOP)
                }}</SelectOption>
                <SelectOption :value="SchedType.HURRY">
                  {{ t('st.enum.' + SchedType.HURRY) }}
                </SelectOption>
              </Select>
            </FormItem>
            <FormItem :label="t('st.columns.tactics')" name="tactics">
              <Select v-model:value="createData.tactics">
                <SelectOption :value="SchedTactics.IDLE">{{
                  t('st.enum.' + SchedTactics.IDLE)
                }}</SelectOption>
                <SelectOption :value="SchedTactics.PERFORMANCE">{{
                  t('st.enum.' + SchedTactics.PERFORMANCE)
                }}</SelectOption>
                <SelectOption :value="SchedTactics.LOCAL">{{
                  t('st.enum.' + SchedTactics.LOCAL)
                }}</SelectOption>
              </Select>
            </FormItem>
            <FormItem :label="t('st.columns.name')" name="name">
              <Input
                v-model:value="createData.name"
                :placeholder="t('st.columns.task') + t('st.columns.name')"
              />
            </FormItem>
            <FormItem :label="t('st.enum.single_limit')" name="single_limit">
              <Tooltip>
                <template #title>{{ t('st.desc.single_limit') }}</template>
                <InputNumber v-model:value="createData.single_limit" :keyboard="true" :min="1" />
              </Tooltip>
            </FormItem>
            <FormItem :label="t('st.enum.total_limit')" name="total_limit">
              <Tooltip>
                <template #title>{{ t('st.desc.total_limit') }}</template>
                <InputNumber v-model:value="createData.total_limit" :keyboard="true" :min="1" />
              </Tooltip>
            </FormItem>
            <FormItem :label="t('st.columns.timeout')" name="timeout">
              <InputNumber v-model:value="createData.timeout" :keyboard="true" />
            </FormItem>
            <FormItem :label="t('st.columns.cancel_threshold')" name="cancel_threshold">
              <Tooltip>
                <template #title>{{ t('st.desc.cancel_threshold') }}</template>
                <InputNumber v-model:value="createData.cancel_threshold" :min="0" :max="1" />
              </Tooltip>
            </FormItem>
            <FormItem :label="t('st.columns.note')" name="note">
              <Textarea v-model:value="createData.note" :placeholder="t('st.columns.note')" />
            </FormItem>
          </Form>
          <Form v-if="createData.type === SchedType.HURRY || createData.type === SchedType.LOOP">
            <!-- <FormItem :label="t('st.columns.args')" name="args">
              <Select mode="tags" v-model:value="kwds.args" />
            </FormItem> -->
            <Tooltip>
              <template #title>{{ t('st.desc.kwds_editor') }}</template>
              <FormItem :label="t('st.columns.kwds')" name="kwargs">
                <CodeEditor v-model:value="kwds.kwargs" :mode="MODE.JSON" />
              </FormItem>
            </Tooltip>
          </Form>
          <Form v-if="createData.type === SchedType.DATE">
            <FormItem :label="t('st.columns.run_date')" name="run_date">
              <DatePicker show-time v-model:value="dateKwds.run_date" />
            </FormItem>
            <FormItem :label="t('st.columns.timezone')" name="timezone">
              <Tooltip>
                <template #title>
                  <p :key="txt" v-for="txt in t('st.desc.timezone').split('。')">
                    {{ txt }}
                  </p>
                </template>
                <Input v-model:value="dateKwds.timezone" />
              </Tooltip>
            </FormItem>
            <!-- <FormItem :label="t('st.columns.args')" name="args">
              <Select mode="tags" v-model:value="kwds.args" />
            </FormItem> -->
            <Tooltip>
              <template #title>{{ t('st.desc.kwds_editor') }}</template>
              <FormItem :label="t('st.columns.kwds')" name="kwargs">
                <CodeEditor v-model:value="dateKwds.kwargs" :mode="MODE.JSON" />
              </FormItem>
            </Tooltip>
          </Form>
          <Form v-if="createData.type === SchedType.CRON">
            <!-- <FormItem :label="t('st.columns.args')" name="args">
              <Select mode="tags" v-model:value="kwds.args" />
            </FormItem> -->
            <Tooltip>
              <template #title>{{ t('st.desc.kwds_editor') }}</template>
              <FormItem :label="t('st.columns.kwds')" name="kwargs">
                <CodeEditor v-model:value="cronKwds.kwargs" :mode="MODE.JSON" />
              </FormItem>
            </Tooltip>
            <FormItem :label="t('st.columns.year')" name="year">
              <Input v-model:value="cronKwds.year" placeholder="2001" />
            </FormItem>
            <FormItem :label="t('st.columns.month')" name="month">
              <Input v-model:value="cronKwds.month" placeholder="1-5,6-12" />
            </FormItem>
            <FormItem :label="t('st.columns.day')" name="day">
              <Input v-model:value="cronKwds.day" placeholder="1,3,5-31" />
            </FormItem>
            <FormItem :label="t('st.columns.week')" name="week">
              <Input v-model:value="cronKwds.week" placeholder="1-53" />
            </FormItem>
            <FormItem :label="t('st.columns.day_of_week')" name="day_of_week">
              <Input v-model:value="cronKwds.day_of_week" placeholder="0-6, 3" />
            </FormItem>
            <FormItem :label="t('st.columns.hour')" name="hour">
              <Input v-model:value="cronKwds.hour" placeholder="0-23" />
            </FormItem>
            <FormItem :label="t('st.columns.minute')" name="minute">
              <Input v-model:value="cronKwds.minute" placeholder="0-59" />
            </FormItem>
            <FormItem :label="t('st.columns.second')" name="second">
              <Input v-model:value="cronKwds.second" placeholder="0-59 | */30" />
            </FormItem>
            <FormItem :label="t('st.columns.start_date')" name="start_date">
              <DatePicker show-time v-model:value="cronKwds.start_date" allowClear />
            </FormItem>
            <FormItem :label="t('st.columns.end_date')" name="end_date">
              <DatePicker show-time v-model:value="cronKwds.end_date" allowClear />
            </FormItem>
            <FormItem :label="t('st.columns.timezone')" name="timezone">
              <Tooltip>
                <template #title>
                  <p :key="txt" v-for="txt in t('st.desc.timezone').split('。')">
                    {{ txt }}
                  </p>
                </template>
                <Input v-model:value="cronKwds.timezone" />
              </Tooltip>
            </FormItem>
          </Form>
          <Form v-if="createData.type === SchedType.INTERVAL">
            <!-- <FormItem :label="t('st.columns.args')" name="args">
              <Select mode="tags" v-model:value="kwds.args" />
            </FormItem> -->
            <Tooltip>
              <template #title>{{ t('st.desc.kwds_editor') }}</template>
              <FormItem :label="t('st.columns.kwds')" name="kwargs">
                <CodeEditor v-model:value="intervalKwds.kwargs" :mode="MODE.JSON" />
              </FormItem>
            </Tooltip>
            <FormItem :label="t('st.columns.day')" name="days">
              <InputNumber v-model:value="intervalKwds.days" :keyboard="true" :min="0" />
            </FormItem>
            <FormItem :label="t('st.columns.week')" name="weeks">
              <InputNumber v-model:value="intervalKwds.weeks" :keyboard="true" :min="0" />
            </FormItem>
            <FormItem :label="t('st.columns.hour')" name="hours">
              <InputNumber v-model:value="intervalKwds.hours" :keyboard="true" :min="0" />
            </FormItem>
            <FormItem :label="t('st.columns.minute')" name="minute">
              <InputNumber v-model:value="intervalKwds.minutes" :keyboard="true" :min="0" />
            </FormItem>
            <FormItem :label="t('st.columns.second')" name="second">
              <InputNumber v-model:value="intervalKwds.seconds" :keyboard="true" :min="0" />
            </FormItem>
            <FormItem :label="t('st.columns.start_date')" name="start_date">
              <DatePicker show-time v-model:value="intervalKwds.start_date" allowClear />
            </FormItem>
            <FormItem :label="t('st.columns.end_date')" name="end_date">
              <DatePicker show-time v-model:value="intervalKwds.end_date" allowClear />
            </FormItem>
            <FormItem :label="t('st.columns.timezone')" name="timezone">
              <Tooltip>
                <template #title>
                  <p :key="txt" v-for="txt in t('st.desc.timezone').split('。')">
                    {{ txt }}
                  </p>
                </template>
                <Input v-model:value="intervalKwds.timezone" />
              </Tooltip>
            </FormItem>
          </Form>
          <Space>
            <Button type="primary" @click.prevent="confirmCreate">{{ t('st.base.add') }}</Button>
            <Button @click="resetFields">{{ t('st.base.reset') }}</Button>
          </Space>
        </Card>
      </Card>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { CodeEditor, MODE } from '@/components/CodeEditor';
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
    Modal,
    Form,
    FormItem,
    Select,
    SelectOption,
    Input,
    Textarea,
    InputNumber,
    DatePicker,
    Space,
    Button,
    Popconfirm,
  } from 'ant-design-vue';
  import {
    SettingOutlined,
    PauseCircleOutlined,
    RightCircleOutlined,
    DeleteOutlined,
  } from '@ant-design/icons-vue';
  import { defineComponent, onMounted, ref, reactive } from 'vue';

  import {
    getTaskApi,
    getWorkersApi,
    getLocksApi,
    getStatisticsApi,
    getTaskCountApi,
  } from '@/api/st/task';
  import {
    getSchedApi,
    addSchedApi,
    removeSchedApi,
    pauseSchedApi,
    resumeSchedApi,
  } from '@/api/st/schedule';
  import { Statistics, Task, Worker, TaskExecuteInfo } from '@/api/st/model/task';
  import {
    CronKwds,
    DateKwds,
    IntervalKwds,
    Kwds,
    SchedCache,
    SchedStatus,
    SchedTactics,
    SchedType,
    addSchedData,
  } from '@/api/st/model/schedule';

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
      Modal,
      Form,
      FormItem,
      Select,
      SelectOption,
      Input,
      Textarea,
      InputNumber,
      CodeEditor,
      DatePicker,
      Space,
      Button,
      Popconfirm,
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
  const openModal = ref<boolean>(false);
  const useTask = ref<Task>();

  const useForm = Form.useForm;
  const createData = reactive<addSchedData>({
    task_id: '',
    type: SchedType.CRON,
    name: undefined,
    note: undefined,
    tactics: SchedTactics.IDLE,
    single_limit: 1,
    total_limit: 1,
    timeout: undefined,
    cancel_threshold: 1,
  });
  const { resetFields, validate } = useForm(createData);

  const kwds = reactive<Kwds>({});
  const dateKwds = reactive<DateKwds>({ timezone: 'Asia/Shanghai' });
  const cronKwds = reactive<CronKwds>({ timezone: 'Asia/Shanghai' });
  const intervalKwds = reactive<IntervalKwds>({ timezone: 'Asia/Shanghai' });

  const sendCreateRequest = async (sched: addSchedData, data: Kwds) => {
    Object.entries(sched).forEach(([key, value]) => {
      if (value == '') sched[key] = null;
    });
    Object.entries(data).forEach(([key, value]) => {
      if (value == '') data[key] = null;
    });

    if (data.kwargs && typeof data.kwargs === 'string') data.kwargs = JSON.parse(data.kwargs);

    console.log(sched);
    console.log(data);

    await addSchedApi(sched, data);
  };

  const confirmCreate = async () => {
    validate()
      .then(async () => {
        let extKwds = kwds;
        if (createData.type === SchedType.CRON) extKwds = cronKwds;
        else if (createData.type === SchedType.DATE) extKwds = dateKwds;
        else if (createData.type === SchedType.INTERVAL) extKwds = intervalKwds;
        await sendCreateRequest(createData, extKwds);

        await getSched();
        openModal.value = !openModal.value;
      })
      .catch((identifier) => {
        console.log('error', identifier);
        message.error(identifier);
      });
  }; // 发起创建请求

  const showModal = (v: Task) => {
    console.log(v);
    useTask.value = v;
    createData.task_id = v.id;
    openModal.value = !openModal.value;
  };

  const removeSched = async (v: string) => {
    try {
      await removeSchedApi(v);
      await getSched();
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };
  const pauseSched = async (v: string) => {
    try {
      await pauseSchedApi(v);
      await getSched();
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };
  const resumeSched = async (v: string) => {
    try {
      await resumeSchedApi(v);
      await getSched();
    } catch (identifier: any) {
      message.error(identifier.toString());
    }
  };

  const getLocks = (id: string) => {
    if (!locks.value) return null;
    return locks.value[id];
  };
  const getStatistics = (id: string) => {
    if (!statistics.value) return [];
    if (id in statistics.value) return [statistics.value[id]];
    return [];
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

      scheds.value.splice(0, scheds.value.length);
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
