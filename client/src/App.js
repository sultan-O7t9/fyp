import React from "react";
import "@material-tailwind/react/tailwind.css";
import Login from "./pages/Login";
import { Route, Switch } from "react-router-dom";
import AllGroups from "./pages/Dashboard/AllGroups";

const App = () => {
  return (
    // <div className="App">
    //   <h1 className="text-red-700">helloWorld</h1>
    // </div>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={AllGroups} />
    </Switch>
  );
};

export default App;
