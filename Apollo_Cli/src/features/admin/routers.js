import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import ListUserPage from 'features/admin/ListUserPage';
import ListGroupPage from "features/admin/ListGroupPage";
import ListNutrientPage from "features/admin/ListNutrientPage";
import AdminDashBoard from "features/admin/AdminDashBoard";
import ListFoodPage from "features/admin/ListFoodPage";
import DetailFoodPage from "features/admin/DetailFoodPage";
import RecipeFoodPage from "features/admin/RecipeFoodPage";
import ImportFood from "features/admin/ImportFood";
// import CustomFoodPage from "features/admin/CustomFoodPage";
import SettingPage from "features/common/SettingPage";


const Index = () => {
  const [collapse, setCollapse] = useState(false);
  return (
    <Switch>
      <Route exact path="/admin/"
        children={<AdminDashBoard collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/admin/users" children={<ListUserPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/admin/foods" children={<ListFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/admin/food/:slug" children={<DetailFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/admin/food-groups" children={<ListGroupPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/admin/nutrients" children={<ListNutrientPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/admin/new-food" children={<RecipeFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/admin/edit-food/:slug" children={<RecipeFoodPage collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/admin/import-food" children={<ImportFood collapse={collapse} setCollapse={setCollapse} />} />
      <Route exact path="/admin/account-setting" children={<SettingPage collapse={collapse} setCollapse={setCollapse} />} />
    </Switch>
  )
}
export default Index;