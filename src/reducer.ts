import { SET_TOKEN, DELETE_TOKEN } from "./actions";
import * as omit from "lodash/omit";

export default (state = {}, action) => {
    switch (action.type) {
        case SET_TOKEN:
            return {
                ...state,
                [action.payload.id]: {
                    ...action.payload.token,
                },
            };
        case DELETE_TOKEN:
            return {
                ...omit(state, action.payload.id),
            };
    }
    return state;
};
