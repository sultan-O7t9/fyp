import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadFile from "./components/UploadFile";
import MainLayout from "./layouts/MainLayout";
import AdminAllGroups from "./pages/AdminAllGroups";
import AdminLogin from "./pages/AdminLogin";
import AdminManageDept from "./pages/AdminManageDept";
import AdminManageFaculty from "./pages/AdminManageFaculty";
import AllCommittees from "./pages/AllCommittees";
import AllGroups from "./pages/AllGroups";
import AllStudents from "./pages/AllStudents";
import D2SubmissionPage from "./pages/D2SubmissionPage";
import D3SubmissionPage from "./pages/D3SubmissionPage";
import Dashboard from "./pages/Dashboard";
import DeliverableDetail from "./pages/DeliverableDetail";
import GroupDashboard from "./pages/GroupDashboard";
import GroupDetail from "./pages/GroupDetail";
import GroupLogin from "./pages/GroupLogin";
import Login from "./pages/Login";
import ProposalSubmissionPage from "./pages/ProposalSubmissionPage";
import Register from "./pages/Register";
import RegisterGroup from "./pages/RegisterGroup";
import SubmitProjectTitle from "./pages/SubmitProjectTitle";
import SupervisorDocumentation from "./pages/SupervisorDocumentation";
import SupervisorFinalDeliverable from "./pages/SupervisorFinalDeliverable";
import SupervisorProposal from "./pages/SupervisorProposal";
import { logoutUser, readUser, refreshAuthToken } from "./store/actions/auth";

const AdminRoutes = () => {
  return (
    <>
      {/* Admin */}
      <Route exact path="/admin/groups" component={AdminAllGroups} />
      <Route exact path="/admin/faculty" component={AdminManageFaculty} />
      <Route exact path="/admin/dept" component={AdminManageDept} />
      {/* ---- */}
    </>
  );
};

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
      console.log(data);
      localStorage.setItem("USER_ID", data.id);
      if (data.hasOwnProperty("role")) {
        localStorage.setItem("USER_ROLE", data.role);
        setRoles(data.role);
      }
    }
  }, [token]);

  return (
    <Switch>
      {/* <Route exact path="/committees" component={AllCommittees} /> */}
      {/* <Route exact path="/file" component={UploadFile} /> */}
      <Route exact path="/login" component={Login} />
      <Route exact path="/group" component={GroupLogin} />
      <Route exact path="/admin" component={AdminLogin} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/register-group" component={RegisterGroup} />
      <Route exact path="/register-project" component={SubmitProjectTitle} />
      {roles === "HOD" ? (
        <AdminRoutes />
      ) : (
        <MainLayout>
          <Route exact path="/main/student" component={GroupDashboard} />
          <Route
            exact
            path="/main/proposal"
            component={ProposalSubmissionPage}
          />
          <Route exact path="/main/d2" component={D2SubmissionPage} />
          <Route exact path="/main/d3" component={D3SubmissionPage} />
          <Route exact path="/groups" component={AllGroups} />
          <Route exact path="/groups/:id" component={GroupDetail} />
          <Route
            exact
            path="/groups/proposal/:id"
            component={SupervisorProposal}
          />
          <Route
            exact
            path="/groups/d2/:id"
            component={SupervisorDocumentation}
          />
          <Route
            exact
            path="/groups/d3/:id"
            component={SupervisorFinalDeliverable}
          />
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/deliverable/:id" component={DeliverableDetail} />
          <Route exact path="/students" component={AllStudents} />
          <Route exact path="/committees" component={AllCommittees} />
        </MainLayout>
      )}
      {/* {roles && roles.includes("STUDENT") ? ( */}
      {/* <> */}
      {/* </>
      ) : null} */}
      {/* <MainLayout> */}
      {/* <ProtectedRoute exact path="/" component={Dashboard} /> */}
      {/* {
          // (roles && roles.includes("PMO")) ||
          // (roles && roles.includes("SUPERVISOR")) ||
          // (roles && roles.includes("EVALUATOR")) ||
          true ? (
            <> */}

      {/* <ProtectedRoute exact path="/committees" component={AllCommittees} /> */}
      {/* <ProtectedRoute
        exact
        path="/deliverable/:id"
        component={DeliverableDetail}
      /> */}
      {/* </>
          ) : null
        } */}
      {/* </MainLayout> */}
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
