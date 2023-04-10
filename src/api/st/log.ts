import { defHttp } from '/@/utils/http/axios';
import { WebResponse } from './model/base';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/log/',
}

export const getLogsApi = (mode: ErrorMessageMode = 'modal') =>
  defHttp.post<WebResponse<Array<string>>>(
    {
      url: Api.SEARCH,
    },
    {
      errorMessageMode: mode,
    },
  );
