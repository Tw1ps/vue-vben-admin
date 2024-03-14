import { defHttp } from '@/utils/http/axios';
import { NodeInfo } from './model/system';

import { ErrorMessageMode } from '#/axios';

enum Api {
  GETSETTING = '/system/setting',
  SETSETTING = '/system/setting/set',
  INFO = '/system/info',
  GETTHREADS = '/system/get_threads',
  GETPROCESS = '/system/get_process',
  GETASYNCTASK = '/system/get_async_task',
  SETSYSTEMTIME = '/system/set_time',
}

export function getSettingApi(keyword?: string, mode: ErrorMessageMode = 'modal') {
  let url = Api.GETSETTING.toString();
  if (keyword) {
    url = `${url}?keyword=${keyword}`;
  }
  return defHttp.post<Map<string, any>>(
    {
      url: url,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function setSettingApi(data: { key: string; value: any }, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<boolean>(
    {
      url: `${Api.SETSETTING}?key=${data.key}&value=${data.value}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getInfoApi(
  data: { start?: number; stop?: number; step?: number },
  mode: ErrorMessageMode = 'modal',
) {
  let url = Api.INFO.toString();
  let count = 0;

  if (data.start || data.stop || data.step) {
    url = url + '?';
  }
  if (data.start) {
    url = url + 'start=' + data.start.toString();
    count += 1;
  }
  if (data.stop) {
    if (count > 0) {
      url = url + '&';
    }
    url = url + 'stop=' + data.stop.toString();
    count += 1;
  }
  if (data.step) {
    if (count > 0) {
      url = url + '&';
    }
    url = url + 'step=' + data.step.toString();
    count += 1;
  }

  return defHttp.post<{ data: Array<NodeInfo>; count: number; total: number }>(
    {
      url: url,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getThreadsApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Array<string>>(
    {
      url: Api.GETTHREADS,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getProcessApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Array<string>>(
    {
      url: Api.GETPROCESS,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getAsyncTaskApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Array<string>>(
    {
      url: Api.GETASYNCTASK,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function setSystemTimeApi(timestamp: number, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<string>(
    {
      url: `${Api.SETSYSTEMTIME}&timestamp=${timestamp}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}
