export interface Goods {
  id: number;
  url: string;
  unique_hash: string;
  title: string;
  intro: string;
  date: Date;
  keyword: Array<string>;
  gategory: string;
  info: {};
  created_date: Date;
  source: string;
  pic_urls: Array<string>;
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

export const GoodsColumnsArray = Array<{ label: String; value: String }>();
for (const k in GoodsColumns) {
  GoodsColumnsArray.push({ label: k, value: GoodsColumns[k] });
}

export const GoodsColumnsType = {
  datetime: ['date', 'created_date'],
  number: ['id'],
  boolean: [],
};
