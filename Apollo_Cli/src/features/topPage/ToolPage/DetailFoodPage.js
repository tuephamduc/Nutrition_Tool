import MainLayout from "components/MainLayout/MainLayout"
import React, { useState, useEffect } from "react"
import { useParams } from "react-router"
import { FOOD_BY_ID } from "graphql/Basic/Basic";
import { useQuery } from "@apollo/client";
import { Card, PageHeader, Image, Table, Button, Typography, message, Tabs } from "antd";
import NutritionFact from "components/NutritionFact/NutritionFact";
import useAuth from "hooks/Auth/useAuth";
import 'chart.js/auto';

import { Doughnut } from "react-chartjs-2";
import useFoodLog from "hooks/FoodLog/useFoodLog";
import moment from "moment";
import { NutritionFactSelect } from "constants/NutritionFactSelect";

const { Title } = Typography

const { TabPane } = Tabs;
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

const DetailFoodPage = () => {
  const { slug } = useParams();
  const auth = useAuth()
  const roles = auth?.user?.roles
  const { addLoaing, addFoodLog } = useFoodLog()

  const [food, setFood] = useState();
  const [status, setStatus] = useState(true);
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

  const extra = food && food?.extraNutrients

  const tableData = extra && extra.map(item => {
    return {
      nutrients: item?.nutrients?.nutrient,
      value: `${item.value} ${item?.nutrients?.unit}`
    }
  })

  const basic = food && food.basicNutrients

  const rawfoodNutrient = food && Object.keys(basic).map(e => {
    const unit = NutritionFactSelect.find(item => item.nutrient === e)
    return ({
      nutrients: e,
      value: basic[e] ? `${basic[e]} ${unit?.unit}` : null
    })
  }
  )

  const notExitNutrient = ["__typename", "serving_unit", "serving_weight_grams"]
  const foodBasicNutrient = rawfoodNutrient && rawfoodNutrient.filter(item => !notExitNutrient.includes(item.nutrients))

  let foodNutrient = []
  if (foodBasicNutrient) {
    if (status === true) {
      foodNutrient = foodBasicNutrient
    } else if (status === false) {
      foodNutrient = [...foodBasicNutrient, ...tableData]
    }
  }

  const onAddToFoodLog = () => {

    const today = moment()
    const breakDate = moment('10:00am', 'hh:mma')
    const lunchDate = moment('02:00pm', 'hh:mma')

    let meal
    if (today.isBefore(breakDate)) {
      meal = "BREAK"
    } else if (today.isBetween(breakDate, lunchDate)) {
      meal = "LUNCH"
    } else {
      meal = "DINNER"
    }
    console.log(meal);
    addFoodLog({
      variables: {
        input: {
          foodId: slug,
          weight: parseFloat(food?.serving_weight_grams),
          date: today,
          meal: meal
        }
      }
    })
  }

  const onToggleDisplay = () => {
    setStatus(!status)
  }

  return (
    <MainLayout>

      <div className="tool-content" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }} >
          <div>
            <Image
              preview={false}
              width={70}
              style={{ marginLeft: "2rem" }}
              src={`${process.env.REACT_APP_SERVER}${food?.image}`}
            />

            <PageHeader
              className="detail-header"
              title={food ? food.name : ""}
              subTitle={food ? food.group.groupName : ""}
            />
          </div>
          {
            roles && roles === "USER" ? <Button
              type="primary"
              onClick={() => { onAddToFoodLog() }}
              loading={addLoaing}
            >+ Food Log</Button> : ""
          }
        </div>
        <Tabs>
          <TabPane tab="Nhãn dinh dưỡng" key={1}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>

              <div style={{ marginLeft: "2rem" }}>
                <Title level={5}>Nhãn dinh dưỡng</Title>
                <NutritionFact nutrientData={food?.basicNutrients} />
                <Title level={5}>Hàm lượng calo từ các chất:</Title>
                <Doughnut
                  data={{
                    labels: [
                      "Chất béo",
                      "Protein",
                      "Carbohydrates",
                    ],
                    datasets: [
                      {
                        label: "Population (millions)",
                        backgroundColor: [
                          "#3e95cd",
                          "#8e5ea2",
                          "#3cba9f",

                        ],
                        data: [food?.basicNutrients.Fat * 9, food?.basicNutrients.Protein * 4, food?.basicNutrients.Carbohydrates * 4]
                      }
                    ]
                  }}
                  option={{
                    title: {
                      display: true,
                      text: "Hàm lượng calo từ các chất"
                    }
                  }}

                />
              </div>
              <div style={{ margin: "2rem" }}>
                <Title level={5}>Các chất dinh dưỡng khác:</Title>
                <Table
                  // width={100}
                  style={{ width: '30rem' }}
                  columns={column}
                  dataSource={tableData}
                  pagination={false}
                  scroll={{ y: 240 }}
                />
              </div>
            </div>
          </TabPane>
          <TabPane tab="Chi tiết các chất dinh dưỡng" key={2}>
            <div className="nutrition-table">
              <Table
                columns={column}
                dataSource={foodNutrient}
                pagination={false}
              />
              <Button type="primary" onClick={onToggleDisplay}
                style={{ marginTop: "3rem" }}
              >
                {status ? "Xem thêm" : "Rút gọn"}
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>


    </MainLayout >
  )
}
export default DetailFoodPage