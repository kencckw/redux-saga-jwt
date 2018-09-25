import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, call } from "redux-saga/effects";
import jwt from "./jwt";
import api, {reducer} from './api';

const rootReducer = combineReducers({
    jwt: jwt.reducer,
    api: reducer,
});

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

export const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(function* () {
  yield all([
    call(api),
    call(jwt.saga),
  ])
});
