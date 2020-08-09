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
import {
  createActionCreators,
  createJWT,
  JWTState,
  remove,
  set,
  TokenObject
} from 'redux-saga-jwt'

const jwt = createJWT({
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
})

const selectors = jwt.createSelectors('main')
const actionCreators = createActionCreators('main')

const rootReducer = combineReducers({
  jwt: jwt.reducer,
})

const sagaMiddleware = createSagaMiddleware()

sagaMiddleware.run(function* () {
  yield all([
    jwt.saga,
  ])
})
```

## Example
TODO: upload to codesandbox

## Usage
1. Set token after login 
```typescript
const login = async () => {
    const token = await LoginService.login();
    dispatch(actionCreators.set(token))
}
```
2. Remove your token when user logs out
```typescript
const logout = async () => {
    await LoginService.login();
    dispatch(actionCreators.remove())
}
```

4. Selectors
> If token is null, isTokenExpired will return true
```typescript
import {useSelector} from 'react-redux'

const isInitialized = useSelector(selectors.isInitialized)
const isAuthenticated = useSelector(selectors.isAuthenticated)
```

## FAQ

### What should I do if I don't need to refresh token? 

1. Set `refreshInterval` to -1 in your token object
```typescript
import {createActionCreators, useDispatch} from "react-redux";

const actionCreators = createActionCreators('main')

const dispatch = useDispatch();

dispatch(actionCreators.set({
    ...(YOUR_TOKEN),
    refreshInterval: -1
}))
```

2. 

##### My refresh token never expired, what should I do?


##### 
