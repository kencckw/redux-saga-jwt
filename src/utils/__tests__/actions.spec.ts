import { action } from "../actions";

describe("action", () => {
    describe("create action", () => {
        it("test create action", () => {
            expect(action("TYPE", { params: 1 })).toEqual({ type: "TYPE", payload: { params: 1 } });
        });
        it("test create action with no params", () => {
            expect(action("TYPE")).toEqual({ type: "TYPE", payload: {} });
        });
    });
});
