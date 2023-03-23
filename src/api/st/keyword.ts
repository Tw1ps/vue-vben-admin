import { defHttp } from '/@/utils/http/axios';
import { Field, Search, WebResponse } from './model/base';
import {
  KeywordColumns,
  Keyword,
  KeywordCreate,
  KeywordColumnsUpdate,
  KeywordColumnsNative,
} from './model/keyword';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/keyword/',
  CREATE = '/keyword/create',
  DELETE = '/keyword/delete',
  UPDATE = '/keyword/update',
  UPLOAD = '/keyword/upload',
}

export function getKeywordApi(data: Search<KeywordColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<Keyword>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteKeywordApi(
  data: Search<KeywordColumnsNative>,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
    {
      url: Api.DELETE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function updateKeywordApi(
  data: { keyword: Search<KeywordColumns>; new_values: Array<Field<KeywordColumnsUpdate>> },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
    {
      url: Api.UPDATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function createKeywordApi(
  params: { bot_id: number },
  data: KeywordCreate,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<Keyword>>(
    {
      url: Api.CREATE,
      params,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
