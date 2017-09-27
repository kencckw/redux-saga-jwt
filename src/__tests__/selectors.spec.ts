import createSelector from "../selectors";

describe("Selectors", () => {
    describe("getTokenObject", () => {
        it("should return then correct token object", () => {
            expect(createSelector("test").getTokenObject({ reduxSagaJwt: { test: { token_type: "a" } } })).toEqual({ token_type: "a" });
            expect(createSelector("test1").getTokenObject({ reduxSagaJwt: { test: { token_type: "a" } } })).toEqual(null);
        });
    });

    describe("isTokenExpired", () => {
        it("should return then correct value", () => {
            const mockNow = new Date(1500000000000);
            global.Date = jest.fn(() => mockNow) as any;
            expect(createSelector("test").isTokenExpired({
                reduxSagaJwt: {
                    test:
                    { token_type: "Bearer", access_token: "abcd", refresh_token: "1234", expires_in: 3600, last_updated: 1500000000000 },
                },
            })).toEqual(false);
            expect(createSelector("test").isTokenExpired({
                reduxSagaJwt: {
                    test:
                    { token_type: "Bearer", access_token: "abcd", refresh_token: "1234", expires_in: 3600, last_updated: 1499996399999 },
                },
            })).toEqual(true);
            expect(createSelector("test").isTokenExpired({
                reduxSagaJwt: {},
            })).toEqual(true);
        });
    });
});
