import React, {FC} from "react";
import {useSelector} from "react-redux";

export const Store: FC = () => {
  const token = useSelector<any>(state => state.jwt)

  return <pre>Token: {JSON.stringify(token, null, 4)}</pre>
}
