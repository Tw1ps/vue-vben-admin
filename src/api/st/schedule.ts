import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';

import { SchedCache, addSchedData, DateKwds, CronKwds, IntervalKwds, Kwds } from './model/schedule';

enum Api {
  SCHEDCACHE = '/schedule/',
  ADD = '/schedule/add',
  PAUSE = '/schedule/pause',
  REMOVE = '/schedule/remove',
  RESUME = '/schedule/resume',
}

function convertToQueryString(data: addSchedData): string {
  const params = new URLSearchParams();

  // 添加每个属性的键值对
  params.append('task_id', data.task_id);
  params.append('type', data.type);
  if (data.name) {
    params.append('name', data.name);
  }
  if (data.note) {
    params.append('note', data.note);
  }
  params.append('tactics', data.tactics);
  params.append('single_limit', data.single_limit.toString());
  params.append('total_limit', data.total_limit.toString());
  if (data.timeout) {
    params.append('timeout', data.timeout.toString());
  }
  params.append('cancel_threshold', data.cancel_threshold.toString());

  return params.toString();
}

export function getSchedApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Map<string, SchedCache>>(
    {
      url: Api.SCHEDCACHE,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function addSchedApi(
  query: addSchedData,
  data: DateKwds | CronKwds | IntervalKwds | Kwds = {},
  mode: ErrorMessageMode = 'modal',
) {
  const queryString = convertToQueryString(query);
  return defHttp.post<SchedCache>(
    {
      url: `${Api.ADD}?${queryString}`,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function pauseSchedApi(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<boolean>(
    {
      url: `${Api.PAUSE}?id=${id}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function resumeSchedApi(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<boolean>(
    {
      url: `${Api.RESUME}?id=${id}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function removeSchedApi(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<SchedCache>(
    {
      url: `${Api.REMOVE}?id=${id}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}
