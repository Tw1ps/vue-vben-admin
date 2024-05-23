import { defHttp } from '@/utils/http/axios';
import { NodeInfo } from './model/system';
import { Datas } from './model/base';

import { ErrorMessageMode } from '#/axios';

enum Api {
  ALL = '/node/all',
  FULL = '/node/full',
  SINGLE = '/node/single',
  GETSETTING = '/node/setting',
  SETSETTING = '/node/setting/set',
  TASKLIST = '/node/tasklist',
  NETSTAT = '/node/netstat',
  SETTIME = '/node/set_time',
  LOG = '/node/log',
  LOGREAD = '/node/log/read',
  GETTHREADS = '/node/get_threads',
  GETPROCESS = '/node/get_process',
  GETASYNCTASK = '/node/get_async_task',
  CONNECTIONS = '/node/connections',
  LogAddHandle = '/node/add_handle',
  LogDelHandle = '/node/del_handle',
  LogShowHandle = '/node/show_handle',
  LogCoverHandle = '/node/cover_handle',
  LogSetLevel = '/node/set_level',
  GetAllLoggers = '/node/all_loggers',
}

export function getAllNodeApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Map<string, any>>(
    {
      url: Api.ALL,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getFullNodeApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Datas<Array<NodeInfo>>>(
    {
      url: Api.FULL,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getSingleNodeApi(
  cid: string | string[],
  start?: number,
  stop?: number,
  step?: number,
  mode: ErrorMessageMode = 'modal',
) {
  let url = `${Api.SINGLE}?cid=${cid}`;

  if (start) {
    url = url + '&start=' + start.toString();
  }
  if (stop) {
    url = url + '&stop=' + stop.toString();
  }
  if (step) {
    url = url + '&step=' + step.toString();
  }

  return defHttp.post<Datas<Array<NodeInfo>>>(
    {
      url: url,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getSettingApi(
  cid: string | string[],
  keyword?: string,
  mode: ErrorMessageMode = 'modal',
) {
  let url = `${Api.GETSETTING}?cid=${cid}`;
  if (keyword) {
    url = `${url}&keyword=${keyword}`;
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

export function setSettingApi(
  cid: string | string[],
  data: { key: string; value: any },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<boolean>(
    {
      url: `${Api.SETSETTING}?cid=${cid}&key=${data.key}&value=${data.value}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getThreadsApi(cid: string | string[], mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Array<string>>(
    {
      url: `${Api.GETTHREADS}?cid=${cid}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getProcessApi(cid: string | string[], mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Array<string>>(
    {
      url: `${Api.GETPROCESS}?cid=${cid}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getAsyncTaskApi(cid?: string | string[], mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Array<string>>(
    {
      url: `${Api.GETASYNCTASK}?cid=${cid}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getConnectionsApi(cid?: string | string[], mode: ErrorMessageMode = 'modal') {
  let url = Api.CONNECTIONS.toString();
  if (cid) {
    url = `${Api.CONNECTIONS}?cid=${cid}`;
  }
  return defHttp.post(
    {
      url: url,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function setTimeApi(
  cid: string | string[],
  timestamp: number,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<string>(
    {
      url: `${Api.SETTIME}?cid=${cid}&timestamp=${timestamp}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getTaskListApi(cid: string | string[], mode: ErrorMessageMode = 'modal') {
  return defHttp.post<string>(
    {
      url: `${Api.TASKLIST}?cid=${cid}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getNetStatApi(cid: string | string[], mode: ErrorMessageMode = 'modal') {
  return defHttp.post<string>(
    {
      url: `${Api.NETSTAT}?cid=${cid}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getLogApi(
  cid: string | string[],
  keyword?: string,
  mode: ErrorMessageMode = 'modal',
) {
  let url = `${Api.LOG}?cid=${cid}`;
  if (keyword) {
    url = `${url}&keyword=${keyword}`;
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

export function readLogApi(
  cid: string | string[],
  filename: string,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<string>(
    {
      url: `${Api.LOGREAD}?cid=${cid}&filename=${filename}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getLogHandleApi(name: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: `${Api.LogShowHandle}?name=${name}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function addLogHandleApi(name: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: `${Api.LogAddHandle}?name=${name}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function delLogHandleApi(name: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: `${Api.LogDelHandle}?name=${name}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function coverLogHandleApi(name: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: `${Api.LogCoverHandle}?name=${name}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getAllLoggerApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.GetAllLoggers,
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
      url: `${Api.LogSetLevel}?name=${name}&level=${level}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}
