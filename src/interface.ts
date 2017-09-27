export interface ITokenObject {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    last_updated: number;
}

export interface IJWTConfig {
    tokenStorage?: IStorageService;
}

export interface IEndpointConfig {
    getToken: any;
    refreshToken: any;
}

export interface IStorageService {
    setToken: (token: object) => any;
    getToken: () => object;
}

export interface IAction {
    type: string;
    payload: any;
}

export interface ISetTokenAction extends IAction { payload: { token: any }; }
export interface IRefreshTokenAction extends IAction { payload: { refreshToken: any }; }

export interface IAsyncActionType {
    REQUEST: string;
    SUCCESS: string;
    FAILURE: string;
}
