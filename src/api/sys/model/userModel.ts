/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
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
  id: number;
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
}
