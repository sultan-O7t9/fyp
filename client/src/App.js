import React from "react";
import "@material-tailwind/react/tailwind.css";
import Login from "./pages/Login";
import { Route, Switch } from "react-router-dom";
import AllGroups from "./pages/Dashboard/AllGroups";
import Home from "./pages/Dashboard/Home";
import AllStudents from "./pages/Dashboard/AllStudents";
import IdeaPerforma from "./pages/IdeaPerforma";
import { DashboardLayout } from "./layouts";

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/performa" component={IdeaPerforma} />
      <DashboardLayout>
        <Route exact path="/dashboard" component={Home} />
        <Route exact path="/dashboard/groups" component={AllGroups} />
        <Route exact path="/dashboard/students" component={AllStudents} />
      </DashboardLayout>
    </Switch>
  );
};

export default App;
