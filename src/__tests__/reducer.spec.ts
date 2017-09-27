import reducer from "../reducer";
import actions from "../actions";

describe("Reducers", () => {
    describe("setToken", () => {
        it("should setToken correctly", () => {
            const tokenObject = {
                token_type: "Bearer",
                access_token: "abcd",
                refresh_token: "1234",
                expires_in: 3600,
                last_updated: new Date().valueOf(),
            };
            expect(reducer(undefined, actions("test").setToken(tokenObject))).toEqual({ test: tokenObject });
        });
    });
    describe("deleteToken", () => {
        it("should deleteToken correctly", () => {
            const tokenObject = {
                token_type: "Bearer",
                access_token: "abcd",
                refresh_token: "1234",
                expires_in: 3600,
                last_updated: new Date().valueOf(),
            };
            expect(reducer({ test: tokenObject }, actions("test").deleteToken())).toEqual({});
            expect(reducer({ test: tokenObject }, actions("test1").deleteToken())).toEqual({ test: tokenObject });
        });
    });

    describe("other action", () => {
        it("should do nothing", () => {
            const tokenObject = {
                token_type: "Bearer",
                access_token: "abcd",
                refresh_token: "1234",
                expires_in: 3600,
                last_updated: new Date().valueOf(),
            };
            expect(reducer({ test: tokenObject }, { type: "aaa" })).toEqual({ test: tokenObject });
        });
    });
});
