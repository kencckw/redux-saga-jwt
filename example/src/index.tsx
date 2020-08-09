import * as React from "react";
import {render} from "react-dom";
import {Provider, useSelector} from 'react-redux'
import {Login} from "./components/Login";
import {Logout} from "./components/Logout";
import {Store} from "./components/Store";
import {selectors, store} from "./redux";

const App = () => {
  const isInitialized = useSelector(selectors.isInitialized)
  const isAuthenticated = useSelector(selectors.isAuthenticated)

  if (!isInitialized) {
    return <div>Loading tokens from Storage, Please wait...</div>
  }

  return <>
    <Store />
    {
      !isAuthenticated && <>
        <div>Please Login.</div>
        <Login />
      </>
    }
    {
      isAuthenticated && <>
        <div>Welcome!</div>
        <Logout />
      </>
    }
  </>
}

const rootElement = document.getElementById("root");
render(<Provider store={store}>
 <App />
</Provider>, rootElement);
