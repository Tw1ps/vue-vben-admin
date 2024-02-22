import { createLabelArray } from './base';

export interface KeywordCreate {
  keyword?: Array<Array<string>>;
  active: boolean;
  note?: string;
}

export interface Keyword extends KeywordCreate {
  id: number;
  created_user?: string;
  created_username?: string;
  license?: string;
}

export enum KeywordColumns {
  ID = 'id',
  KEYWORD = 'keyword',
  ACTIVE = 'active',
  NOTE = 'note',
  CREATED_USER = 'created_user',
  CREATED_USERNAME = 'created_username',
  LICENSE = 'license',
}

export enum KeywordColumnsNative {
  ID = 'id',
  KEYWORD = 'keyword',
  ACTIVE = 'active',
  NOTE = 'note',
  CREATED_USER = 'created_user',
  CREATED_USERNAME = 'created_username',
  LICENSE = 'license',
}

export enum KeywordColumnsUpdate {
  KEYWORD = 'keyword',
  ACTIVE = 'active',
  NOTE = 'note',
}

export const KeywordColumnsArray = createLabelArray(KeywordColumns);
export const KeywordColumnsNativeArray = createLabelArray(KeywordColumnsNative);
export const KeywordColumnsUpdateArray = createLabelArray(KeywordColumnsUpdate);

export const KeywordColumnsType = {
  datetime: [],
  number: [KeywordColumns.ID],
  boolean: [KeywordColumns.ACTIVE],
  select: {},
  array: [KeywordColumns.KEYWORD],
};
