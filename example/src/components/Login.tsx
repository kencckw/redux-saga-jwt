import React, {FC, useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {LoginService} from "../api";
import {actionCreators} from "../redux";

export const Login: FC = () => {
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const login = useCallback(async () => {
    setLoading(true)
    const token = await LoginService.login();
    setLoading(false)
    dispatch(actionCreators.set(token))
  }, [dispatch, setLoading])

  return <button onClick={login} disabled={isLoading}>Login</button>
}
