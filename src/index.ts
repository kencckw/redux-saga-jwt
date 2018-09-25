import { createSelectors } from "./selectors";
import { createReducer } from "./reducer";
import { IJWTConfig } from "./interface";
import { defaultConfigs } from "./defaultConfigs";
import { createRootSaga } from "./sagas";

export {createActionCreators, SET, REMOVE, EXPIRED} from "./actions";
export {isTokenExpired} from "./utils";

export const createJWT = <S>(configs?: Partial<IJWTConfig<S>>) => {
    const mergedConfigs: IJWTConfig<S> = {
        ...defaultConfigs,
        ...configs,
    };
    return {
        reducer: createReducer(mergedConfigs),
        saga: createRootSaga(mergedConfigs),
        createSelectors: createSelectors(mergedConfigs),
    };
};

export default createJWT;
