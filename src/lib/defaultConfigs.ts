import { put } from 'redux-saga/effects';
import { JWTConfigs } from '../types';
import { remove } from './actions';

const defaultConfigs: Partial<JWTConfigs> = {
  *tokenExpired(id: string) {
    yield put(remove(id));
  },
  stateSelector: state => state.jwt
};

export default defaultConfigs;
