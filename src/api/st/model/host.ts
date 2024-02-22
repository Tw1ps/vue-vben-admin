import { createLabelArray } from './base';

export interface HostCreate {
  organizer?: string;
  city?: string;
  location?: string;
  record?: string;
  site?: string;
  homepage?: string;
  ip?: number;
  active: boolean;
  alive: boolean;
  tag: Array<string>;
  note?: string;
}

export interface Host extends HostCreate {
  id: number;
  auto_tag: Array<string>;
  last_check: Date | undefined;
  created_time: Date;
  created_user: string;
  created_username: string;
  license: string;
  titles: Array<string>;
  response_body: Array<string>;
  screenshot: Array<string>;
  keywords: Array<string>;
  alert: boolean;
  alert_msg: string;
  executed_node: string;
}

export enum HostColumns {
  ID = 'id',
  ORGANIZER = 'organizer',
  CITY = 'city',
  LOCATION = 'location',
  RECORD = 'record',
  SITE = 'site',
  HOMEPAGE = 'homepage',
  IP = 'ip',
  ACTIVE = 'active',
  ALIVE = 'alive',
  TAG = 'tag',
  AUTO_TAG = 'auto_tag',
  NOTE = 'note',
  LAST_CHECK = 'last_check',
  CREATED_TIME = 'created_time',
  CREATED_USER = 'created_user',
  CREATED_USERNAME = 'created_username',
  LICENSE = 'license',
  TITLES = 'titles',
  RESPONSE_BODY = 'response_body',
  SCREENSHOT = 'screenshot',
  KEYWORDS = 'keywords',
  ALERT = 'alert',
  ALERT_MSG = 'alert_msg',
  EXECUTED_NODE = 'executed_node',
}

export enum HostColumnsUpdate {
  ORGANIZER = 'organizer',
  CITY = 'city',
  LOCATION = 'location',
  RECORD = 'record',
  SITE = 'site',
  HOMEPAGE = 'homepage',
  IP = 'ip',
  ACTIVE = 'active',
  ALIVE = 'alive',
  TAG = 'tag',
  NOTE = 'note',
}

export const HostColumnsArray = createLabelArray(HostColumns);
export const HostColumnsUpdateArray = createLabelArray(HostColumnsUpdate);

export const HostColumnsType = {
  datetime: [HostColumns.LAST_CHECK, HostColumns.CREATED_TIME],
  number: [HostColumns.ID, HostColumns.IP],
  boolean: [HostColumns.ACTIVE, HostColumns.ALIVE, HostColumns.ALERT],
  select: {},
  array: [
    HostColumns.TAG,
    HostColumns.TITLES,
    HostColumns.RESPONSE_BODY,
    HostColumns.SCREENSHOT,
    HostColumns.KEYWORDS,
  ],
};
