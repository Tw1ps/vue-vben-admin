import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';

import { Datas, Search } from './model/base';
import { Logs, LogsColumns } from './model/fmtlog';

enum Api {
  LOGS = '/logs/',
}

export function getLogsApi(data: Search<LogsColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Datas<Array<Logs>>>(
    {
      url: Api.LOGS,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
