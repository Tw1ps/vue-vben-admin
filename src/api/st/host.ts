import { defHttp } from '/@/utils/http/axios';
import { Field, Search, WebResponse } from './model/base';
import { HostColumns, Host, HostCreate, HostColumnsUpdate } from './model/host';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/host/',
  CREATE = '/host/create',
  DELETE = '/host/delete',
  UPDATE = '/host/update',
}

export function getHostApi(data: Search<HostColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<Host>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteHostApi(data: Search<HostColumns>, mode: ErrorMessageMode = 'modal') {
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

export function updateHostApi(
  data: { keyword: Search<HostColumns>; new_values: Array<Field<HostColumnsUpdate>> },
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

export function createHostApi(data: HostCreate, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Host>>(
    {
      url: Api.CREATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
