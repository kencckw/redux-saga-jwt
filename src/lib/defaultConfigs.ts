import { JWTConfigs } from '../types';

const defaultConfigs: Partial<JWTConfigs> = {
  stateSelector: state => state.jwt
};

export default defaultConfigs;
