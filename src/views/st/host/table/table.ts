import { HostColumnsArray, HostColumnsType } from '@/api/st/model/host';
import { BasicColumn, useTable } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';

import { getSourceData, requestDataForSearch } from '../search';

const { t } = useI18n();

const columns: BasicColumn[] = [
  {
    title: t('st.columns.id'),
    dataIndex: 'id',
    sorter: true,
    width: 120,
    defaultHidden: true,
  },
  {
    title: t('st.columns.organizer') + t('st.columns.city'),
    dataIndex: 'city',
    // align: 'left',
    width: 120,
  },
  {
    title: t('st.columns.record'),
    dataIndex: 'record',
    defaultHidden: true,
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.organizer') + t('st.columns.name'),
    dataIndex: 'organizer',
    align: 'left',
    width: 220,
  },
  {
    title: t('st.base.icp') + t('st.columns.site') + t('st.columns.name'),
    dataIndex: 'site',
    width: 220,
    align: 'left',
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.response') + t('st.columns.site') + t('st.columns.name'),
    dataIndex: 'titles',
    width: 220,
    align: 'left',
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.alive'),
    dataIndex: 'alive',
    width: 100,
    // sorter: true,
  },
  {
    title: t('st.columns.screenshot'),
    dataIndex: 'screenshot',
    width: 200,
  },
  {
    title: t('st.columns.tag'),
    dataIndex: 'tag',
    width: 220,
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.auto') + t('st.columns.tag'),
    dataIndex: 'auto_tag',
    width: 220,
    defaultHidden: true,
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.homepage'),
    dataIndex: 'homepage',
    width: 200,
    align: 'left',
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.active'),
    dataIndex: 'active',
    defaultHidden: true,
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.ip'),
    dataIndex: 'ip',
    defaultHidden: true,
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.note'),
    dataIndex: 'note',
    defaultHidden: true,
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.organizer') + t('st.columns.location'),
    dataIndex: 'location',
    align: 'left',
    width: 220,
    defaultHidden: true,
    // width: 120,
    // sorter: true,
  },
  {
    title: t('st.columns.alert_msg'),
    dataIndex: 'alert_msg',
    // defaultHidden: true,
    width: 200,
  },
  {
    title: t('st.columns.last_check'),
    dataIndex: 'last_check',
    width: 200,
    // width: 120,
    sorter: true,
  },
  {
    title: t('st.columns.created_time'),
    dataIndex: 'created_time',
    width: 200,
    // width: 120,
    sorter: true,
    defaultHidden: true,
  },
  {
    title: t('st.columns.created_user'),
    dataIndex: 'created_user',
    defaultHidden: true,
    // width: 120,
  },
  {
    title: t('st.columns.created_username'),
    dataIndex: 'created_username',
    defaultHidden: true,
    // width: 120,
  },
  {
    title: t('st.columns.license'),
    dataIndex: 'license',
    defaultHidden: true,
    width: 400,
  },
  {
    title: t('st.columns.response_body'),
    dataIndex: 'response_body',
    defaultHidden: true,
    width: 400,
  },
  {
    title: t('st.columns.keyword'),
    dataIndex: 'keywords',
    defaultHidden: true,
    width: 300,
  },
  {
    title: t('st.columns.alert'),
    dataIndex: 'alert',
    defaultHidden: true,
    width: 120,
  },
  {
    title: t('st.columns.executed_node'),
    dataIndex: 'executed_node',
    defaultHidden: true,
    width: 200,
  },
  {
    title: t('st.base.action'),
    dataIndex: 'action',
    fixed: 'right',
    width: 180,
  },
]; // 数据字段定义

export const columnsOptions = {
  columns: HostColumnsArray,
  columnsType: HostColumnsType,
}; // 字段设置

export const tableChangeHandle = async (pagination, filters, sorter) => {
  console.log(pagination);
  console.log(filters);
  console.log(sorter);

  requestDataForSearch.offset = (pagination.current - 1) * pagination.pageSize;
  requestDataForSearch.limit = pagination.pageSize;
  requestDataForSearch.order = sorter.order?.replace('end', '').toUpperCase();
  requestDataForSearch.order_field = sorter.field;

  await getSourceData(requestDataForSearch);
};

export const [
  registerTable,
  { setTableData, setPagination, setLoading, clearSelectedRowKeys, getSelectRows },
] = useTable({
  // title: '数据展示',
  columns: columns,
  dataSource: [],
  canResize: false,
  striped: false,
  bordered: true,
  showTableSetting: true,
  tableSetting: {
    redo: false,
  },
  pagination: {
    pageSize: 20,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
  },
  showIndexColumn: false,
  onChange: tableChangeHandle,
});
