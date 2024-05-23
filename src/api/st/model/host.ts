import { createLabelArray } from './base';

export interface HostCreate {
  host: string;
  hostname: string;
  active: boolean;
  ext?: Map<string, any>;
}

export interface Host extends HostCreate {
  id: number;
}

export enum HostColumns {
  ID = 'id',
  HOST = 'host',
  HOSTNAME = 'hostname',
  ACTIVE = 'active',
  EXT = 'ext',
}

export enum HostColumnsUpdate {
  HOST = 'host',
  HOSTNAME = 'hostname',
  ACTIVE = 'active',
  EXT = 'ext',
}

export const HostColumnsArray = createLabelArray(HostColumns);
export const HostColumnsUpdateArray = createLabelArray(HostColumnsUpdate);

export const HostColumnsType = {
  datetime: [],
  number: [HostColumns.ID],
  boolean: [HostColumns.ACTIVE],
  select: {},
  array: [],
};
