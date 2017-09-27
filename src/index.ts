import { delay } from "redux-saga";
import { take, put, call as rawCall, fork, race, select, takeEvery } from "redux-saga/effects";
import { isTokenExpired } from "./selectors";

import actions, { START_COUNTDOWN_TIMER, CANCEL_COUNTDOWN_TIMER, SET_TOKEN, DELETE_TOKEN } from "./actions";
import { IStorageService, ITokenObject } from "./interface";
import defaultStorageService from "./defaultStorage";
import { jwtSelector } from "./selectors";
const call: any = rawCall;

export default (storageService: IStorageService = defaultStorageService) => {
    return function* listen(): any {
        yield [
            fork(initialize(storageService)),
            fork(listenAction(storageService)),
        ];
    };
};

export const initialize = (storageService: IStorageService) => function* init() {

    const tokens: ITokenObject = yield call(storageService.getToken);

    if (!tokens) {
        return;
    }
    const currentTimestamp = new Date().valueOf();

    for (const id of Object.keys(tokens)) {
        const token: ITokenObject = tokens[id];
        if (!isTokenExpired(currentTimestamp, token.last_updated, token.expires_in)) {
            yield put(actions(id).setToken(token)); // sync token into reducer
        } else {
            yield put(actions(id).onTokenExpired(token));
        }
    }
};

export const updateToken = (storageService: IStorageService) => function* _updateToken(action: any): any {
    const { id } = action.payload;
    const tokens = yield select(jwtSelector);
    yield call(storageService.setToken, tokens);
    if (action.type === SET_TOKEN) {
        yield put(actions(id).startCountdownTimer(action.payload.token.expires_in));
        return;
    }
    yield put(actions(id).cancelCountdownTimer());
};

export const listenAction = (storageService: IStorageService) => function* _listenUpdateToken(): any {
    yield [
        call(takeEvery, SET_TOKEN, updateToken(storageService)),
        call(takeEvery, DELETE_TOKEN, updateToken(storageService)),
        call(takeEvery, START_COUNTDOWN_TIMER, startCountdownTimer),
    ];
};

export function* startCountdownTimer(action): any {
    const { id, expiresIn } = action.payload;
    yield race({
        task: call(countdownTimer, id, expiresIn),
        cancel: call(cancelCountdownTimer, id),
    });
}

export function* countdownTimer(id: string, expiresIn: number) {
    yield call(delay, expiresIn);
    const tokens = yield select(jwtSelector);
    yield put(actions(id).onTokenExpired(tokens[id]));
}

export function* cancelCountdownTimer(id: string, t = true): any {
    while (t) {
        const action = yield take(CANCEL_COUNTDOWN_TIMER);
        if (action.payload.id === id) {
            return;
        }
    }
}
