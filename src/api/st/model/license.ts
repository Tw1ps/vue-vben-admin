import { createLabelArray } from './base';

export interface LicenseCreate {
  authorized: string;
  active: boolean;
  rank: number;
  max_members: number;
  validity: Date;
}

export interface License extends LicenseCreate {
  id: string;
  created_date: Date;
}

export enum LicenseColumns {
  ID = 'id',
  AUTHORIZED = 'authorized',
  ACTIVE = 'active',
  RANK = 'rank',
  MAX_MEMBERS = 'max_members',
  VALIDITY = 'validity',
  CREATED_DATE = 'created_date',
}

export enum LicenseColumnsUpdate {
  AUTHORIZED = 'authorized',
  ACTIVE = 'active',
  RANK = 'rank',
  MAX_MEMBERS = 'max_members',
  VALIDITY = 'validity',
}

export const LicenseColumnsArray = createLabelArray(LicenseColumns);
export const LicenseColumnsUpdateArray = createLabelArray(LicenseColumnsUpdate);

export const LicenseColumnsType = {
  datetime: [LicenseColumns.VALIDITY, LicenseColumns.CREATED_DATE],
  number: [LicenseColumns.RANK, LicenseColumns.MAX_MEMBERS],
  boolean: [LicenseColumns.ACTIVE],
  select: {},
};
