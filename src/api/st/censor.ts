import { defHttp } from '/@/utils/http/axios';
import { SearchBase, WebResponse } from './model/base';
import { CensorColumns, Censor } from './model/censor';
import { WatchRecord } from './model/watch';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/api/censor/',
  SEND = '/api/censor/send',
  DELETE = '/api/censor/delete',
}

export function getCensorApi(params: SearchBase<CensorColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<Censor>>>(
    {
      url: Api.SEARCH,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteCensorApi(
  params: SearchBase<CensorColumns>,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
    {
      url: Api.DELETE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function sendCensorApi(
  params: { id: number; record: WatchRecord },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
    {
      url: Api.SEND,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
