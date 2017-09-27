import { ITokenObject } from "./interface";

export const jwtSelector = (state: any) => state.reduxSagaJwt;

export default id => ({
    getTokenObject: (state: any): ITokenObject => jwtSelector(state)[id] || null,
    isTokenExpired: (state: any): boolean => {
        const currentTimestamp = new Date().valueOf();
        const token: ITokenObject = jwtSelector(state)[id];
        if (!token) {
            return true;
        }
        return isTokenExpired(currentTimestamp, token.last_updated, token.expires_in);
    },
});

export function isTokenExpired(currentTimestamp: number, lastUpdated, expiresIn): boolean {
    return currentTimestamp >= lastUpdated + expiresIn * 1000;
}
