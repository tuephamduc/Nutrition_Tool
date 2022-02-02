import React from "react";
import { Route, Switch } from "react-router-dom";
import TopPage from "./TopPage";
import LoginPage from "./Login";
import Register from "./Register";
import ActiveAcc from "./ActiveAcc";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";
import Articles from "./ArticlePage/Articles";
import SortPage from "./ToolPage/SortPage";
import DetailFoodPage from "features/topPage/ToolPage/DetailFoodPage";
import SearchPage from "./ToolPage/SearchPage";
import CalculateTotalPage from "./ToolPage/CalculateTotalPage";

const Index = () => {
  return (
    <Switch>
      {/* top page router */}
      <Route exact path="/" component={TopPage} />
      <Route exact path="/articles/:slug" component={Articles} />
      <Route exact path="/food/:slug" component={DetailFoodPage} />
      <Route exact path="/tools/sort-food" component={SortPage} />
      <Route exact path="/tools/search" component={SearchPage} />
      <Route exact path="/tools/cacluate-total" component={CalculateTotalPage} />

      {/* auth router */}
      <Route exact path="/login"
        children={<LoginPage roles="USER" />}
      />
      <Route exact path="/login/admin"
        children={<LoginPage roles="ADMIN" />}
      />

      <Route exact path="/login/expert"
        children={<LoginPage roles="EXPERT" />}
      />
      <Route exact path="/register" component={Register} />
      <Route exact path="/active/:slug" component={ActiveAcc} />
      <Route exact path="/reset-password/:slug" component={ResetPassword} />
      <Route exact path="/forgot" component={ForgotPassword} />


    </Switch>
  )
}
export default Index;