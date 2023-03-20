import { defHttp } from '/@/utils/http/axios';
import { SearchBase, WebResponse } from './model/base';
import { GoodsColumns, Goods } from './model/goods';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/api/goods/',
}

export function getGoodsApi(data: SearchBase<GoodsColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<Goods>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
