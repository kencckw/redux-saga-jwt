import { delay } from "redux-saga";
import { put, takeEvery, all } from "redux-saga/effects";
import { ITokenObject } from "../../src/interface";
import { EXPIRED } from "../../src/actions";
import { myAppActions } from "./jwt";

const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";

const LOGOUT_REQUEST = "LOGOUT_REQUEST";
const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

const REFRESH_REQUEST = "REFRESH_REQUEST";
const REFRESH_SUCCESS = "REFRESH_SUCCESS";

const token = {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZ1Y2sgeW91ISIsImlhdCI6MTUxNjIzOTAyMn0.jGAvnDWWhboe6Lc7hQ4p7S4dtGK4yzXFnUQfe9dHyTM",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZ1Y2sgeW91ISEiLCJpYXQiOjE1MTYyMzkwMjJ9.OxLRJwls7qRTT-CDt9eIMvNgLdyfHqJ7d-smYddAHfs",
    expiresIn: 5000,
};

const getToken = () => ({
    accessToken: Math.random().toString(36).substring(2),
    refreshToken: Math.random().toString(36).substring(2),
    expiresIn: 5000,
    createdAt: new Date().getTime(),
});

function* loginSaga() {
    yield delay(888);
    const tokenObject: ITokenObject = getToken();
    yield put(myAppActions.set(tokenObject));
    yield put({type: LOGIN_SUCCESS});
}

function* logoutSaga() {
    yield put(myAppActions.remove());
    yield delay(888);
    yield put({type: LOGOUT_SUCCESS});
}

function* refreshSaga() {
    yield put({type: REFRESH_REQUEST});
    yield delay(888);
    const tokenObject: ITokenObject = getToken();
    yield put(myAppActions.set(tokenObject));
    yield put({type: REFRESH_SUCCESS});
}

export default function* apiSaga() {
    yield all([
        takeEvery(LOGIN_REQUEST, loginSaga),
        takeEvery(LOGOUT_REQUEST, logoutSaga),
        takeEvery(EXPIRED, refreshSaga),
    ]);
}

export const actions = {
    login: () => ({type: LOGIN_REQUEST}),
    logout: () => ({type: LOGOUT_REQUEST}),
};

export function reducer(state = {numberOfRefresh: 0, isLoading: false}, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                status: "LOGIN_REQUEST",
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                status: "LOGOUT_REQUEST",
            };
        case REFRESH_REQUEST:
            return {
                ...state,
                status: "REFRESH_REQUEST",
            };
        case LOGIN_SUCCESS:
        case LOGOUT_SUCCESS:
            return {
                ...state,
                status: "",
            };
        case REFRESH_SUCCESS:
        return {
            ...state,
            status: "",
            numberOfRefresh: state.numberOfRefresh + 1,
        };
    }
    return state;
}
