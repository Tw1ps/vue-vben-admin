import { defHttp } from '@/utils/http/axios';
import { Field, Search, Datas } from './model/base';
import { WatchColumns, Watch, WatchCreate, WatchColumnsUpdate } from './model/watch';

import { ErrorMessageMode } from '#/axios';

enum Api {
  SEARCH = '/watch/',
  CREATE = '/watch/create',
  DELETE = '/watch/delete',
  UPDATE = '/watch/update',
}

export function getWatchApi(data: Search<WatchColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Datas<Array<Watch>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteWatchApi(data: Search<WatchColumns>, mode: ErrorMessageMode = 'modal') {
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

export function updateWatchApi(
  data: { keyword: Search<WatchColumns>; values: Array<Field<WatchColumnsUpdate>> },
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

export function createWatchApi(
  data: WatchCreate,
  hostname: string,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<Watch>(
    {
      url: `${Api.CREATE}?hostname=${hostname}`,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
