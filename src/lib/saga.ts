import {
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeLatest
} from 'redux-saga/effects';

import { JWTConfigs, JWTState, TokenObject } from '../types';
import { INITIALIZE, initialize, REMOVE, SET } from './actions';
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
          worker: yield fork(refreshTokenWorker, id)
        };
      }

      for (const id of removed) {
        if (currentWorkers[id]) {
          yield cancel(currentWorkers[id].timer);
          yield cancel(currentWorkers[id].worker);
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
      yield call(configs.refreshToken, id, token);
    }
  };

  const refreshTokenWorker = function*(id: string) {
    const { getToken } = createSelectors(configs)(id);

    while (true) {
      const token = yield select(getToken);

      if (!token || token.expiresOn <= 0) {
        yield take(isTokenChanged);
        continue;
      }

      const { tokenExpired } = yield race({
        tokenChanged: take(isTokenChanged),
        tokenExpired: delay(
          token.expiresOn * 1000 - new Date().valueOf()
        )
      });

      if (tokenExpired) {
        yield call(configs.tokenExpired, id, token);
        return;
      }
    }
  };

  const rootSaga = function*() {
    yield fork(tokenWorker);
    const state = yield call(configs.getTokens);
    yield put(initialize(state));
    yield takeLatest(isTokenChanged, saveTokens);
  };

  return {
    refreshIntervalTimer,
    refreshTokenWorker,
    rootSaga,
    saveTokens,
    tokenWorker
  };
};
