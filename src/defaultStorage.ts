import * as localStorage from "localStorage";
import * as Interfaces from "./interface";

export class DefaultStorageService implements Interfaces.IStorageService {
    public setToken(token) {
        localStorage.setItem("token", JSON.stringify(token));
    }

    public getToken(): Interfaces.ITokenObject {
        const token: any = localStorage.getItem("token");
        return JSON.parse(token);
    }
}

export default new DefaultStorageService();
