import { createJWT, createActionCreators } from "redux-saga-jwt";

const jwt = createJWT();

export const myAppSelector = jwt.createSelectors("myApp");
export const myAppActions = createActionCreators("myApp");

export default jwt;
