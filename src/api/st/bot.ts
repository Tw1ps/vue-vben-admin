import { defHttp } from '/@/utils/http/axios';
import { Field, Search, WebResponse } from './model/base';
import { BotColumns, Bot, BotCreate, BotColumnsUpdate, BotColumnsNative } from './model/bot';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/bot/',
  CREATE = '/bot/create',
  DELETE = '/bot/delete',
  UPDATE = '/bot/update',
  TEST = '/bot/test',
}

export function getBotApi(data: Search<BotColumns>, mode: ErrorMessageMode = 'modal') {
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

export function deleteBotApi(data: Search<BotColumnsNative>, mode: ErrorMessageMode = 'modal') {
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
  data: { keyword: Search<BotColumns>; new_values: Array<Field<BotColumnsUpdate>> },
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
