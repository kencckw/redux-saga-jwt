import { JWTConfigs, TokenObject } from '../types';
import defaultConfigs from './defaultConfigs';
import { reducer } from './reducer';
import { createSaga } from './saga';
import { createSelectors } from './selectors';

export const createJWT = <S, T extends TokenObject>(
  configs?: JWTConfigs<S, T>
) => {
  const mergedConfigs = {
    ...defaultConfigs,
    ...configs
  };

  return {
    createSelectors: createSelectors<S, T>(mergedConfigs),
    reducer,
    saga: createSaga<S, T>(mergedConfigs).rootSaga
  };
};
