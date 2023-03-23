import { defHttp } from '/@/utils/http/axios';
import { Search, WebResponse } from './model/base';
import { GoodsColumns } from './model/goods';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  KEYWORD = '/analysis/keyword',
  DATE = '/analysis/date',
  CATEGORY = '/analysis/category',
}

export function getKeywordAnalysisApi(
  data: Search<GoodsColumns>,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<Array<{ keyword: string; count: number }>>>(
    {
      url: Api.KEYWORD,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getDateAnalysisApi(data: Search<GoodsColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<{ source: string; count: number; date: Date }>>>(
    {
      url: Api.DATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getCategoryAnalysisApi(
  data: Search<GoodsColumns>,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<Array<{ source: string; count: number; category: string }>>>(
    {
      url: Api.CATEGORY,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
