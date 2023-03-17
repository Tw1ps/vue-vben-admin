import { createLabelArray } from './base';

export interface WatchCreate {
  path: string;
  filtr: boolean;
  active: boolean;
  ktype: WatchType;
  record: WatchRecord;
  page_param?: string;
  page_start?: number;
  page_end?: number;
  note?: string;
  ext?: {};
}

export interface Watch extends WatchCreate {
  id: number;
  host?: string;
  host_id?: number;
  hostname?: string;
  bot_name?: string;
  bot_id: number;
}

export enum WatchColumns {
  ID = 'id',
  HOST = 'host',
  HOSTNAME = 'hostname',
  HOST_ID = 'host_id',
  PATH = 'path',
  FILTR = 'filtr',
  ACTIVE = 'active',
  KTYPE = 'ktype',
  RECORD = 'record',
  PAGE_PARAM = 'page_param',
  PAGE_START = 'page_start',
  PAGE_END = 'page_end',
  BOT_NAME = 'bot_name',
  BOT_ID = 'bot_id',
  USER_ID = 'user_id',
  NOTE = 'note',
  EXT = 'ext',
}

export enum WatchColumnsNative {
  ID = 'id',
  HOSTNAME = 'hostname',
  PATH = 'path',
  FILTR = 'filtr',
  ACTIVE = 'active',
  KTYPE = 'ktype',
  RECORD = 'record',
  PAGE_PARAM = 'page_param',
  PAGE_START = 'page_start',
  PAGE_END = 'page_end',
  BOT_ID = 'bot_id',
  NOTE = 'note',
  EXT = 'ext',
}

export enum WatchColumnsUpdate {
  FLITR = 'filtr',
  ACTIVE = 'active',
  KTYPE = 'ktype',
  RECORD = 'record',
  PAGE_PARAM = 'page_param',
  PAGE_START = 'page_start',
  PAGE_END = 'page_end',
  NOTE = 'note',
  EXT = 'ext',
}

export enum WatchRecord {
  RECORD = 0,
  ONLY_PULL = 1,
  ONLY_RECORD = 2,
  CENSOR = 3,
}

export enum WatchType {
  PRIVATE = 0,
  PUBLIC = 1,
}

export const WatchColumnsArray = createLabelArray(WatchColumns);
export const WatchColumnsNativeArray = createLabelArray(WatchColumnsNative);
export const WatchColumnsUpdateArray = createLabelArray(WatchColumnsUpdate);

export const WatchColumnsType = {
  datetime: [],
  number: [
    WatchColumns.ID,
    WatchColumns.BOT_ID,
    WatchColumns.HOST_ID,
    WatchColumns.PAGE_END,
    WatchColumns.PAGE_PARAM,
    WatchColumns.PAGE_START,
    WatchColumns.USER_ID,
  ],
  boolean: [WatchColumns.ACTIVE, WatchColumns.FILTR],
  select: { ktype: WatchType, record: WatchRecord },
};
