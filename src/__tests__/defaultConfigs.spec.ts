import { defaultConfigs } from "../defaultConfigs";

describe("Default config", () => {
    it("should contains correct values", () => {
        expect(typeof defaultConfigs.getTokens).toEqual("function");
        expect(typeof defaultConfigs.setTokens).toEqual("function");
        expect(typeof defaultConfigs.stateSelector).toEqual("function");
    });

    describe("getTokens", () => {
        it("should get token from localStorage correctly", () => {
            localStorage.setItem("jwt", JSON.stringify({test: "123"}));
            expect(defaultConfigs.getTokens()).toEqual({test: "123"});
        });

        it("should not throw error if localStorage is undefined", () => {
            localStorage.removeItem("jwt");
            expect(defaultConfigs.getTokens()).toEqual(null);
        });
    });

    describe("setToken", () => {
        it("should get token from localStorage correctly", () => {
            defaultConfigs.setTokens({
                123: null,
            });
            expect(localStorage.getItem("jwt")).toEqual(JSON.stringify({123: null}));
        });
    });

    describe("stateSelector", () => {
        it("should return correct value", () => {
            const state = {
                jwt: {
                    foo: 1,
                },
            };
            expect(defaultConfigs.stateSelector(state)).toEqual({ foo: 1});
        });
    });
});
