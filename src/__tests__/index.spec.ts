import { IStorageService } from "../interface";
import root, { initialize, updateToken, listenAction, startCountdownTimer, countdownTimer, cancelCountdownTimer } from "../";
import { takeEvery, ForkEffect, put, call, select, race, take } from "redux-saga/effects";
import { delay } from "redux-saga";
import createAction, { START_COUNTDOWN_TIMER, SET_TOKEN, DELETE_TOKEN, CANCEL_COUNTDOWN_TIMER } from "../actions";
import { jwtSelector } from "../selectors";

class MockStorage implements IStorageService {
    public token: any;

    public *getToken() {
        return this.token;
    }

    public *setToken(token) {
        this.token = token;
    }
}

const mockToken = {
    validToken: { token_type: "Bearer", access_token: "abcd", refresh_token: "1234", expires_in: 3600, last_updated: 1500000000000 },
    expiredToken: { token_type: "Bearer", access_token: "abcd", refresh_token: "1234", expires_in: 3600, last_updated: 1400000000000 },
};

describe("Sagas", () => {
    describe("initialize", () => {
        it("should do nothing when token is null or undefined", () => {
            const mockStorageInstance = new MockStorage();
            const gen: any = initialize(mockStorageInstance)();
            expect(gen.next().value).toEqual(call(mockStorageInstance.getToken));
            expect(gen.next().value).toEqual(undefined);
        });

        it("should start a timer for valid token and notify expired token", () => {
            const mockStorageInstance = new MockStorage();
            const mockNow = new Date(1500000000000);

            global.Date = jest.fn(() => mockNow) as any;
            const gen: any = initialize(mockStorageInstance)();
            expect(gen.next().value).toEqual(call(mockStorageInstance.getToken));
            expect(gen.next(mockToken).value).toEqual(
                put(createAction("validToken").setToken(
                    { token_type: "Bearer", access_token: "abcd", refresh_token: "1234", expires_in: 3600, last_updated: 1500000000000 },
                )),
            );

            expect(gen.next().value).toEqual(
                put(createAction("expiredToken").onTokenExpired(
                    { token_type: "Bearer", access_token: "abcd", refresh_token: "1234", expires_in: 3600, last_updated: 1400000000000 },
                )),
            );
            expect(gen.next().value).toEqual(undefined);
        });
    });

    describe("updateToken", () => {
        it("should set token and start timer", () => {
            const mockStorageInstance = new MockStorage();
            const gen: any = updateToken(mockStorageInstance)(createAction("validToken").setToken(mockToken.validToken));
            expect(gen.next().value).toEqual(select(jwtSelector));
            expect(gen.next(mockToken.validToken).value).toEqual(call(mockStorageInstance.setToken, mockToken.validToken));
            expect(gen.next().value).toEqual(put(createAction("validToken").startCountdownTimer(mockToken.validToken.expires_in)));
            expect(gen.next()).toEqual({ done: true, value: undefined });
        });

        it("should set token and stop timer", () => {
            const mockStorageInstance = new MockStorage();
            const gen: any = updateToken(mockStorageInstance)(createAction("validToken").deleteToken());
            expect(gen.next().value).toEqual(select(jwtSelector));
            expect(gen.next(mockToken.validToken).value).toEqual(call(mockStorageInstance.setToken, mockToken.validToken));
            expect(gen.next().value).toEqual(put(createAction("validToken").cancelCountdownTimer()));
            expect(gen.next()).toEqual({ done: true, value: undefined });
        });
    });

    describe("listenAction", () => {
        const mockStorageInstance = new MockStorage();
        const gen: any = listenAction(mockStorageInstance)();
        expect(gen.next().value).toHaveLength(3);
        expect(gen.next().value).toEqual(undefined);
    });
    describe("startCountdownTimer", () => {
        const mockStorageInstance = new MockStorage();
        const gen: any = startCountdownTimer(createAction("test").startCountdownTimer(3600));
        expect(gen.next().value).toEqual(race({
            task: call(countdownTimer, "test", 3600),
            cancel: call(cancelCountdownTimer as any, "test"),
        }));
        expect(gen.next().value).toEqual(undefined);
    });

    describe("countdownTimer", () => {
        const mockStorageInstance = new MockStorage();
        const gen: any = countdownTimer("test", 3600);
        expect(gen.next().value).toEqual(call(delay, 3600));
        expect(gen.next().value).toEqual(select(jwtSelector));
        expect(gen.next({ test: mockToken.validToken }).value).toEqual(put(createAction("test").onTokenExpired(mockToken.validToken)));
        expect(gen.next().value).toEqual(undefined);
    });

    describe("cancelCountdownTimer", () => {
        it("should cancel the timer if id is the same", () => {
            const mockStorageInstance = new MockStorage();
            const gen: any = cancelCountdownTimer("test");
            expect(gen.next().value).toEqual(take(CANCEL_COUNTDOWN_TIMER));
            expect(gen.next(createAction("test1").cancelCountdownTimer()).value).toEqual(take(CANCEL_COUNTDOWN_TIMER));
            expect(gen.next(createAction("test").cancelCountdownTimer()).value).toEqual(undefined);
        });
        it("should end while loop", () => {
            const mockStorageInstance = new MockStorage();
            const gen: any = cancelCountdownTimer("test", false);
            expect(gen.next().value).toEqual(undefined);
        });
    });

    describe("rootSaga", () => {
        it("custom storage", () => {
            const mockStorageInstance = new MockStorage();
            const gen: any = root(mockStorageInstance)();
            expect(gen.next().value).toHaveLength(2);
            expect(gen.next().value).toEqual(undefined);
        });
        it("default storage", () => {
            const gen: any = root()();
            expect(gen.next().value).toHaveLength(2);
            expect(gen.next().value).toEqual(undefined);
        });
    });
});
