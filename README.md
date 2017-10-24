# redux-saga-jwt
[![npm version](https://badge.fury.io/js/redux-saga-jwt.svg)](https://www.npmjs.com/package/redux-saga-jwt)
[![CircleCI](https://circleci.com/gh/kencckw/redux-saga-jwt.svg?style=shield)](https://circleci.com/gh/kencckw/redux-saga-jwt)
[![Coverage Status](https://coveralls.io/repos/github/kencckw/redux-saga-jwt/badge.svg?branch=)](https://coveralls.io/github/kencckw/redux-saga-jwt?branch=)
[![license](https://img.shields.io/github/license/kencckw/redux-saga-jwt.svg)](https://github.com/kencckw/redux-saga-jwt/blob/master/LICENSE.md)

## Features
1. Multiple token manangement
2. Support Typescript

## Installation
```npm i redux-saga-jwt```

## Setup
```
import { combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { fork } from "redux-saga/effects";
import jwtSaga from "redux-saga-jwt";
import jwtReducer from "redux-saga-jwt/reducer";

const rootReducer = combineReducers({
  reduxSagaJwt: reducer,
})

const middleware = createSagaMiddleware();

function* rootSaga() {
  yield [
    fork(jwtSaga())
  ];
}

middleware.run(rootSaga)
```

## Override DefaultStorage
```
import { IStorageService } from "redux-saga-jwt/interface"; 
class MyStorage implements IStorageService {
    public setToken(token) {
        localStorage.setItem("token", JSON.stringify(token));
    }

    public getToken(): Interfaces.ITokenObject {
        const token: any = localStorage.getItem("token");
        return JSON.parse(token);
    }
}

function* rootSaga() {
  yield [
    fork(jwtSaga(new MyStorage())) // pass your storage instance into jwtSaga
  ];
}
```

## Usage
1. Set token after login 
```
import createAction from "redux-saga-jwt/actions";
import { put, call, takeEvery } from "redux-saga/effects";
const siteOneAction = createAction("siteOne");

function* loginSaga() {
    // const tokenObject = yield call(yourLoginApi, username, password)
    const tokenObject = {
        token_type: "Bearer";
        access_token: "abc";
        refresh_token: "def";
        expires_in: 3600; // unit: second
        last_updated: new Date().valueOf(); // timestamp
    };
    yield put(siteOneAction.setToken(tokenObject);
}
```
2. Listen to ON_TOKEN_EXPIRED action and refresh your token.  
> Redux-saga-jwt will load the token from StorageService and check the token status on application start.
```
import createAction, { ON_TOKEN_EXPIRED } from "redux-saga-jwt/actions";
import { put, call, takeEvery } from "redux-saga/effects";
const siteOneAction = createAction("siteOne");

function* refreshTokenListener() {
  yield takeEvery(ON_TOKEN_EXPIRED, refreshToken);
}
function refreshToken(action) {
    const { id, token } = action.payload; // id="siteOne", access_token="abc", refresh_token="def"
    // const newToken = yield call(yourRefreshTokenApi, token.refresh_token)
    // if (newToken === null) { // if refresh token failure, force user to login again.
    //    yield put(yourRequestLoginAction);
    //    return;
    // }
    const newToken = {
        token_type: "Bearer";
        access_token: "123";
        refresh_token: "456";
        expires_in: 3600;
        last_updated: new Date().valueOf(); // timestamp
    };
    yield put(siteOneAction.setToken(newToken);
}
```
3. Delete your token when log out
```
import createAction from "redux-saga-jwt/actions";
const siteOneAction = createAction("siteOne");
yield put(siteOneAction.deleteToken());
```
4. Use isTokenExpired to check your token status
```
import createSelector from "redux-saga-jwt/selectors";
const siteOneSelector = createSelector("siteOne");

function mapStateToProps(state) {
    return {
      isAuthenticated: siteOneSelector.isTokenExpired(state),
    };
}
```
