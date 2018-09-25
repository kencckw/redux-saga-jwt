import { SET, REMOVE } from "./actions";
import { IJWTConfig, IJWTState } from "./interface";

export const createReducer = <S>(configs: IJWTConfig<S>) => {
    const initialState = configs.getTokens();
    return (state: IJWTState = initialState , action) => {
        const {type, payload} = action;
        if (type === SET) {
            return {
                ...state,
                [payload.id]: payload.token,
            };
        } else if (type === REMOVE) {
            const { [payload.id]: value, ...newState} = state;
            return newState;
        }
        return state;
    };
};
