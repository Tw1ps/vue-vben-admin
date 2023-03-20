import { defHttp } from '/@/utils/http/axios';
import { Field, SearchBase, WebResponse } from './model/base';
import { BotColumns, Bot, BotCreate, BotColumnsUpdate, BotColumnsNative } from './model/bot';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/api/bot/',
  CREATE = '/api/bot/create',
  DELETE = '/api/bot/delete',
  UPDATE = '/api/bot/update',
  TEST = '/api/bot/test',
}

export function getBotApi(data: SearchBase<BotColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<Bot>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteBotApi(data: SearchBase<BotColumnsNative>, mode: ErrorMessageMode = 'modal') {
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

export function updateBotApi(
  data: { keyword: SearchBase<BotColumns>; new_values: Array<Field<BotColumnsUpdate>> },
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

export function createBotApi(data: BotCreate, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Bot>>(
    {
      url: Api.CREATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function testBotApi(params: { id: number }, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Boolean>>(
    {
      url: Api.TEST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
