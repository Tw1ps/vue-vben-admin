import { defHttp } from '/@/utils/http/axios';
import { Search, WebResponse } from './model/base';
import { GoodsColumns, Goods } from './model/goods';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/goods/',
}

export const getGoodsApi = (data: Search<GoodsColumns>, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<WebResponse<Array<Goods>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
// export function getGoodsApi(data: Search<GoodsColumns>, mode: ErrorMessageMode = 'modal') {
//   return defHttp.post<WebResponse<Array<Goods>>>(
//     {
//       url: Api.SEARCH,
//       data,
//     },
//     {
//       errorMessageMode: mode,
//     },
//   );
// }
