import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import TopPageRouter from "features/topPage";
import AdminRouter from "features/admin"
import UserRouter from "features/user"
import ExpertUser from "features/expert"
import PrivateRoute from "components/PrivateRoute/PrivateRoute";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>

        <PrivateRoute
          path="/admin"
          loginPath="/login/admin"
          component={AdminRouter}
        />

        <PrivateRoute
          path="/expert"
          loginPath="/login/expert"
          component={ExpertUser}
        />

        <PrivateRoute
          path="/user"
          loginPath="/login"
          component={UserRouter}
        />



        <Route path="/" component={TopPageRouter} />

      </Switch>
    </BrowserRouter>
  )
}

export default Router
