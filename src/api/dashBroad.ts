import { defHttp } from '/@/utils/http/axios';
import { SearchBase } from './model/baseModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  INDEX = '/api/dashborad/',
}

export enum GoodsColumns {
  ID = 'id',
  URL = 'url',
  UNIQUE_HASH = 'unique_hash',
  TITLE = 'title',
  INTRO = 'intro',
  DATE = 'date',
  KEYWORD = 'keyword',
  CATEGORY = 'category',
  INFO = 'info',
  CREATED_DATE = 'created_date',
  SOURCE = 'source',
  PIC_URLS = 'pic_urls',
}

/**
 * @description: user login api
 */
export function DashBroadApi(params: SearchBase<GoodsColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<SearchBase<GoodsColumns>>(
    {
      url: Api.INDEX,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
