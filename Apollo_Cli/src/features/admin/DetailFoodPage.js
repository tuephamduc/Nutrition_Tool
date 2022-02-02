import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { FOOD_BY_ID } from "graphql/Basic/Basic";
import { useQuery } from "@apollo/client";
import NutritionFact from "components/NutritionFact/NutritionFact";
import { Card, PageHeader, Image, Typography, Table, Button, message } from "antd";
import ErrorPage from "features/pageErrors/Errors";

const { Title } = Typography
const DetailFoodPage = ({ collapse, setCollapse }) => {
  const { slug } = useParams()
  console.log(slug);
  const [food, setFood] = useState();
  const { data, loading, error } = useQuery(FOOD_BY_ID, {
    variables: {
      id: slug
    },
    onCompleted(data) {

    },
    onError(error) {
      message.error(error.message)
    }
  })


  useEffect(() => {
    if (data) {
      setFood(data?.getFoodById)
    }
  }, [data]);


  const image = food && food?.image
  const extra = food && food?.extraNutrients

  const tableData = extra && extra.map(item => {
    return {
      nutrients: item?.nutrients?.nutrient,
      value: `${item.value} ${item?.nutrients?.unit}`
    }
  })

  const column = [
    {
      title: "Name",
      key: "nutrients",
      dataIndex: 'nutrients',
      width: '3rem',
    },
    {
      title: "Value",
      key: "value",
      dataIndex: 'value',
      width: '4rem',
    },
  ]
  return (
    <DashboardLayout collapse={collapse} setCollapse={setCollapse}>
      {data &&
        <div className="detail-content" >
          <div>
            <PageHeader
              className="detail-header"
              title={food ? food.name : ""}
              subTitle={food ? food.group.groupName : ""}
            />
            <NutritionFact nutrientData={food?.basicNutrients} />
          </div>
          <div className="food-detail-image">
            <Image
              preview={false}
              width={200}
              src={`${process.env.REACT_APP_SERVER}${image}`}
            />
            <Title level={4}>Các chất dinh dưỡng khác</Title>
            <Table
              // width={100}
              style={{ width: '60rem' }}
              columns={column}
              dataSource={tableData}
              pagination={false}
              scroll={{ y: 240 }}
            />
          </div>
        </div>
      }
      {
        error && <ErrorPage status={404} />
      }
    </DashboardLayout>
  )
}

export default DetailFoodPage