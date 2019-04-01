import * as actions from "../actions";
import * as sagas from "../sagas";
import * as utils from "../utils";
import { call, race, put, take, select, all, spawn, takeEvery, delay } from "redux-saga/effects";

describe("Sagas", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("timer", () => {
        it("should not call expired when timer is cancelled", () => {
            const gen = sagas.timer("test", 1000);
            expect(gen.next().value).toEqual(race({
                timeout: delay(1000),
                cancel: call(sagas.takeRemove, "test"),
            }));

            expect(gen.next({timeout: false}).value).toEqual(undefined);
        });

        it("should call expired correctly", () => {
            const mockAction: any = {action: "EXPIRED", payload: { id: "test"}};
            const mockExpiredActionCreator = jest.fn().mockReturnValue(mockAction);
            const mockCreateActionCreators = jest.spyOn(actions, "createActionCreators").mockReturnValue({
                expired: mockExpiredActionCreator,
            });
            const gen = sagas.timer("test", 1000);
            expect(gen.next().value).toEqual(race({
                timeout: delay(1000),
                cancel: call(sagas.takeRemove, "test"),
            }));

            expect(gen.next({timeout: true}).value).toEqual(put(mockAction));
            expect(mockCreateActionCreators).toBeCalledWith("test");
            expect(mockCreateActionCreators).toHaveBeenCalledTimes(1);
            expect(mockExpiredActionCreator).toHaveBeenCalledTimes(1);

            expect(gen.next().done).toBeTruthy();
        });
    });

    describe("takeRemove", () => {
        it("should not end looping if id or action type not matched", () => {
            const gen = sagas.takeRemove("test");
            expect(gen.next().value).toEqual(take(actions.REMOVE));
            expect(gen.next({payload: "test1"}).value).toEqual(take(actions.REMOVE));
            expect(gen.next({payload: {id: "test1"} }).value).toEqual(take(actions.REMOVE));
        });

        it("should return true if id matched", () => {
            const gen = sagas.takeRemove("test");
            expect(gen.next().value).toEqual(take(actions.REMOVE));
            expect(gen.next({type: actions.REMOVE, payload: {id: "test"}}).value).toEqual(true);
            expect(gen.next().done).toBeTruthy();
        });
    });

    describe("syncToken", () => {
        let configs;
        let syncToken;
        beforeEach(() => {
            configs = {
                stateSelector: jest.fn(),
                setTokens: jest.fn(),
            };
            syncToken = sagas.syncToken(configs);
        });

        it("should sync token correctly", () => {
            const gen = syncToken();
            expect(gen.next().value).toEqual(select(configs.stateSelector));
            expect(gen.next("mock tokens").done).toBeTruthy();
            expect(configs.setTokens).toBeCalledWith("mock tokens");
        });
    });

    describe("setTokenHandler", () => {
        it("should start timer and sync token correctly", () => {
            const configs: any = "configs";
            const action = {payload: {id: "test", token: {expiresIn: 1000}}};
            const setTokenHandler = sagas.setTokenHandler(configs);
            const gen = setTokenHandler(action);
            const mockSyncToken = jest.spyOn(sagas, "syncToken").mockReturnValue(jest.fn());
            expect(gen.next().value).toEqual(all([
                spawn(sagas.timer, "test", 1000),
                mockSyncToken("configs")(),
            ]));

            expect(gen.next().done).toBeTruthy();
        });
    });

    describe("checkExpiredWhenInitialize", () => {
        let configs;
        let checkExpiredWhenInitialize;
        let mockIsTokenExpired;
        beforeEach(() => {
            configs = {
                stateSelector: jest.fn().mockReturnValue({}),
            };
            checkExpiredWhenInitialize = sagas.checkExpiredWhenInitialize(configs);
            mockIsTokenExpired = jest.spyOn(utils, "isTokenExpired");
        });

        it("should return if no expired token", () => {
            const gen = checkExpiredWhenInitialize();
            expect(gen.next().value).toEqual(select(configs.stateSelector));
            expect(gen.next({}).done).toBeTruthy();
        });

        it("should dispatch expired for each expired token", () => {
            const gen = checkExpiredWhenInitialize();
            mockIsTokenExpired.mockReturnValue(true);
            gen.next();
            expect(gen.next({
                test: "",
                test1: "",
            }).value).toEqual(all([
                put(actions.createActionCreators("test").expired()),
                put(actions.createActionCreators("test1").expired()),
            ]));

            expect(gen.next().done).toBeTruthy();
        });
    });

    describe("createRootSaga", () => {
        it("should start sub sagas correctly", () => {
            jest.spyOn(sagas, "checkExpiredWhenInitialize").mockReturnValue(jest.fn());
            jest.spyOn(sagas, "setTokenHandler").mockReturnValue(jest.fn());
            jest.spyOn(sagas, "syncToken").mockReturnValue(jest.fn());
            const configs: any = "configs";

            const createRootSaga = sagas.createRootSaga(configs);
            const gen = createRootSaga();
            expect(gen.next().value).toEqual(all([
                sagas.checkExpiredWhenInitialize(configs)(),
                takeEvery(actions.SET, sagas.setTokenHandler(configs)),
                takeEvery(actions.REMOVE, sagas.syncToken(configs)),
            ]));

            expect(gen.next().done).toBeTruthy();
        });
    });
});
