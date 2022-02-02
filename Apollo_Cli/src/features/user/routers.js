import React, { useState } from "react";
import { Route, BrowserRouter, Switch, Router } from "react-router-dom";
import UserFood from "./FoodPage";
import RecipeFoodPage from "features/admin/RecipeFoodPage";
import DetailFoodPage from "features/admin/DetailFoodPage";
import SettingPage from "features/common/SettingPage";
import TrackingPage from "./TrackingPage";
import ImportFood from "features/admin/ImportFood";

const Index = () => {
  const [collapse, setCollapse] = useState(false);
  return (
    <Switch>
      <Route exact path="/user/my-food" children={<UserFood collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/user/food/:slug" children={<DetailFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/user/new-food" children={<RecipeFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/user/edit-food/:slug" children={<RecipeFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/user/import-food" children={<ImportFood collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/user/account-setting" children={<SettingPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/user/:slug?" children={<TrackingPage collapse={collapse} setCollapse={setCollapse} />} />
    </Switch>
  )
}
export default Index