import * as React from "react";
import {connect} from "react-redux";
import { myAppSelector } from "./jwt";
import { actions } from "./api";
import { bindActionCreators, Dispatch } from "redux";
import "./style.css";

const formatTime = (timestamp: number) => {
  return timestamp ? new Date(timestamp).toISOString() : "";
};

const App = ({status, expired, numberOfRefresh, myAppToken, login, logout}) => {
  return <div>
    <div className="card" style={{width: 360}}>
      <div className="title">My Site</div>
      <div className="container">
        <p><b>Created at:</b> {formatTime(myAppToken.createdAt)}</p>
        <p><b>Expires in:</b> {formatTime(myAppToken.createdAt + myAppToken.expiresIn)}</p>
        <p><b>Access token:</b> {myAppToken.accessToken}</p>
        <p><b>Refresh token:</b> {myAppToken.refreshToken}</p>
        <p><b>Expired:</b> {expired ? "Yes" : "No"}</p>
        <p><b>Refresh counter:</b> {numberOfRefresh}</p>
        <p><b>Request:</b> {status}</p>
        <div style={{marginBottom: 8, textAlign: "right"}}>
          {
            myAppToken.accessToken
              ?  <button onClick={logout} className="btn" disabled={Boolean(status)}>Logout</button>
              : <button onClick={login} className="btn"  disabled={Boolean(status)}>Login</button>
          }
        </div>
      </div>
    </div>
  </div>;
};

const mapStateToProps = (state: any) => ({
    status: state.api.status,
    numberOfRefresh: state.api.numberOfRefresh,
    expired: myAppSelector.isTokenExpired(state),
    myAppToken: myAppSelector.getToken(state) || {},
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  login: actions.login,
  logout: actions.logout,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App) as any;
