import { createLabelArray } from './base';

export interface AccountCreate {
  usr: string | undefined;
  pwd: string | undefined;
  useful: boolean;
  info?: {};
}

export interface Account extends AccountCreate {
  id: number;
  hostname: string;
  host?: string;
  host_id?: number;
  intime: Date;
}

export enum AccountColumns {
  ID = 'id',
  USR = 'usr',
  PWD = 'pwd',
  USEFUL = 'useful',
  INFO = 'info',
  INTIME = 'intime',
  HOST = 'host',
  HOST_ID = 'host_id',
  HOSTNAME = 'hostname',
}

export enum AccountColumnsNative {
  ID = 'id',
  USR = 'usr',
  PWD = 'pwd',
  USEFUL = 'useful',
  HOSTNAME = 'hostname',
  INFO = 'info',
  INTIME = 'intime',
}

export enum AccountColumnsUpdate {
  USR = 'usr',
  PWD = 'pwd',
  USEFUL = 'useful',
  INFO = 'info',
}

export const AccountColumnsArray = createLabelArray(AccountColumns);
export const AccountColumnsNativeArray = createLabelArray(AccountColumnsNative);
export const AccountColumnsUpdateArray = createLabelArray(AccountColumnsUpdate);

export const AccountColumnsType = {
  datetime: [AccountColumns.INTIME],
  number: [AccountColumns.ID, AccountColumns.HOST_ID],
  boolean: [AccountColumns.USEFUL],
  select: {},
};
