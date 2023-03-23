import { defHttp } from '/@/utils/http/axios';
import { Search, WebResponse } from './model/base';
import { SubscribeColumns, Subscribe, SubscribeCreate } from './model/subscribe';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/subscribe/',
  CREATE = '/subscribe/create',
  DELETE = '/subscribe/delete',
}

export function getSubscribeApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<Subscribe>>>(
    {
      url: Api.SEARCH,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteSubscribeApi(
  data: Search<SubscribeColumns>,
  mode: ErrorMessageMode = 'modal',
) {
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

export function createSubscribeApi(data: SubscribeCreate, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Subscribe>>(
    {
      url: Api.CREATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
