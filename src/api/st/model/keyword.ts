import { createLabelArray } from './base';

export enum KeywordType {
  WHITE = 0,
  BLACK = 1,
}

export interface KeywordCreate {
  keyword: Array<Array<string>>;
  active: boolean;
  ktype: KeywordType;
  note?: string;
}

export interface Keyword extends KeywordCreate {
  id: number;
  created_user?: string;
  created_username?: string;
  license?: string;
  bit_id: string;
}

export enum KeywordColumns {
  ID = 'id',
  KEYWORD = 'keyword',
  ACTIVE = 'active',
  KTYPE = 'ktype',
  NOTE = 'note',
  CREATED_USER = 'created_user',
  CREATED_USERNAME = 'created_username',
  LICENSE = 'license',
  BOT_ID = 'bot_id',
}

export enum KeywordColumnsUpdate {
  KEYWORD = 'keyword',
  ACTIVE = 'active',
  KTYPE = 'ktype',
  NOTE = 'note',
}

export const KeywordColumnsArray = createLabelArray(KeywordColumns);
export const KeywordColumnsUpdateArray = createLabelArray(KeywordColumnsUpdate);

export const KeywordColumnsType = {
  datetime: [],
  number: [KeywordColumns.ID],
  boolean: [KeywordColumns.ACTIVE],
  select: { ktype: KeywordType },
  array: [KeywordColumns.KEYWORD],
};
