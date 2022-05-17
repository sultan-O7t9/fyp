import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AllCommittees from "./pages/AllCommittees";
import AllGroups from "./pages/AllGroups";
import AllStudents from "./pages/AllStudents";
import Dashboard from "./pages/Dashboard";
import DeliverableDetail from "./pages/DeliverableDetail";
import GroupDetail from "./pages/GroupDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterGroup from "./pages/RegisterGroup";
import SubmitProjectTitle from "./pages/SubmitProjectTitle";
import { logoutUser, readUser, refreshAuthToken } from "./store/actions/auth";

const App = () => {
  const [roles, setRoles] = useState([]);
  const token = useSelector(state => state.auth.accessToken);
  const history = useHistory();
  const dispatch = useDispatch();
  dispatch(readUser());
  //request interceptor to add the auth token header to requests
  axios.interceptors.request.use(
    config => {
      if (config.url === "http://localhost:5000/api/auth/login") return config;
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["x-auth-token"] = accessToken;
      }
      return config;
    },
    error => {
      Promise.reject(error);
    }
  );

  //response interceptor to refresh token on receiving token expired error
  axios.interceptors.response.use(
    response => {
      return response;
    },
    function (error) {
      const originalRequest = error.config;
      let refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken && error.response.status === 401) {
        return axios
          .post("http://localhost:5000/api/auth/refresh", {
            token: refreshToken,
          })
          .then(res => {
            dispatch(
              refreshAuthToken(res.data.accessToken, res.data.refreshToken)
            );
            // localStorage.setItem("accessToken", res.data.accessToken);
            // localStorage.setItem("refreshToken", res.data.refreshToken);

            console.log("Access token refreshed!");
            return axios(originalRequest);
          })
          .catch(error => {
            dispatch(logoutUser());
            history.replace("/login");
          });
      } else return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (token) {
      const data = jwt_decode(token);
      if (data.hasOwnProperty("role")) {
        setRoles(data.role);
      }
    }
  }, [token]);

  return (
    <Switch>
      {/* <Route exact path="/committees" component={AllCommittees} /> */}
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      {roles && roles.includes("STUDENT") ? (
        <>
          <ProtectedRoute
            exact
            path="/register-group"
            component={RegisterGroup}
          />
          <ProtectedRoute
            exact
            path="/register-project"
            component={SubmitProjectTitle}
          />
        </>
      ) : null}
      <MainLayout>
        <ProtectedRoute exact path="/" component={Dashboard} />
        {(roles && roles.includes("PMO")) ||
        (roles && roles.includes("SUPERVISOR")) ||
        (roles && roles.includes("EVALUATOR")) ? (
          <>
            <ProtectedRoute exact path="/groups" component={AllGroups} />
            <ProtectedRoute exact path="/groups/:id" component={GroupDetail} />
            <ProtectedRoute exact path="/students" component={AllStudents} />
            <ProtectedRoute
              exact
              path="/committees"
              component={AllCommittees}
            />
            <ProtectedRoute
              exact
              path="/deliverable/:id"
              component={DeliverableDetail}
            />
          </>
        ) : null}
      </MainLayout>
      <Route
        path="/"
        component={() => (
          <div
            style={{
              display: "flex",
              minHeight: "300px",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontFamily: "sans-serif",
                color: "purple",
                fontSize: "4rem",
              }}
            >
              Error 404
            </h1>
            <h3
              style={{
                fontFamily: "sans-serif",
                color: "purple",
                fontSize: "2.5rem",
              }}
            >
              Page not found
            </h3>
          </div>
        )}
      />
    </Switch>
  );
};

export default App;
