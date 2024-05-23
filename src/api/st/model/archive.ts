import { createLabelArray } from './base';

export interface Archive {
  id: number;
  url: string;
  unique_hash: string;
  title: string;
  detail?: string;
  digest?: string;
  date: Date;
  tag?: Array<string>;
  category: string;
  info?: Map<string, any>;
  source: string;
  created_date: Date;
  pic_url?: Array<string>;
  keyword?: Array<string>;
}

export enum ArchiveColumns {
  ID = 'id',
  URL = 'url',
  UNIQUE_HASH = 'unique_hash',
  TITLE = 'title',
  DETAIL = 'detail',
  DIGEST = 'digest',
  DATE = 'date',
  KEYWORD = 'keyword',
  TAG = 'tag',
  CATEGORY = 'category',
  INFO = 'info',
  CREATED_DATE = 'created_date',
  SOURCE = 'source',
  PIC_URLS = 'pic_urls',
}

export const ArchiveColumnsArray = createLabelArray(ArchiveColumns);

export const ArchiveColumnsType = {
  datetime: [ArchiveColumns.CREATED_DATE, ArchiveColumns.DATE],
  number: [ArchiveColumns.ID],
  boolean: [],
  select: {},
  array: [ArchiveColumns.KEYWORD, ArchiveColumns.TAG, ArchiveColumns.PIC_URLS],
};
