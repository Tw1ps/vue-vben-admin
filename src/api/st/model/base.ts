export function createLabelArray(src: {}) {
  const tmp = Array<{ label: string; value: any }>();
  for (const k in src) {
    tmp.push({ label: k, value: src[k] });
  }
  return tmp;
}

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

export const OperatorArray = createLabelArray(Operator);

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export const OrderArray = createLabelArray(Order);

export enum Bop {
  AND = 'AND',
  OR = 'OR',
}

export const BopArray = createLabelArray(Bop);

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
  select: {};
}

export interface BaseOptions {
  columns: Array<{ label: String; value: String }>;
  columnsType?: ColumnsType;
}
