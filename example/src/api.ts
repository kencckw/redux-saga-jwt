import {TokenObject} from "redux-saga-jwt";
import {delay} from "./utils";

let count = 0;
const createToken = (): TokenObject => {
  ++count;
  return {
    accessToken: `accessToken-${count}`,
    refreshInterval: 5000, // in ms
    refreshToken: `refreshToken-${count}`,
  }
}

export class LoginService {
  public static async login() {
    await delay(1000);
    return createToken();
  }

  public static async refresh(token: string) {
    await delay(1000);
    return createToken();
  }
}
