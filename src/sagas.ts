import { IJWTConfig, IJWTState } from "./interface";
import { SET, REMOVE, createActionCreators } from "./actions";
import { spawn, all, race, take, select, call, put, takeEvery } from "redux-saga/effects";
import { delay } from "redux-saga";
import { isTokenExpired } from "./utils";

export function* timer(id: string, ms: number) {
    const { timeout } = yield race({
        timeout: call(delay, ms),
        cancel: call(takeRemove, id),
    });

    if (timeout) {
        yield put(createActionCreators(id).expired());
    }
}

export function* takeRemove(id: string) {
    while (true) {
        const action = yield take(REMOVE);
        if (action.payload.id === id) {
            return true;
        }
    }
}

export const syncToken = (configs: IJWTConfig<any>) => function*() {
    const tokens = yield select(configs.stateSelector);
    configs.setTokens(tokens);
};

export const setTokenHandler = (configs: IJWTConfig<any>) => function*(action) {
    const {
        id,
        token: {
            expiresIn,
        },
    } = action.payload;
    yield all([
        spawn(timer, id, expiresIn),
        syncToken(configs)(),
    ]);
};

export const checkExpiredWhenInitialize = (configs: IJWTConfig<any>) => function*() {
    const tokens: IJWTState = yield select(configs.stateSelector);
    const expiredTokenIds = Object.keys(tokens).filter(
        id => isTokenExpired(tokens[id]),
    );

    if (!expiredTokenIds.length) {
        return;
    }
    yield all(expiredTokenIds.map(id => put(createActionCreators(id).expired())));
};

export const createRootSaga = (configs: IJWTConfig<any>) => {
    return function* rootSaga() {
        yield all([
            checkExpiredWhenInitialize(configs)(),
            takeEvery(SET, setTokenHandler(configs)),
            takeEvery(REMOVE, syncToken(configs)),
        ]);
    };
};

export default createRootSaga;
