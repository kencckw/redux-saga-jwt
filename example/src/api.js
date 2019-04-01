import { delay } from "redux-saga/effects";
import { put, takeEvery, all } from "redux-saga/effects";
import { EXPIRED } from "redux-saga-jwt";
import { myAppActions } from "./jwt";

const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";

const LOGOUT_REQUEST = "LOGOUT_REQUEST";
const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

const REFRESH_REQUEST = "REFRESH_REQUEST";
const REFRESH_SUCCESS = "REFRESH_SUCCESS";

const getToken = () => ({
    accessToken: Math.random().toString(36).substring(2),
    refreshToken: Math.random().toString(36).substring(2),
    expiresIn: 5000,
    createdAt: new Date().getTime(),
});

function* loginSaga() {
    yield delay(888);
    const tokenObject = getToken();
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
    const tokenObject = getToken();
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
