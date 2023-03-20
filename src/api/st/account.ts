import { defHttp } from '/@/utils/http/axios';
import { Field, SearchBase, WebResponse } from './model/base';
import {
  AccountColumns,
  Account,
  AccountColumnsNative,
  AccountColumnsUpdate,
  AccountCreate,
} from './model/account';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/api/account/',
  CREATE = '/api/account/create',
  DELETE = '/api/account/delete',
  UPDATE = '/api/account/update',
}

export function getAccountApi(data: SearchBase<AccountColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<Account>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteAccountApi(
  data: SearchBase<AccountColumnsNative>,
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

export function updateAccountApi(
  data: { keyword: SearchBase<AccountColumns>; new_values: Array<Field<AccountColumnsUpdate>> },
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

export function createAccountApi(
  params: { hostname: string },
  data: AccountCreate,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<Account>>(
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
