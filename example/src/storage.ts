import {JWTState} from "redux-saga-jwt";
import {delay} from "./utils";

export class Storage {
  public static async setToken(state: JWTState) {
    await delay(1500);
    window.localStorage.setItem('jwt', JSON.stringify(state))
  }

  public static async getToken() {
    await delay(1500);
    return JSON.parse(window.localStorage.getItem('jwt') || '{}')
  }
}
