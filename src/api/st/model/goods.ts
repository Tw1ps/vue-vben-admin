import { createLabelArray } from './base';

export interface Goods {
  id: number;
  url: string;
  unique_hash: string;
  title?: string;
  intro?: string;
  date?: Date;
  keyword?: Array<string>;
  category?: string;
  info?: {
    user?: string;
    amount?: string;
    gid?: number;
    quick_ratio?: number;
    trading?: string;
    origin?: string;
  };
  created_date: Date;
  source: string;
  pic_urls?: Array<string>;
}

export enum GoodsColumns {
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
}

export const GoodsColumnsArray = createLabelArray(GoodsColumns);

export const GoodsColumnsType = {
  datetime: [GoodsColumns.DATE, GoodsColumns.CREATED_DATE],
  number: [GoodsColumns.ID],
  boolean: [],
  select: {},
};
