export interface ITokenObject {
    expiresIn: number;
    createdAt: number;
    [otherProps: string]: any;
}

export interface IJWTConfig<S> {
    setTokens: (tokens: IJWTState) => any;
    getTokens: () => IJWTState;
    stateSelector?: (state: S) => IJWTState;
}

export interface IJWTState {
    [id: string]: ITokenObject;
}
