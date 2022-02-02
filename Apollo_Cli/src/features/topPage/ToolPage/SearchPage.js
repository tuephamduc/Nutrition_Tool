import { useLazyQuery, useQuery } from "@apollo/client";
import { Input, Select, Tabs, Typography } from "antd";
import MainLayout from "components/MainLayout/MainLayout"
import { ALL_GROUP, ALL_NUTRIENT } from "graphql/Basic/Basic";
import React, { useState, useEffect } from "react"
import SearchByName from "./SearchByName";
import SearchByNutrient from "./SearchByNutrient";

const { TabPane } = Tabs;
const { Title } = Typography
const { Search } = Input
const { Option } = Select

// const layout = {
//   labelCol: { span: 2 },
//   wrapperCol={{ offset: 8, span: 16 }}
// }

const SearchPage = () => {
  const [tabStatus, setTabStatus] = useState(1);


  const onChangeTab = (key) => {

    setTabStatus(key)
  }

  return (
    <MainLayout>
      <div className="tool-content">

        <Tabs onChange={onChangeTab}>
          <TabPane tab="Tìm kiếm theo tên" key={1}>
            <SearchByName />
          </TabPane>

          <TabPane tab="Tìm kiếm theo chất dinh dưỡng" key={2}>
            <SearchByNutrient />
          </TabPane>
        </Tabs>

      </div>
    </MainLayout>
  )
}
export default SearchPage