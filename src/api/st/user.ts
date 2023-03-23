import { defHttp } from '/@/utils/http/axios';
import { Field, Search, WebResponse } from './model/base';
import {
  UserColumns,
  User,
  UserCreate,
  UserColumnsUpdate,
  AdvancedUserCreate,
  AdvancedUserColumnsUpdate,
} from './model/user';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/user/',
  CREATE = '/user/create',
  CREATEADVANCED = '/user/create/advanced',
  DELETE = '/user/delete',
  UPDATE = '/user/update',
  UPDATEADVANCED = '/user/update/advanced',
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
  params: { id: number },
  data: Array<Field<UserColumnsUpdate>>,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
    {
      url: Api.UPDATE,
      params,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function updateUserAdvancedApi(
  data: { keyword: Search<UserColumns>; new_values: Array<Field<AdvancedUserColumnsUpdate>> },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
    {
      url: Api.UPDATEADVANCED,
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

export function createUserAdvancedApi(data: AdvancedUserCreate, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<User>>(
    {
      url: Api.CREATEADVANCED,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
