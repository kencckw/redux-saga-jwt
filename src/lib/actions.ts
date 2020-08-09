import { JWTState, TokenObject } from '../types';

export const JWT = '@@redux-saga-jwt';

export const SET = `${JWT}/SET`;
export const REMOVE = `${JWT}/REMOVE`;
export const INITIALIZE = `${JWT}/INITIALIZE`;

export const initialize = (state: JWTState) => ({
  payload: state,
  type: INITIALIZE
});
export const remove = (id: string) => ({ type: REMOVE, payload: { id } });
export const set = (id: string, token: TokenObject) => ({
  payload: { id, token },
  type: SET
});

// @ts-ignore
export const createActionCreators = (id: string) => ({
  remove: () => remove(id),
  set: (token: TokenObject) => set(id, token)
});
