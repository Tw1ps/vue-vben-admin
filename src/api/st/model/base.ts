function enum2arr(valueEnum: any[] | Record<string, any>) {
  let values = Array.isArray(valueEnum) ? valueEnum : Object.values(valueEnum);
  // 如果 enum 值为 number 类型，ts 生成的 js 对象会同时包含枚举的名称，针对该情形需提出枚举名称
  const hasNum = values.some((v) => typeof v === 'number');
  if (hasNum) {
    values = values.filter((v) => {
      if (typeof v != 'number') {
        return true;
      }
    });
  } else {
    return null;
  }
  return values;
}

export function createLabelArray(src: {}) {
  const tmp = Array<{ label: string; value: any }>();
  const tmp2 = enum2arr(src);
  if (tmp2) {
    for (const k in tmp2) {
      tmp.push({ label: src[k], value: parseInt(k) });
    }
  } else {
    for (const k in src) {
      tmp.push({ label: k, value: src[k] });
    }
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
  IN = 'IN',
  NOT_IN = 'NOT IN',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT LIKE',
  IS = 'IS',
  IS_NOT = 'IS NOT',
  // REGEXP_MATCH = 'REGEXP_MATCH',
  // REGEXP_REPLACE = 'REGEXP_REPLACE',
}

export const OperatorArray = createLabelArray(Operator);

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const OrderArray = createLabelArray(Order);

export enum Blop {
  AND = 'AND',
  OR = 'OR',
}

export const BlopArray = createLabelArray(Blop);

export interface Field<T> {
  options?: any;
  uuid?: string;
  blop?: Blop;
  key?: T;
  op?: Operator | string;
  value?: any;
  fields?: Field<T>[];
}

export interface Search<T> {
  offset?: number | null;
  limit?: number | null;
  order_field?: T | null;
  order?: Order | null;
  fields?: Field<T>[];
}

export interface WebResponse<T> {
  msg?: string;
  data?: T;
  code?: number;
}

export interface Datas<T> {
  data: T;
  count: number;
  total: number;
}

export interface ColumnsType {
  datetime?: Array<string>;
  number?: Array<string>;
  boolean?: Array<string>;
  select: {};
  array?: Array<string>;
}

export interface BaseOptions {
  columns: Array<{ label: string; value: string }>;
  columnsType?: ColumnsType;
}
