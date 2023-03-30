import { createLabelArray } from './base';

export interface KeywordCreate {
  keyword: string | undefined;
  ktype: KeywordType;
  note: string | undefined;
}

export interface Keyword extends KeywordCreate {
  id: number;
  name: string;
  bot_id: number;
  user_id: number;
}

export enum KeywordColumns {
  ID = 'id',
  KEYWORD = 'keyword',
  NOTE = 'note',
  KTYPE = 'ktype',
  NAME = 'name',
  BOT_ID = 'bot_id',
  USER_ID = 'user_id',
}

export enum KeywordColumnsNative {
  ID = 'id',
  KEYWORD = 'keyword',
  NOTE = 'note',
  KTYPE = 'ktype',
  BOT_ID = 'bot_id',
}

export enum KeywordColumnsUpdate {
  KEYWORD = 'keyword',
  KTYPE = 'ktype',
  NOTE = 'note',
}

export enum KeywordType {
  NORMAL = 0,
  FOCUS = 1,
  BLOCK = 2,
}

export const KeywordColumnsArray = createLabelArray(KeywordColumns);
export const KeywordColumnsNativeArray = createLabelArray(KeywordColumnsNative);
export const KeywordColumnsUpdateArray = createLabelArray(KeywordColumnsUpdate);
export const KeywordTypeArray = createLabelArray(KeywordType);

export const KeywordColumnsType = {
  datetime: [],
  number: [KeywordColumns.ID, KeywordColumns.BOT_ID, KeywordColumns.USER_ID],
  boolean: [],
  select: { ktype: KeywordType },
};
