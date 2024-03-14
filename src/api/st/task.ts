import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';

import { Task, Worker, Statistics } from './model/task';

enum Api {
  TASK = '/task/',
  WORKERS = '/task/workers',
  LOCKS = '/task/locks',
  STATISTICS = '/task/statistics',
  TASK_COUNT = '/task/task_count',
}

export function getTaskApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Map<string, Task>>(
    {
      url: Api.TASK,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getWorkersApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Map<string, Worker>>(
    {
      url: Api.WORKERS,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getLocksApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Map<string, Date>>(
    {
      url: Api.LOCKS,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getStatisticsApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Map<string, Statistics>>(
    {
      url: Api.STATISTICS,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getTaskCountApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Map<string, number>>(
    {
      url: Api.TASK_COUNT,
    },
    {
      errorMessageMode: mode,
    },
  );
}
