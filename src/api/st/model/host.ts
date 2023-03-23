import { createLabelArray } from './base';

export interface HostCreate {
  host: string;
  hostname: string;
  rank: number;
  ext?: {};
}

export interface Host extends HostCreate {
  id: number;
}

export enum HostColumns {
  ID = 'id',
  HOST = 'host',
  HOSTNAME = 'hostname',
  RANK = 'rank',
  EXT = 'ext',
}

export enum HostColumnsUpdate {
  HOST = 'host',
  HOSTNAME = 'hostname',
  RANK = 'rank',
  EXT = 'ext',
}

export const HostColumnsArray = createLabelArray(HostColumns);
export const HostColumnsUpdateArray = createLabelArray(HostColumnsUpdate);

export const HostColumnsType = {
  datetime: [],
  number: [HostColumns.ID, HostColumns.RANK],
  boolean: [],
  select: {},
};
