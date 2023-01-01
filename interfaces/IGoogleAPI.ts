export interface IGoogleAPI {
  accounts: any;
}

export interface IGoogleAPIAccounts {
  oauth2: IGoogleAPIOAuth2;
  id: any;
}

export interface IGoogleAPIOAuth2 {
  CodeClient: any;
  GoogleIdentityServicesError: (a: any, b: any) => any;
  GoogleIdentityServicesErrorType: GisErrorType;
  TokenClient: any;
  hasGrantedAllScopes: (tokenResponse: IInitTokenClientCallback, firstScope: string, ...restScopes: string[]) => boolean;
  hasGrantedAnyScopes: (a: any) => any;
  initCodeClient: (config: IInitCodeClientParams) => any;
  initTokenClient: (config: IInitTokenClientParams) => IInitTokenClientResult;
  revoke: (accessToken: string, done: () => void) => void;
}

export interface IInitCodeClientParams {
  client_id: string,
  scope: string | string[],
  ux_mode: UXType,
  callback: (response: IInitCodeClientCallback) => void
}

export interface IInitCodeClientCallback {
  code: string,
  scope: string | string[],
  state: string,
  error: any,
  error_description: string,
  error_uri: string
}

export interface IInitTokenClientParams {
  client_id: string,
  callback: (response: IInitTokenClientCallback) => void,
  scope: string | string[],
}

export interface IInitTokenClientCallback {
  access_token: string,
  expires_in: number,
  /*
  * Hosted domain
  * */
  hd: any,
  token_type: any,
  scope: string | string[],
  error: any,
  error_description: string,
  error_uri: string
}

export interface IInitTokenClientResult {
  requestAccessToken: () => void;
}

export type UXType = 'popup' | 'redirect';
export type GisErrorType = 'popup_failed_to_open' | 'unknown' | 'missing_required_parameter' | 'popup_closed';