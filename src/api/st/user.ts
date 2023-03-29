import { defHttp } from '/@/utils/http/axios';
import { Field, Search, WebResponse } from './model/base';
import { UserColumns, User, UserColumnsUpdate, UserCreate } from './model/user';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/user/',
  CREATE = '/user/create',
  DELETE = '/user/delete',
  UPDATE = '/user/update',
}

export function getUserApi(data: Search<UserColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<User>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteUserApi(data: Search<UserColumns>, mode: ErrorMessageMode = 'modal') {
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

export function updateUserApi(
  data: { keyword: Search<UserColumns>; new_values: Array<Field<UserColumnsUpdate>> },
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

export function createUserApi(data: UserCreate, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<User>>(
    {
      url: Api.CREATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
