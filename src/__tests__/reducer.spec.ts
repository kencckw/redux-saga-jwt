import { SET, REMOVE } from "./../actions";
import { createReducer } from "../reducer";

describe("Reducers", () => {
    let mockConfigs: any;
    beforeEach(() => {
        mockConfigs = {
            getTokens: jest.fn(),
        };
    });

    describe("createReducer", () => {
        it("should return a reducer", () => {
            expect(typeof createReducer(mockConfigs)).toEqual("function");
            expect(mockConfigs.getTokens).toHaveBeenCalledTimes(1);
        });
    });

    describe("reducer", () => {
        it("should return correct initial values", () => {
            mockConfigs.getTokens.mockReturnValue("mock storage value");
            const reducer = createReducer(mockConfigs);
            expect(reducer(undefined, {})).toEqual("mock storage value");
        });

        it("should set token correctly", () => {
            const reducer = createReducer(mockConfigs);
            const result = reducer({}, {type: SET, payload: { id: "test", token: {accessToken: "test access token"}}});
            expect(result).toEqual({test: {accessToken: "test access token"}});

            const result2 = reducer(result, {type: SET, payload: { id: "test2", token: {accessToken: "test access token2"}}});
            expect(result2).toEqual({
                test: {accessToken: "test access token"},
                test2: {accessToken: "test access token2"},
            });
        });

        it("should remove token correctly", () => {
            const reducer = createReducer(mockConfigs);
            const state: any = {
                test: {accessToken: "test access token"},
                test2: {accessToken: "test access token2"},
            };
            const result = reducer(state, {type: REMOVE, payload: { id: "test"}});
            expect(result).toEqual({
                test2: {accessToken: "test access token2"},
            });

            const result2 = reducer(result, {type: REMOVE, payload: { id: "test2"}});
            expect(result2).toEqual({});
        });

        it("should return state by default", () => {
            const reducer = createReducer(mockConfigs);
            const state: any = "mock store";
            const result = reducer(state, {type: "OTHER_ACTION"});
            expect(result).toEqual("mock store");
        });
    });
});
