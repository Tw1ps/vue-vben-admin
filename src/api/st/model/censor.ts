import { createLabelArray } from './base';
import { Goods } from './goods';

export interface Censor extends Goods {
  watch_id: number;
  user_id: number;
}

export enum CensorColumns {
  ID = 'id',
  URL = 'url',
  UNIQUE_HASH = 'unique_hash',
  TITLE = 'title',
  DETAIL = 'detail',
  DATE = 'date',
  KEYWORD = 'keyword',
  TAG = 'tag',
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
  select: {},
};
