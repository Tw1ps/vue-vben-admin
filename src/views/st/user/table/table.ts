import { UserColumnsArray, UserColumnsType } from '@/api/st/model/user';
import { BasicColumn, useTable } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';

import { getSourceData, requestDataForSearch } from '../search';

const { t } = useI18n();

const columns: BasicColumn[] = [
  {
    title: t('st.columns.id'),
    dataIndex: 'id',
    defaultHidden: true,
    sorter: true,
  },
  {
    title: t('st.columns.username'),
    dataIndex: 'username',
    align: 'left',
  },
  {
    title: t('st.columns.nickname'),
    dataIndex: 'nickname',
    align: 'left',
  },
  {
    title: t('st.columns.email'),
    dataIndex: 'email',
    align: 'left',
  },
  {
    title: t('st.columns.active'),
    dataIndex: 'active',
    width: 120,
  },
  {
    title: t('st.columns.rank'),
    dataIndex: 'rank',
    width: 120,
    sorter: true,
  },
  {
    title: t('st.columns.note'),
    dataIndex: 'note',
  },
  {
    title: t('st.columns.last_login'),
    dataIndex: 'last_login',
    width: 200,
    sorter: true,
  },
  {
    title: t('st.columns.this_login'),
    dataIndex: 'this_login',
    width: 200,
    sorter: true,
  },
  {
    title: t('st.columns.updated_date'),
    dataIndex: 'updated_date',
    width: 200,
    sorter: true,
  },
  {
    title: t('st.columns.created_date'),
    dataIndex: 'created_date',
    width: 200,
    sorter: true,
  },
  {
    title: t('st.columns.license'),
    dataIndex: 'license',
    width: 300,
    defaultHidden: true,
  },
  {
    title: t('st.columns.license_rank'),
    dataIndex: 'license_rank',
    width: 120,
    defaultHidden: true,
  },
  {
    title: t('st.base.action'),
    dataIndex: 'action',
    fixed: 'right',
    width: 180,
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
