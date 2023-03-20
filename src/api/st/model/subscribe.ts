import { createLabelArray } from './base';

export interface SubscribeCreate {
  listener: number;
  podcaster: number;
  filtr: boolean;
}

export interface Subscribe extends SubscribeCreate {
  id: number;
  listener_user: number;
  podcaster_user: number;
}

export enum SubscribeColumns {
  ID = 'id',
  LISTENER = 'listener',
  PODCASTER = 'podcaster',
  FILTR = 'filtr',
  LISTENER_USER = 'listener_user',
  PODCASTER_USER = 'podcaster_user',
}

export const SubscribeColumnsArray = createLabelArray(SubscribeColumns);

export const SubscribeColumnsType = {
  datetime: [],
  number: [
    SubscribeColumns.ID,
    SubscribeColumns.LISTENER,
    SubscribeColumns.LISTENER_USER,
    SubscribeColumns.PODCASTER,
    SubscribeColumns.PODCASTER_USER,
  ],
  boolean: [SubscribeColumns.FILTR],
  select: {},
};
