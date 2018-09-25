import { ITokenObject } from "./interface";

export const JWT = "@@redux-saga-jwt";

export const SET = `${JWT}/SET`;
export const REMOVE = `${JWT}/REMOVE`;
export const EXPIRED = `${JWT}/EXPIRED`;

export const createActionCreators = (id: string) => ({
    set: (token: ITokenObject) => ({type: SET, payload: { id, token }}),
    remove: () => ({type: REMOVE, payload: { id }}),
    expired: () => ({type: EXPIRED, payload: { id }}),
});
