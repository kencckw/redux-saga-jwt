import { ITokenObject } from "./interface";

export function isTokenExpired(token: ITokenObject): boolean {
    const currentTimestamp = new Date().getTime();
    const { createdAt, expiresIn} = token;
    return currentTimestamp >= createdAt + expiresIn;
}
