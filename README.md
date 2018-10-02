# redux-saga-jwt
[![npm version](https://badge.fury.io/js/redux-saga-jwt.svg)](https://www.npmjs.com/package/redux-saga-jwt)
[![CircleCI](https://circleci.com/gh/kencckw/redux-saga-jwt.svg?style=shield)](https://circleci.com/gh/kencckw/redux-saga-jwt)
[![Coverage Status](https://coveralls.io/repos/github/kencckw/redux-saga-jwt/badge.svg?branch=)](https://coveralls.io/github/kencckw/redux-saga-jwt?branch=)
[![license](https://img.shields.io/github/license/kencckw/redux-saga-jwt.svg)](https://github.com/kencckw/redux-saga-jwt/blob/master/LICENSE.md)

## Features
1. Multiple token management
2. Support Typescript

## Installation
```npm i redux-saga-jwt```

## Setup
```typescript
import { createJWT, createActionCreators } from "redux-saga-jwt";

const jwt = createJWT();

export const myAppSelector = jwt.createSelectors("myApp");
export const myAppActions = createActionCreators("myApp");

const rootReducer = combineReducers({
  jwt: jwt.reducer,
})

const sagaMiddleware = createSagaMiddleware();

sagaMiddleware.run(function* () {
  yield all([
    jwt.saga,
  ])
});
```

## Example
```
git clone https://github.com/kencckw/redux-saga-jwt.git && cd example && npm i && npm start
```

## Usage
1. Set token after login 
```typescript
function* loginSaga(action) {
    const {username, password} = action.payload;
    const tokenObject: ITokenObject = yield call(yourLoginApi, username, password)
    yield put(myAppActions.set(tokenObject));
}
```
2. Listen EXPIRED and refresh your token.
> Redux-saga-jwt will load the token and check the token status on application start.
```typescript
import { EXPIRED } from "redux-saga-jwt";

function* refreshTokenListener() {
    yield takeEvery(EXPIRED, refreshSaga);
}

function* refreshToken(action) {
    const {id} = action.payload;
    const tokenObject = yield select(myAppSelector);
    const newToken = yield call(yourRefreshApi, tokenObject.refreshToken);
    yield put(myAppActions.set(newToken));
}
```
3. Remove your token when user logs out
```typescript

function* logoutSaga() {
    yield put(myAppActions.remove());
    yield call(yourLogoutApi);
}

```
4. Selectors
> If token is null, isTokenExpired will return true
```typescript
function mapStateToProps(state) {
    return {
        token: myAppSelector.getToken(state),
        isAuthenticated: !myAppSelector.isTokenExpired(state),
    };
}
```

## Advance usage

By overriding the default config of redux-saga-jwt, you can customize your state location or implement your own storage logic.

```typescript
interface IJWTConfig<S> {
    setTokens: (tokens: IJWTState) => any;
    getTokens: () => IJWTState;
    stateSelector?: (state: S) => IJWTState;
}

const defaultConfigs: IJWTConfig<any> = {
    getTokens: () => JSON.parse(localStorage.getItem("jwt") || null),
    setTokens: tokens => localStorage.setItem("jwt", JSON.stringify(tokens)),
    stateSelector: state => state.jwt,
};
```

```typescript
import { createJWT, createActionCreators } from "redux-saga-jwt";

const jwt = createJWT(yourConfigs);
```
