import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute(props) {
  const { component: Component, ...restProps } = props;
  const accessToken = useSelector(state => state.auth.accessToken);
  console.log("in protected route");
  const token = localStorage.getItem("accessToken");
  return (
    <Route
      {...restProps}
      render={props =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export default ProtectedRoute;
