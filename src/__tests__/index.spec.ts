import * as reducer from "../reducer";
import * as sagas from "../sagas";
import * as selectors from "../selectors";

import { createJWT } from "../index";

describe("createJWT", () => {
    it("should create object correctly", () => {
        const mockCreateReducer = jest.spyOn(reducer, "createReducer").mockReturnValue("test createReducer");
        const mockCreateRootSaga = jest.spyOn(sagas, "createRootSaga").mockReturnValue("test createRootSaga");
        const mockCreateSelectors = jest.spyOn(selectors, "createSelectors").mockReturnValue("test createSelectors");
        const config: any = {
            setTokens: "test setToken",
            getTokens: "test getToken",
            stateSelector: "test stateSelector",
        };
        expect(createJWT(config)).toEqual({
            createSelectors: "test createSelectors",
            reducer: "test createReducer",
            saga: "test createRootSaga",
        });

        expect(mockCreateReducer).toBeCalledWith(config);
        expect(mockCreateRootSaga).toBeCalledWith(config);
        expect(mockCreateSelectors).toBeCalledWith(config);
    });
});
