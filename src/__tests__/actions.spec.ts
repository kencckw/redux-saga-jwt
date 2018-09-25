import { createActionCreators,  SET, REMOVE, EXPIRED } from "../actions";

describe("Actions", () => {
    const id = "test";
    const actionCreators = createActionCreators(id);

    it("should create action creators", () => {
        expect(typeof actionCreators.set).toEqual("function");
        expect(typeof actionCreators.remove).toEqual("function");
        expect(typeof actionCreators.expired).toEqual("function");
    });

    it("should should create an action to set token", () => {
        const token = {
            accessToken: "accessToken",
            refreshToken: "refreshToken",
            expiresIn: 1,
            createdAt: 2,
        };
        const action = actionCreators.set(token);
        expect(action).toEqual({
            type: SET,
            payload: {
                id,
                token,
            },
        });
    });

    it("should should create an action to remove token", () => {
        const action = actionCreators.remove();
        expect(action).toEqual({
            type: REMOVE,
            payload: {
                id,
            },
        });
    });

    it("should should create an action to expire token", () => {
        const action = actionCreators.expired();
        expect(action).toEqual({
            type: EXPIRED,
            payload: {
                id,
            },
        });
    });

});
