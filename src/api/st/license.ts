import { defHttp } from '/@/utils/http/axios';
import { Field, Search, WebResponse } from './model/base';
import { LicenseColumns, License, LicenseCreate, LicenseColumnsUpdate } from './model/license';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SEARCH = '/license/',
  CREATE = '/license/create',
  DELETE = '/license/delete',
  UPDATE = '/license/update',
}

export function getLicenseApi(data: Search<LicenseColumns>, mode: ErrorMessageMode = 'modal') {
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

export function deleteLicenseApi(data: Search<LicenseColumns>, mode: ErrorMessageMode = 'modal') {
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
  data: { keyword: Search<LicenseColumns>; new_values: Array<Field<LicenseColumnsUpdate>> },
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
