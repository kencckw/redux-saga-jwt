import { isTokenExpired } from "../utils";

describe("utils", () => {
    describe("isTokenExpired", () => {
        beforeAll(() => {
            const mockNow = new Date(1500000000000);
            global.Date = jest.fn(() => mockNow) as any;
        });
        it("should return false if token is valid", () => {
            const tokenObject: any = {
                expiresIn: 1,
                createdAt: 1500000000000,
            };
            expect(isTokenExpired(tokenObject)).toBeFalsy();
        });

        it("should return true if currentTime = createdAt + expiresIn", () => {
            const tokenObject: any = {
                expiresIn: 1,
                createdAt: 1500000000000 - 1,
            };
            expect(isTokenExpired(tokenObject)).toBeTruthy();
        });

        it("should return true if token is expired", () => {
            const tokenObject: any = {
                expiresIn: 1,
                createdAt: 1500000000000 - 2,
            };
            expect(isTokenExpired(tokenObject)).toBeTruthy();
        });
    });
});
