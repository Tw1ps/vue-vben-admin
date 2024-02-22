import { createLabelArray } from './base';

export interface Record {
  id: number;
  title: string;
  url: string;
  ip: number;
  status: number;
  size: number;
  keyword: Array<string>;
  tag: Array<string>;
  security_details: {};
  request_headers: {};
  response_headers: {};
  response_body: string;
  screenshot_filename: string;
  note: string;
  created_from: string;
  host_id: number;
  created_time: Date;
  homepage: string;
  site: string;
  organizer: string;
  license: string;
}

export enum RecordColumns {
  ID = 'id',
  URL = 'url',
  IP = 'ip',
  TITLE = 'title',
  STATUS = 'status',
  SIZE = 'size',
  KEYWORD = 'keyword',
  TAG = 'tag',
  SECURITY_DETAILS = 'security_details',
  REQUEST_HEADERS = 'request_headers',
  RESPONSE_HEADERS = 'response_headers',
  RESPONSE_BODY = 'response_body',
  SCREENSHOT_FILENAME = 'screenshot_filename',
  NOTE = 'note',
  CREATED_FROM = 'created_from',
  HOST_ID = 'host_id',
  CREATED_TIME = 'created_time',
  HOMEPAGE = 'homepage',
  SITE = 'site',
  ORGANIZER = 'organizer',
  LICENSE = 'license',
}

export enum RecordColumnsUpdate {
  NOTE = 'note',
}

export const RecordColumnsArray = createLabelArray(RecordColumns);
export const RecordColumnsUpdateArray = createLabelArray(RecordColumnsUpdate);

export const RecordColumnsType = {
  datetime: [RecordColumns.CREATED_TIME],
  number: [
    RecordColumns.ID,
    RecordColumns.IP,
    RecordColumns.SIZE,
    RecordColumns.STATUS,
    RecordColumns.HOST_ID,
  ],
  boolean: [],
  select: {},
};
