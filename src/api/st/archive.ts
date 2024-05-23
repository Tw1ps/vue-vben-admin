import { defHttp } from '@/utils/http/axios';
import { Search, Datas } from './model/base';
import { ArchiveColumns, Archive } from './model/archive';

import { ErrorMessageMode } from '#/axios';

enum Api {
  SEARCH = '/archive/',
}

export function getArchiveApi(data: Search<ArchiveColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Datas<Array<Archive>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
      timeout: 120000,
    },
  );
}
