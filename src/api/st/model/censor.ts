import { createLabelArray } from './base';

export interface Censor {
  id: number;
  url: string;
  unique_hash: string;
  title?: string;
  intro?: string;
  date?: Date;
  keyword?: Array<string>;
  category?: string;
  info?: {};
  created_date: Date;
  source: string;
  pic_urls?: Array<string>;
  watch_id: number;
  user_id: number;
}

export enum CensorColumns {
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
  WATCH_ID = 'watch_id',
  USER_ID = 'user_id',
}

export const CensorColumnsArray = createLabelArray(CensorColumns);

export const CensorColumnsType = {
  datetime: [CensorColumns.DATE, CensorColumns.CREATED_DATE],
  number: [CensorColumns.ID, CensorColumns.WATCH_ID, CensorColumns.USER_ID],
  boolean: [],
};
