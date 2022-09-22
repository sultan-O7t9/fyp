import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadFile from "./components/UploadFile";
import GroupMainLayout from "./layouts/GroupMainLayouot";
import MainLayout from "./layouts/MainLayout";
import AdminAllGroups from "./pages/AdminAllGroups";
import AdminLogin from "./pages/AdminLogin";
import AdminManageDept from "./pages/AdminManageDept";
import AdminManageFaculty from "./pages/AdminManageFaculty";
import AllCommittees from "./pages/AllCommittees";
import AllGroups from "./pages/AllGroups";
import AllStudents from "./pages/AllStudents";
import CommunicationPage from "./pages/CommunicationPage";
import CoverLetterReport from "./pages/CoverLetterReport";
import D2EvaluationPage from "./pages/D2EvaluationPage";
import D2SubmissionPage from "./pages/D2SubmissionPage";
import D3EvaluationPage from "./pages/D3EvaluationPage";
import D3SubmissionPage from "./pages/D3SubmissionPage";
import Dashboard from "./pages/Dashboard";
import DeliverableDetail from "./pages/DeliverableDetail";
import DeliverableSubmissionDetail from "./pages/DeliverableSubmissionDetails";
import DetailedReport from "./pages/DetailedReport";
import DetailedReportPage from "./pages/DetailedReportPage";
import EvaluationScheduleDetail from "./pages/EvaluationScheduleDetail";
import FinalMarksReport from "./pages/FinalMarksReport";
import FinalResultPerforma from "./pages/FinalResultPerforma";
import ForgetPassword from "./pages/ForgetPassword";
import GroupDashboard from "./pages/GroupDashboard";
import GroupDetail from "./pages/GroupDetail";
import GroupLogin from "./pages/GroupLogin";
import HODLogin from "./pages/HODLogin";
import Login from "./pages/Login";
import ProposalEvaluationPage from "./pages/ProposalEvaluationPage";
import ProposalSubmissionPage from "./pages/ProposalSubmissionPage";
import Register from "./pages/Register";
import RegisterGroup from "./pages/RegisterGroup";
import ReportsPage from "./pages/ReportsPage";
import ScheduleReport from "./pages/ScheduleReport";
import Semester7Report from "./pages/Semester7Report";
import SubmitProjectTitle from "./pages/SubmitProjectTitle";
import SupervisorDeliverableDetail from "./pages/SupervisorDeliverableDetail";
import SupervisorDocumentation from "./pages/SupervisorDocumentation";
import SupervisorFinalDeliverable from "./pages/SupervisorFinalDeliverable";
import SupervisorProposal from "./pages/SupervisorProposal";
import ViewGroup from "./pages/ViewGroup";
import { logoutUser, readUser, refreshAuthToken } from "./store/actions/auth";

const AdminRoutes = () => {
  return (
    <>
      {/* Admin */}
      <ProtectedRoute exact path="/admin/groups" component={AdminAllGroups} />
      <ProtectedRoute exact path="/hod/groups" component={AdminAllGroups} />
      <ProtectedRoute
        exact
        path="/admin/faculty"
        component={AdminManageFaculty}
      />

      <ProtectedRoute exact path="/admin/dept" component={AdminManageDept} />
      {/* ---- */}
    </>
  );
};

const App = () => {
  useEffect(() => {
    const init = async () => {
      const res = await axios.get("http://localhost:5000/api/auth/init");
      console.log(res.data);
    };
    init();
  }, []);
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
        localStorage.setItem("USER_ROLES", data.role);
        localStorage.setItem(
          "USER_ROLE",
          localStorage.getItem("USER_ROLE")
            ? localStorage.getItem("USER_ROLE")
            : data.role[0]
        );
        setRoles(data.role);
      } else {
        localStorage.setItem("USER_ROLE", "ADMIN");
      }
    }
  }, [token]);

  return (
    <Switch>
      {/* <Route exact path="/committees" component={AllCommittees} /> */}
      {/* <Route exact path="/file" component={UploadFile} /> */}

      {/* <Route exact path="/7-rep" component={FinalResultPerforma} />
      <Route exact path="/final-rep" component={FinalMarksReport} /> */}
      <Route exact path="/fyp-rep" component={FinalResultPerforma} />
      <ProtectedRoute exact path="/report" component={DetailedReport} />
      {/* <Route exact path="/schedule-report" component={ScheduleReport} /> */}
      <Route
        path="/404"
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
                color: "lightblue",
                fontSize: "4rem",
              }}
            >
              Error 404
            </h1>
            <h3
              style={{
                fontFamily: "sans-serif",
                color: "lightblue",
                fontSize: "2.5rem",
              }}
            >
              Page not found
            </h3>
          </div>
        )}
      />
      <Route exact path="/login" component={Login} />
      <Route exact path="/forget" component={ForgetPassword} />
      <Route exact path="/group" component={GroupLogin} />
      <Route exact path="/admin" component={AdminLogin} />
      <Route exact path="/hod" component={HODLogin} />
      <Route exact path="/register" component={Register} />
      <ProtectedRoute exact path="/register-group" component={RegisterGroup} />
      <ProtectedRoute exact path="/main/info" component={ViewGroup} />
      <ProtectedRoute
        exact
        path="/register-project"
        component={SubmitProjectTitle}
      />
      {roles === "HOD" ? (
        <AdminRoutes />
      ) : roles === "group" ? (
        <GroupMainLayout>
          <Route exact path="/main/student" component={GroupDashboard} />
          <Route
            exact
            path="/main/deliverable/detail/:id"
            component={DeliverableSubmissionDetail}
          />

          <Route
            exact
            path="/main/proposal"
            component={ProposalSubmissionPage}
          />
          <Route exact path="/main/d2" component={D2SubmissionPage} />

          <Route exact path="/main/d3" component={D3SubmissionPage} />
          <Route exact path="/main/group/:id" component={GroupDetail} />
        </GroupMainLayout>
      ) : (
        <MainLayout>
          <ProtectedRoute exact path="/groups" component={AllGroups} />
          <ProtectedRoute exact path="/groups/:id" component={GroupDetail} />
          <ProtectedRoute
            exact
            path="/sup/deliverable/detail/:id"
            component={SupervisorProposal}
          />
          <ProtectedRoute
            exact
            path="/groups/d2/:id"
            component={SupervisorDocumentation}
          />
          <ProtectedRoute
            exact
            path="/groups/d3/:id"
            component={SupervisorFinalDeliverable}
          />
          <ProtectedRoute exact path="/" component={Dashboard} />
          <ProtectedRoute
            exact
            path="/deliverable/:id"
            component={DeliverableDetail}
          />
          <ProtectedRoute
            exact
            path="/deliverable/sched/:id"
            component={EvaluationScheduleDetail}
          />
          <ProtectedRoute
            exact
            path="/sup/deliverable/:id"
            component={SupervisorDeliverableDetail}
          />
          <ProtectedRoute
            exact
            path="/proposal/eval/"
            component={ProposalEvaluationPage}
          />
          <ProtectedRoute exact path="/d2/eval/" component={D2EvaluationPage} />
          <ProtectedRoute exact path="/d3/eval/" component={D3EvaluationPage} />
          <ProtectedRoute exact path="/students" component={AllStudents} />
          <ProtectedRoute exact path="/committees" component={AllCommittees} />
          <ProtectedRoute exact path="/comm" component={CommunicationPage} />
          <ProtectedRoute exact path="/rep" component={ReportsPage} />
        </MainLayout>
      )}
    </Switch>
  );
};

export default App;
