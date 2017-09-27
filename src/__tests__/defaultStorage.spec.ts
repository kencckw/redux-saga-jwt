const storage = {};
const setItem = (key, value) => {
    storage[key] = value;
};

const getItem = key => storage[key];
const mockLocalStorage = {
    setItem,
    getItem,
};

jest.mock("localStorage", () => (mockLocalStorage));

import defaultStorage from "../defaultStorage";

describe("defaultStorage", () => {
    it("should set the value correctly", () => {
        defaultStorage.setToken({ a: 1 });
        expect(storage).toEqual({
            token: "{\"a\":1}",
        });
    });
    it("should get the value correctly", () => {
        expect(defaultStorage.getToken()).toEqual({ a: 1 });
    });

});
