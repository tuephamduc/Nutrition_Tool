import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import ExpertFood from "./expertFood";
import SettingPage from "features/common/SettingPage";
import RecipeFoodPage from "features/admin/RecipeFoodPage";
import DetailFoodPage from "features/admin/DetailFoodPage";
import ImportFood from "features/admin/ImportFood";

const Index = () => {
  const [collapse, setCollapse] = useState(false);
  return (
    <Switch>
      {/* expert router */}
      <Route exact path="/expert/foods" children={<ExpertFood collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/expert/account-setting" children={<SettingPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/expert/food/:slug" children={<DetailFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/expert/new-food" children={<RecipeFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/expert/edit-food/:slug" children={<RecipeFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/expert/import-food" children={<ImportFood collapse={collapse} setCollapse={setCollapse} />} />

    </Switch>
  )
}
export default Index;