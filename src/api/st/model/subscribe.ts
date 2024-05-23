import { createLabelArray } from './base';

export interface SubscribeCreate {
  bot_id: string;
  watch_id: number;
  filtr: boolean;
}

export interface Subscribe extends SubscribeCreate {
  id: number;
  hostname?: string;
  bot_name?: string;
  user_id?: string;
  note?: string;
}

export enum SubscribeColumns {
  ID = 'id',
  FILTR = 'filtr',
  BOT_ID = 'bot_id',
  WATCH_ID = 'watch_id',
  HOSTNAME = 'hostname',
  BOT_NAME = 'bot_name',
  USER_ID = 'user_id',
  NOTE = 'note',
}

export const SubscribeColumnsArray = createLabelArray(SubscribeColumns);

export const SubscribeColumnsType = {
  datetime: [],
  number: [SubscribeColumns.ID, SubscribeColumns.WATCH_ID],
  boolean: [SubscribeColumns.FILTR],
  select: {},
  array: [],
};
