import React from "react";
import { Route, Switch } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AllGroups from "./pages/AllGroups";
import AllStudents from "./pages/AllStudents";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

// <Switch>
//   <Route exact path="/" component={Login} />
//   <Route exact path="/performa" component={IdeaPerforma} />
//   <DashboardLayout>
//     <Route exact path="/dashboard" component={Home} />
//     <Route exact path="/dashboard/groups" component={AllGroups} />
//     <Route exact path="/dashboard/students" component={AllStudents} />
//   </DashboardLayout>
// </Switch>

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <MainLayout>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/dashboard/groups" component={AllGroups} />
        <Route exact path="/dashboard/students" component={AllStudents} />
      </MainLayout>
    </Switch>
  );

  // <MainLayout>
  //   {/* <AllGroups /> */}
  //   {/* <Dashboard /> */}
  // </MainLayout>
};

export default App;
