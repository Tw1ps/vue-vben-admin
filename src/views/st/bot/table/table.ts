import { BotColumnsArray, BotColumnsType } from '@/api/st/model/bot';
import { BasicColumn, useTable } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';

import { getSourceData, requestDataForSearch } from '../search';

const { t } = useI18n();

const columns: BasicColumn[] = [
  {
    title: t('st.columns.id'),
    dataIndex: 'id',
    sorter: true,
  },
  {
    title: t('st.columns.name'),
    dataIndex: 'name',
    align: 'left',
    width: 300,
  },
  {
    title: t('st.columns.apikey'),
    dataIndex: 'apikey',
    width: 500,
    defaultHidden: true,
  },
  {
    title: t('st.columns.security'),
    dataIndex: 'security',
    width: 500,
    defaultHidden: true,
  },
  {
    title: t('st.columns.ktype'),
    dataIndex: 'ktype',
  },
  {
    title: t('st.columns.provider'),
    dataIndex: 'provider',
  },
  {
    title: t('st.columns.active'),
    dataIndex: 'active',
    width: 120,
  },
  {
    title: t('st.columns.note'),
    dataIndex: 'note',
    align: 'left',
    width: 300,
  },
  {
    title: t('st.columns.at_user'),
    dataIndex: 'at_user',
  },
  {
    title: t('st.columns.user_id'),
    dataIndex: 'user_id',
    sorter: true,
    defaultHidden: true,
  },
  {
    title: t('st.columns.username'),
    dataIndex: 'username',
  },
  {
    title: t('st.base.action'),
    dataIndex: 'action',
    fixed: 'right',
    width: 180,
  },
]; // 数据字段定义

export const columnsOptions = {
  columns: BotColumnsArray,
  columnsType: BotColumnsType,
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
