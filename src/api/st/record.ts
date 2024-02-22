import { defHttp } from '@/utils/http/axios';
import { Field, Search, Datas } from './model/base';
import { RecordColumns, Record, RecordColumnsUpdate } from './model/record';

import { ErrorMessageMode } from '#/axios';

enum Api {
  SEARCH = '/record/',
  DELETE = '/record/delete',
  UPDATE = '/record/update',
}

export function getRecordApi(data: Search<RecordColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Datas<Array<Record>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
      timeout: 120000,
    },
  );
}

export function deleteRecordApi(data: Search<RecordColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<boolean>(
    {
      url: Api.DELETE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function updateRecordApi(
  data: { keyword: Search<RecordColumns>; values: Array<Field<RecordColumnsUpdate>> },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<boolean>(
    {
      url: Api.UPDATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
