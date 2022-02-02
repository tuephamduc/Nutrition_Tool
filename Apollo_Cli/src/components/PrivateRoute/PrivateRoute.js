import React from "react";
import { Route, Redirect } from "react-router-dom";
import useAuth from "hooks/Auth/useAuth"
import AccessDenied from "components/AccessDenied/AccessDenied";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useAuth();
  console.log(auth);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.user) {
          const accessPath = props.location.pathname.split("/");

          return auth.user.roles.toLowerCase() === accessPath[1] ? (
            <Component {...props} />
          ) : (
            <AccessDenied path={auth.getRoute(auth.user.roles)} />
          );
        }

        return (
          <Redirect
            to={{
              pathname: rest.loginPath,
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
