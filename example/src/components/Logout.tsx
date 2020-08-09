import React, {FC, useCallback} from "react";
import {useDispatch} from "react-redux";
import {actionCreators} from "../redux";

export const Logout: FC = () => {
  const dispatch = useDispatch()
  const logout = useCallback(() => {
    dispatch(actionCreators.remove())
  }, [dispatch])

  return <button onClick={logout}>Logout</button>
}
