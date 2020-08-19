import {
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest
} from 'redux-saga/effects';

import { JWTConfigs, JWTState, TokenObject } from '../types';
import { INITIALIZE, initialize, remove, REMOVE, set, SET } from './actions';
import { createSelectors } from './selectors';

const isTokenChanged = action =>
  [SET, REMOVE, INITIALIZE].indexOf(action.type) >= 0;

const currentWorkers = {};

const calculateChangedKeys = (prev: JWTState, curr: JWTState) => {
  const prevKeys = prev ? Object.keys(prev).filter(k => Boolean(prev[k])) : [];
  const currKeys = curr ? Object.keys(curr).filter(k => Boolean(curr[k])) : [];

  return {
    added: currKeys.filter(k => prevKeys.indexOf(k) < 0),
    removed: prevKeys.filter(k => currKeys.indexOf(k) < 0)
  };
};

export const createSaga = <S, T extends TokenObject>(
  configs: JWTConfigs<S, T>
) => {
  const saveTokens = function*() {
    const tokens = yield select(configs.stateSelector);
    yield call(configs.setTokens, tokens);
  };

  const tokenWorker = function*() {
    let previousState: JWTState = null;
    let currentState = yield select(configs.stateSelector);
    while (true) {
      yield take(isTokenChanged);
      previousState = currentState;
      currentState = yield select(configs.stateSelector);

      const { added, removed } = calculateChangedKeys(
        previousState,
        currentState
      );

      for (const id of added) {
        currentWorkers[id] = {
          timer: yield fork(refreshIntervalTimer, id),
        };
      }

      for (const id of removed) {
        if (currentWorkers[id]) {
          yield cancel(currentWorkers[id].timer);
        }
      }
    }
  };

  const refreshIntervalTimer = function*(id: string) {
    const { getToken } = createSelectors(configs)(id);

    let token = yield select(getToken);
    while (true) {
      if (!token || token.refreshInterval < 0) {
        yield take(isTokenChanged);
        continue;
      }

      yield delay(token.refreshInterval);

      token = yield select(getToken);
      const newToken = yield call(configs.refreshToken, id, token);
      if (newToken) {
        yield put(set(id, newToken))
      } else {
        yield remove(id)
      }
    }
  };

  const refreshToken = function* (id, token) {
    return {
      id,
      token: yield call(configs.refreshToken, id, token)
    }
  }

  const init = function*() {
    const state = yield call(configs.getTokens) || {};

    const newTokens = yield all(Object.keys(state).map(id => {
      return call(refreshToken, id, state[id])
    }));

    const newState = newTokens.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr.token,
      }
    }, state)

    yield put(initialize(newState));
  }

  const rootSaga = function*() {
    yield fork(tokenWorker);
    yield call(init);
    yield takeLatest(isTokenChanged, saveTokens);
  };

  return {
    refreshIntervalTimer,
    rootSaga,
    saveTokens,
    tokenWorker
  };
};
