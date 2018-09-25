import { ITokenObject, IJWTConfig } from "./interface";
import { isTokenExpired } from "./utils";

export const createSelectors = <S>(configs: IJWTConfig<S>) => (id: string) => ({
    getToken: (state: S) => (configs.stateSelector(state) || {})[id],
    isTokenExpired: (state: S): boolean => {
        const token: ITokenObject = (configs.stateSelector(state) || {})[id];
        if (!token) {
            return true;
        }
        return isTokenExpired(token);
    },
});

export default createSelectors;
