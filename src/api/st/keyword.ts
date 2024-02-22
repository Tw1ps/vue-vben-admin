import { defHttp } from '@/utils/http/axios';
import { Datas, Field, Search } from './model/base';
import { Keyword, KeywordColumns, KeywordColumnsUpdate, KeywordCreate } from './model/keyword';

import { ErrorMessageMode } from '#/axios';

export enum Api {
  SEARCH = '/keyword/',
  CREATE = '/keyword/create',
  DELETE = '/keyword/delete',
  UPDATE = '/keyword/update',
  UPLOAD = '/keyword/upload',
}

export function getKeywordApi(data: Search<KeywordColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Datas<Array<Keyword>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteKeywordApi(data: Search<KeywordColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<boolean>(
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
  data: { keyword: Search<KeywordColumns>; values: Array<Field<KeywordColumnsUpdate>> },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<boolean>(
    {
      url: Api.UPDATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function createKeywordApi(data: KeywordCreate, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Keyword>(
    {
      url: Api.CREATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function uploadKeywordApi(data: FormData, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<Keyword>(
    {
      url: Api.UPLOAD,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
