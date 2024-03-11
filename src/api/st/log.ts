import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';

enum Api {
  LOG = '/log/',
  LOGREAD = '/log/read',
  ALL_LOGGERS = '/log/all_loggers',
  SHOW_HANDLE = '/log/show_handle',
  ADD_HANDLE = '/log/add_handle',
  DEL_HANDLE = '/log/del_handle',
  COVER_HANDLE = '/log/cover_handle',
  SET_LEVEL = '/log/set_level',
}

export function getLogApi(keyword?: string, mode: ErrorMessageMode = 'modal') {
  let url = `${Api.LOG}`;
  if (keyword) {
    url = `${url}?keyword=${keyword}`;
  }
  return defHttp.post<Array<string>>(
    {
      url: url,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function readLogApi(filename: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<string>(
    {
      url: `${Api.LOGREAD}?filename=${filename}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getLogHandleApi(name: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: `${Api.SHOW_HANDLE}?name=${name}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function addLogHandleApi(name: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: `${Api.ADD_HANDLE}?name=${name}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function delLogHandleApi(name: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: `${Api.DEL_HANDLE}?name=${name}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function coverLogHandleApi(name: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: `${Api.COVER_HANDLE}?name=${name}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getAllLoggerApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.ALL_LOGGERS,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function setLogLevelApi(
  name: string,
  level: string | number,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post(
    {
      url: `${Api.SET_LEVEL}?name=${name}&level=${level}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}
