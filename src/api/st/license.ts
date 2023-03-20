import { defHttp } from '/@/utils/http/axios';
import { Field, SearchBase, WebResponse } from './model/base';
import { LicenseColumns, License, LicenseCreate, LicenseColumnsUpdate } from './model/license';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/api/license/',
  CREATE = '/api/license/create',
  DELETE = '/api/license/delete',
  UPDATE = '/api/license/update',
}

export function getLicenseApi(data: SearchBase<LicenseColumns>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<Array<License>>>(
    {
      url: Api.SEARCH,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteLicenseApi(
  data: SearchBase<LicenseColumns>,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
    {
      url: Api.DELETE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function updateLicenseApi(
  data: { keyword: SearchBase<LicenseColumns>; new_values: Array<Field<LicenseColumnsUpdate>> },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<WebResponse<boolean>>(
    {
      url: Api.UPDATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function createLicenseApi(data: LicenseCreate, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<WebResponse<License>>(
    {
      url: Api.CREATE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
