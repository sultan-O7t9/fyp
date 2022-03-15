import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute(props) {
  const { component: Component, ...restProps } = props;
  const accessToken = useSelector(state => state.auth.accessToken);
  console.log("access", accessToken);

  return (
    <Route
      {...restProps}
      render={props =>
        accessToken ? (
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
