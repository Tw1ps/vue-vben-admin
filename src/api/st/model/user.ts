import { createLabelArray } from './base';

export interface UserCreate {
  username: string | undefined;
  nickname: string | undefined;
  email: string | undefined;
  note: string | undefined;
  license: string | undefined;
  password: string | undefined;
  rank: number | undefined;
  active: boolean | undefined;
}

export interface User extends UserCreate {
  id: number;
  rank: number;
  active: boolean;
  last_login: Date;
  this_login: Date;
  created_date: Date;
  updated_date: Date;
  license_rank: number | undefined;
}

export enum UserColumns {
  ID = 'id',
  USERNAME = 'username',
  NICKNAME = 'nickname',
  EMAIL = 'email',
  ACTIVE = 'active',
  NOTE = 'note',
  RANK = 'rank',
  LAST_LOGIN = 'last_login',
  THIS_LOGIN = 'this_login',
  CREATED_DATE = 'created_date',
  UPDATED_DATE = 'updated_date',
  LICENSE = 'license',
  LICENSE_RANK = 'license_rank',
}

export enum UserColumnsUpdate {
  NICKNAME = 'nickname',
  EMAIL = 'email',
  PASSWORD = 'password',
  ACTIVE = 'active',
  NOTE = 'note',
  RANK = 'rank',
}

export const UserColumnsArray = createLabelArray(UserColumns);
export const UserColumnsUpdateArray = createLabelArray(UserColumnsUpdate);

export const UserColumnsType = {
  datetime: [
    UserColumns.LAST_LOGIN,
    UserColumns.THIS_LOGIN,
    UserColumns.CREATED_DATE,
    UserColumns.UPDATED_DATE,
  ],
  number: [UserColumns.ID, UserColumns.RANK, UserColumns.LICENSE_RANK],
  boolean: [UserColumns.ACTIVE],
  select: {},
};
