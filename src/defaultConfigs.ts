import { IJWTConfig } from "./interface";

export const defaultConfigs: IJWTConfig<any> = {
    getTokens: () => JSON.parse(localStorage.getItem("jwt") || null),
    setTokens: tokens => localStorage.setItem("jwt", JSON.stringify(tokens)),
    stateSelector: state => state.jwt,
};

export default defaultConfigs;
