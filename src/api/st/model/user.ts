import { createLabelArray } from './base';

export interface UserCreate {
  username: string;
  nickname: string;
  email: string;
  note: string;
  license: string;
  password: string;
}

export interface AdvancedUserCreate extends UserCreate {
  rank: number;
  active: boolean;
}

export interface User extends UserCreate {
  id: number;
  rank: number;
  active: boolean;
  last_login: Date;
  this_login: Date;
  created_date: Date;
  updated_date: Date;
}

export enum UserColumns {
  ID = 'id',
  USERNAME = 'username',
  NICKNAME = 'nickname',
  EMAIL = 'email',
  PASSWORD = 'password',
  ACTIVE = 'active',
  NOTE = 'note',
  RANK = 'rank',
  LAST_LOGIN = 'last_login',
  THIS_LOGIN = 'this_login',
  CREATED_DATE = 'created_date',
  UPDATED_DATE = 'updated_date',
  LICENSE = 'license',
}

export enum UserColumnsUpdate {
  NICKNAME = 'nickname',
  EMAIL = 'email',
  PASSWORD = 'password',
  ACTIVE = 'active',
  NOTE = 'note',
}

export enum AdvancedUserColumnsUpdate {
  USERNAME = 'username',
  NICKNAME = 'nickname',
  EMAIL = 'email',
  PASSWORD = 'password',
  ACTIVE = 'active',
  NOTE = 'note',
  RANK = 'rank',
  LICENSE = 'license',
}

export const UserColumnsArray = createLabelArray(UserColumns);
export const UserColumnsUpdateArray = createLabelArray(UserColumnsUpdate);
export const AdvancedUserColumnsUpdateArray = createLabelArray(AdvancedUserColumnsUpdate);

export const UserColumnsType = {
  datetime: [
    UserColumns.LAST_LOGIN,
    UserColumns.THIS_LOGIN,
    UserColumns.CREATED_DATE,
    UserColumns.UPDATED_DATE,
  ],
  number: [UserColumns.ID, UserColumns.RANK],
  boolean: [UserColumns.ACTIVE],
  select: {},
};
