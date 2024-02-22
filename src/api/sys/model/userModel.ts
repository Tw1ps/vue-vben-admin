/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  expires_minutes: number;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  access_token: string;
  token_type: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles?: RoleInfo[];
  // // 用户id
  // userId: string | number;
  // // 用户名
  // username: string;
  // // 真实名字
  // realName: string;
  // // 头像
  // avatar: string;
  // // 介绍
  // desc?: string;
  id: string;
  username: string;
  nickname?: string;
  email?: string;
  active: boolean;
  note?: string;
  rank: number;
  last_login?: Date;
  this_login?: Date;
  created_date?: Date;
  updated_date?: Date;
  license: string;
  license_rank?: number;
}
