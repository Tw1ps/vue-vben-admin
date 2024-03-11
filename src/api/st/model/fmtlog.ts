import { createLabelArray } from './base';

export interface LogsCreate {
  user_id: string;
  username: string;
  action: string;
  path: string;
  data: string;
}

export interface Logs extends LogsCreate {
  id: number;
  created_time: Date;
}

export enum LogsColumns {
  ID = 'id',
  CREATED_TIME = 'created_time',
  USER_ID = 'user_id',
  USERNAME = 'username',
  ACTION = 'action',
  PATH = 'path',
  DATA = 'data',
}

export const LogsColumnsArray = createLabelArray(LogsColumns);

export const LogsColumnsType = {
  datetime: [LogsColumns.CREATED_TIME],
  number: [LogsColumns.ID],
  boolean: [],
  select: {},
  array: [],
};
