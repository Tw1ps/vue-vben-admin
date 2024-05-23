import { UserColumnsArray, UserColumnsType } from '@/api/st/model/user';
import { BasicColumn, useTable } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';

import { getSourceData, requestDataForSearch } from '../search';

const { t } = useI18n();

const columns: BasicColumn[] = [
  {
    title: t('st.columns.id'),
    dataIndex: 'id',
    // defaultHidden: true,
    sorter: true,
    width: 120,
  },
  {
    title: t('st.columns.method'),
    dataIndex: 'action',
    width: 120,
  },
  {
    title: t('st.columns.path'),
    dataIndex: 'path',
    align: 'left',
  },
  {
    title: t('st.columns.data'),
    dataIndex: 'data',
    align: 'left',
  },
  {
    title: t('st.columns.username'),
    dataIndex: 'username',
    width: 120,
  },
  {
    title: t('st.columns.user_id'),
    dataIndex: 'user_id',
    defaultHidden: true,
    width: 200,
  },
  {
    title: t('st.columns.created_time'),
    dataIndex: 'created_time',
    width: 200,
    sorter: true,
  },
]; // 数据字段定义

export const columnsOptions = {
  columns: UserColumnsArray,
  columnsType: UserColumnsType,
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
