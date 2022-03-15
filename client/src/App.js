import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AllGroups from "./pages/AllGroups";
import AllStudents from "./pages/AllStudents";
import Dashboard from "./pages/Dashboard";
import DeliverableDetail from "./pages/DeliverableDetail";
import GroupDetail from "./pages/GroupDetail";
import Login from "./pages/Login";
import { logoutUser, readUser, refreshAuthToken } from "./store/actions/auth";

const App = () => {
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
      }
    }
  );

  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <MainLayout>
        <ProtectedRoute exact path="/" component={Dashboard} />
        <ProtectedRoute exact path="/groups" component={AllGroups} />
        <ProtectedRoute exact path="/groups/:id" component={GroupDetail} />
        <ProtectedRoute exact path="/students" component={AllStudents} />
        <ProtectedRoute
          exact
          path="/deliverable/:id"
          component={DeliverableDetail}
        />
      </MainLayout>
    </Switch>
  );
};

export default App;
