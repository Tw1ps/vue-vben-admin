import { defHttp } from '/@/utils/http/axios';
import { Search, WebResponse } from './model/base';
import { CensorColumns, Censor } from './model/censor';
import { WatchRecord } from './model/watch';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/censor/',
  SEND = '/censor/send',
  DELETE = '/censor/delete',
}

export function getCensorApi(data: Search<CensorColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<Censor>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteCensorApi(data: Search<CensorColumns>, mode: ErrorMessageMode = 'modal') {
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

export function sendCensorApi(
  params: { id: number; record: WatchRecord },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
    {
      url: Api.SEND + `?id=${params.id}&record=${params.record}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}
