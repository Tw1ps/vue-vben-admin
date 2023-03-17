import { createLabelArray } from './base';

export interface BotCreate {
  name: string;
  apikey: string;
  security: {};
  ktype: BotType;
  provider: BotProvider;
  active: boolean;
  service_rank: number;
  receive_broadcast: boolean;
  note: string;
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
  service_rank: number;
  subscribe: Array<{ id: number; name: string; note: string }>;
  user_id: number;
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
  SUBSCRIBE = 'subscribe',
  SERVICE_RANK = 'service_rank',
  RECEIVE_BROADCAST = 'receive_broadcast',
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
  SERVICE_RANK = 'service_rank',
  RECEIVE_BROADCAST = 'receive_broadcast',
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
  SERVICE_RANK = 'service_rank',
  RECEIVE_BROADCAST = 'receive_broadcast',
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
  SERVICE = 2,
  PRIVATE_SERVICE = 3,
}

export const BotColumnsArray = createLabelArray(BotColumns);
export const BotColumnsNativeArray = createLabelArray(BotColumnsNative);
export const BotColumnsUpdateArray = createLabelArray(BotColumnsUpdate);

export const BotColumnsType = {
  datetime: [],
  number: [BotColumns.ID, BotColumns.SERVICE_RANK, BotColumns.USER_ID],
  boolean: [BotColumns.ACTIVE, BotColumns.RECEIVE_BROADCAST],
  select: { provider: BotProvider, ktype: BotType },
};
