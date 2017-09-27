import createAction, { SET_TOKEN, DELETE_TOKEN, START_COUNTDOWN_TIMER, CANCEL_COUNTDOWN_TIMER, ON_TOKEN_EXPIRED } from "../actions";

describe("Actions", () => {
    describe("setToken", () => {
        it("should return the correct action object", () => {
            expect(createAction("test")
                .setToken(null))
                .toEqual({ type: SET_TOKEN, payload: { id: "test", token: null } });
        });
    });
    describe("deleteToken", () => {
        it("should return the correct action object", () => {
            expect(createAction("test")
                .deleteToken())
                .toEqual({ type: DELETE_TOKEN, payload: { id: "test" } });
        });
    });
    describe("onTokenExpired", () => {
        it("should return the correct action object", () => {
            expect(createAction("test")
                .onTokenExpired(null))
                .toEqual({ type: ON_TOKEN_EXPIRED, payload: { id: "test", token: null } });
        });
    });
    describe("onTokenExpired", () => {
        it("should return the correct action object", () => {
            expect(createAction("test")
                .startCountdownTimer(3600))
                .toEqual({ type: START_COUNTDOWN_TIMER, payload: { id: "test", expiresIn: 3600 } });
        });
    });

    describe("onTokenExpired", () => {
        it("should return the correct action object", () => {
            expect(createAction("test")
                .cancelCountdownTimer())
                .toEqual({ type: CANCEL_COUNTDOWN_TIMER, payload: { id: "test" } });
        });
    });
});
