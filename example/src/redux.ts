import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import createSagaMiddleware from 'redux-saga'
import {
  createActionCreators,
  createJWT,
  JWTState,
  remove,
  set,
  TokenObject
} from 'redux-saga-jwt'
import {all, put, spawn} from 'redux-saga/effects';
import {LoginService} from "./api";
import {Storage} from "./storage";

export const jwt = createJWT({
  *setTokens(state) {
    yield Storage.setToken(state);
  },
  *getTokens() {
    return (yield Storage.getToken()) as JWTState;
  },
  *refreshToken(id, token) {
    const newToken = yield LoginService.refresh(token.refreshToken!);
    yield put(set(id, newToken as TokenObject))
  },
  *tokenExpired(id) {
    yield put(remove(id))
  },
})

function* rootSaga() {
  yield all([
    spawn(jwt.saga)
  ])
}

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  jwt: jwt.reducer,
});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

export const selectors = jwt.createSelectors('main');
export const actionCreators = createActionCreators('main');

sagaMiddleware.run(rootSaga)
