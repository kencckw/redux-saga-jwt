import { JWTConfigs, TokenObject } from '../types';

export const createSelectors = <S, T extends TokenObject>(
  configs: JWTConfigs<S, T>
) => (id: string) => ({
  getToken: (state: S) => (configs.stateSelector(state) || {})[id] as T,
  isAuthenticated: (state: S) => {
    return Boolean((configs.stateSelector(state) || {})[id]?.accessToken);
  },
  isInitialized: (state: S) => Boolean(configs.stateSelector(state))
});
