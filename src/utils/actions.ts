export function action(type: string, payload: any = {}) {
    return { type, payload };
}
