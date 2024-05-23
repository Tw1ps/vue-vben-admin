import { createLabelArray } from './base';

export interface WatchCreate {
  path: string;
  active: boolean;
  page_param?: string;
  page_start: number;
  page_end: number;
  note?: string;
  ext?: Map<string, any>;
}

export interface Watch extends WatchCreate {
  id: number;
  host?: string;
  host_id?: number;
  hostname?: string;
}

export enum WatchColumns {
  ID = 'id',
  HOST = 'host',
  HOSTNAME = 'hostname',
  HOST_ID = 'host_id',
  PATH = 'path',
  ACTIVE = 'active',
  PAGE_PARAM = 'page_param',
  PAGE_START = 'page_start',
  PAGE_END = 'page_end',
  NOTE = 'note',
  EXT = 'ext',
}

export enum WatchColumnsUpdate {
  ACTIVE = 'active',
  PAGE_PARAM = 'page_param',
  PAGE_START = 'page_start',
  PAGE_END = 'page_end',
  NOTE = 'note',
  EXT = 'ext',
}

export const WatchColumnsArray = createLabelArray(WatchColumns);
export const WatchColumnsUpdateArray = createLabelArray(WatchColumnsUpdate);

export const WatchColumnsType = {
  datetime: [],
  number: [WatchColumns.ID, WatchColumns.PAGE_START, WatchColumns.PAGE_END, WatchColumns.HOST_ID],
  boolean: [WatchColumns.ACTIVE],
  select: {},
  array: [],
};
