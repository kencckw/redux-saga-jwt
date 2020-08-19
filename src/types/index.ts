export interface TokenObject {
  accessToken: string;
  refreshToken?: string;
  refreshInterval?: number;
}

export interface JWTConfigs<S = any, T extends TokenObject = any> {
  stateSelector?: (state: S) => JWTState;
  setTokens: (tokens: JWTState) => Generator;
  getTokens: () => Generator<any, JWTState>;
  refreshToken?: (id: string, token: T) => Generator;
}


export interface JWTState {
  [id: string]: TokenObject;
}
