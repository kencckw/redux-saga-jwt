import { action } from "./utils/actions";

import { ITokenObject, ISetTokenAction } from "./interface";

export const JWT = "@@redux-saga-jwt";

export const SET_TOKEN = `${JWT}/SET_TOKEN`;
export const DELETE_TOKEN = `${JWT}/DELETE_TOKEN`;
export const ON_TOKEN_EXPIRED = `${JWT}/ON_TOKEN_EXPIRED`;

export const CANCEL_COUNTDOWN_TIMER = `${JWT}/CANCEL_COUNTDOWN_TIMER`;
export const START_COUNTDOWN_TIMER = `${JWT}/START_COUNTDOWN_TIMER`;

export default (id: string) => ({
    setToken: (tokenObject: ITokenObject) => action(SET_TOKEN, { id, token: tokenObject }),
    deleteToken: (): ISetTokenAction => action(DELETE_TOKEN, { id }),
    onTokenExpired: (tokenObject: ITokenObject) => action(ON_TOKEN_EXPIRED, { id, token: tokenObject }),
    cancelCountdownTimer: () => action(CANCEL_COUNTDOWN_TIMER, { id }),
    startCountdownTimer: (expiresIn: number) => action(START_COUNTDOWN_TIMER, { id, expiresIn }),
});
