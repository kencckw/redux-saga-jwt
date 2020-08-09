import { JWTState } from '../types';
import { INITIALIZE, REMOVE, SET } from './actions';

export const reducer = (state: JWTState = null, action) => {
  const { type, payload } = action;
  if (type === INITIALIZE) {
    return payload || {};
  } else if (state === null) {
    return state;
  } else if (type === SET) {
    return {
      ...state,
      [payload.id]: payload.token
    };
  } else if (type === REMOVE) {
    const { [payload.id]: value, ...newState } = state;
    return newState;
  }
  return state;
};
