export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}

// 前后端交互
export enum Operator {
  EQ = '==',
  NE = '!=',
  LT = '<',
  LE = '<=',
  GT = '>',
  GE = '>=',
  // IN = 'IN',
  // NOT_IN = 'NOT IN',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT LIKE',
  IS = 'IS',
  IS_NOT = 'IS NOT',
  // REGEXP_MATCH = 'REGEXP_MATCH',
  // REGEXP_REPLACE = 'REGEXP_REPLACE',
}

export const OperatorArray: Array<{ label: string; value: Operator }> = [];
for (const k in Operator) {
  OperatorArray.push({ label: k, value: Operator[k] });
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export const OrderArray: Array<{ label: string; value: Order }> = [];
for (const k in Order) {
  OrderArray.push({ label: k, value: Order[k] });
}

export enum Bop {
  AND = 'AND',
  OR = 'OR',
}

export const BopArray: Array<{ label: string; value: Bop }> = [];
for (const k in Bop) {
  BopArray.push({ label: k, value: Bop[k] });
}

export interface Field<T> {
  options?: any;
  uuid?: string;
  bop?: Bop;
  key?: T;
  operator?: Operator;
  value?: any;
  fields?: Field<T>[];
}

export interface SearchBase<T> {
  offset: number | undefined | null;
  limit: number | undefined | null;
  order_field: T | undefined | null;
  order: Order | undefined | null;
  fields: Field<T>[];
}

export interface WebResponse<T> {
  message?: string;
  data?: T;
  total?: number;
  status?: number;
}

export interface ColumnsType {
  datetime?: Array<string>;
  number?: Array<string>;
  boolean?: Array<string>;
}

export interface BaseOptions {
  columns: Array<{ label: String; value: String }>;
  columnsType?: ColumnsType;
}
