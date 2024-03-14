import { createLabelArray } from './base';

export interface BotCreate {
  name: string | undefined;
  apikey: string | undefined;
  security: {};
  ktype: BotType;
  provider: BotProvider;
  active: boolean;
  note: string | undefined;
  at_user: Array<string>;
}

export interface Bot extends BotCreate {
  id: number;
  name: string;
  apikey: string;
  security: {};
  ktype: BotType;
  provider: BotProvider;
  active: boolean;
  user_id: string;
  username: string;
}

export enum BotColumns {
  ID = 'id',
  NAME = 'name',
  APIKEY = 'apikey',
  SECURITY = 'security',
  KTYPE = 'ktype',
  PROVIDER = 'provider',
  ACTIVE = 'active',
  NOTE = 'note',
  AT_USER = 'at_user',
  USER_ID = 'user_id',
  USERNAME = 'username',
  LICENSE = 'license',
}

export enum BotColumnsNative {
  ID = 'id',
  NAME = 'name',
  APIKEY = 'apikey',
  SECURITY = 'security',
  KTYPE = 'ktype',
  PROVIDER = 'provider',
  ACTIVE = 'active',
  NOTE = 'note',
  AT_USER = 'at_user',
  USER_ID = 'user_id',
}

export enum BotColumnsUpdate {
  NAME = 'name',
  APIKEY = 'apikey',
  SECURITY = 'security',
  KTYPE = 'ktype',
  PROVIDER = 'provider',
  ACTIVE = 'active',
  NOTE = 'note',
  AT_USER = 'at_user',
}

export enum BotSecurity {
  TEXT = 'text',
  SIGNATURE = 'signature',
}

export enum BotProvider {
  DINGTALK = 0,
}

export enum BotType {
  NORMAL = 0,
  ALERT = 1,
  // SERVICE = 2,
  // PRIVATE_SERVICE = 3,
}

export const BotColumnsArray = createLabelArray(BotColumns);
export const BotColumnsNativeArray = createLabelArray(BotColumnsNative);
export const BotColumnsUpdateArray = createLabelArray(BotColumnsUpdate);
export const BotTypeArray = createLabelArray(BotType);
export const BotProviderArray = createLabelArray(BotProvider);

export const BotColumnsType = {
  datetime: [],
  number: [BotColumns.ID],
  boolean: [BotColumns.ACTIVE],
  select: { provider: BotProvider, ktype: BotType },
  array: [BotColumns.AT_USER],
};
