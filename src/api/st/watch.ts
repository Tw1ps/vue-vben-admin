import { defHttp } from '/@/utils/http/axios';
import { Field, Search, WebResponse } from './model/base';
import { WatchColumns, Watch, WatchCreate, WatchColumnsUpdate } from './model/watch';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/watch/',
  CREATE = '/watch/create',
  DELETE = '/watch/delete',
  UPDATE = '/watch/update',
}

export function getWatchApi(data: Search<WatchColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<Watch>>>(
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
  return defHttp.post<WebResponse<boolean>>(
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
  data: { keyword: Search<WatchColumns>; new_values: Array<Field<WatchColumnsUpdate>> },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
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
  params: { bot_id: number; hostname: string },
  data: WatchCreate,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<Watch>>(
    {
      url: Api.CREATE,
      params,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
