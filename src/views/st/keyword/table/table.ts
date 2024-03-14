import { KeywordColumnsArray, KeywordColumnsType } from '@/api/st/model/keyword';
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
  },
  {
    title: t('st.columns.keyword'),
    dataIndex: 'keyword',
    // width: 500,
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
    title: t('st.columns.created_user'),
    dataIndex: 'created_user',
    defaultHidden: true,
    width: 200,
  },
  {
    title: t('st.columns.created_username'),
    dataIndex: 'created_username',
    width: 150,
    // defaultHidden: true,
  },
  {
    title: t('st.columns.license'),
    dataIndex: 'license',
    width: 200,
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
  columns: KeywordColumnsArray,
  columnsType: KeywordColumnsType,
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
