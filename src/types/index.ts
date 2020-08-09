export interface TokenObject {
  accessToken: string;
  /**
   * If refresh token is null, refreshToken won't be invoked
   */
  refreshToken?: string;
  /**
   * Timestamp in second (for example: 1596777498)
   * Once the
   */
  expiresOn?: number;
  /**
   * Timestamp in second
   * Set it to 0 if you don't want to refresh token
   */
  refreshInterval?: number;
}

export interface JWTConfigs<S = any, T extends TokenObject = any> {
  stateSelector?: (state: S) => JWTState;
  setTokens: (tokens: JWTState) => Generator;
  getTokens: () => Generator<any, JWTState>;
  refreshToken?: (id: string, token: T) => Generator;
  tokenExpired?: (id: string, token: T) => Generator;
}


export interface JWTState {
  [id: string]: TokenObject;
}
