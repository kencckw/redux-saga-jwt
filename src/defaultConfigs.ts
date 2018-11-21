import {IJWTConfig} from "./interface";

export const defaultConfigs: IJWTConfig<any> = {
    getTokens: () => {
        const token = localStorage.getItem("jwt");
        if (token) {
            try {
                return JSON.parse(token);
            } catch (e) {}
        }
        return {};
    },
    setTokens: tokens => localStorage.setItem("jwt", JSON.stringify(tokens)),
    stateSelector: state => state.jwt,
};

export default defaultConfigs;
