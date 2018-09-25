import * as utils from "../utils";
import * as selectors from "../selectors";

describe("Selectors", () => {
    let configs;
    let selector;
    beforeEach(() => {
        configs = {
            stateSelector: jest.fn(),
        };
        selector = selectors.createSelectors(configs)("test");
    });

    describe("createSelector", () => {
        it("should create selectors by configs", () => {
            expect(typeof selectors.createSelectors(null)).toEqual("function");
            expect(typeof selectors.createSelectors(null)("id").getToken).toEqual("function");
            expect(typeof selectors.createSelectors(null)("id").isTokenExpired).toEqual("function");
        });
    });

    describe("getToken", () => {
        it("should return correct token", () => {
            configs.stateSelector.mockReturnValue({test: "token object"});
            expect(selector.getToken(null)).toEqual("token object");
        });

        it("should return undefined if tokenObject is null", () => {
            configs.stateSelector.mockReturnValue(undefined);
            expect(selector.getToken(null)).toEqual(undefined);
        });
    });

    describe("isTokenExpired", () => {
        it("should return true if token object is null or undefined", () => {
            expect(selector.isTokenExpired()).toEqual(true);
        });

        it("should return the result from isTokenExpired if token is not null", () => {
            configs.stateSelector.mockReturnValue({test: "token object"});
            const mockIsTokenExpired = jest.spyOn(utils, "isTokenExpired").mockReturnValue(true);
            expect(selector.isTokenExpired()).toEqual(true);
            expect(mockIsTokenExpired).toHaveBeenCalledTimes(1);
            expect(mockIsTokenExpired).toHaveBeenCalledWith("token object");
        });
    });
});
