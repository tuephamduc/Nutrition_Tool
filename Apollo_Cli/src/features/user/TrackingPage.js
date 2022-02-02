import { Calendar, Input, Typography } from "antd";
import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import moment from 'moment';
import TrackingList from "components/TrackingList/TrackingList";
import useFoodLog from "hooks/FoodLog/useFoodLog";
import { Line } from "react-chartjs-2";

const { Title } = Typography
const { Search } = Input
const CalculateTotalCalories = (date, listFood) => {
  let totalCalo = 0
  const listFoodInDate = listFood.filter(item => moment(item.date).format('YYYY-MM-DD') === date)
  listFoodInDate.forEach(item => {
    totalCalo = totalCalo + item.food.basicNutrients.Calories * item.weight / item.food.serving_weight_grams
  });
  return totalCalo
}

const TrackingPage = ({ collapse, setCollapse }) => {
  const { slug } = useParams();
  const history = useHistory();
  const { foodLog } = useFoodLog();
  const [visible, setVisible] = useState(false);
  const onSelectCalenDar = (value) => {
    history.push(`/user/${value.format('YYYY-MM-DD')}`)
  }


  const listDay = foodLog && foodLog.map(item => {
    return moment(item.date).format('YYYY-MM-DD')
  })

  let listWeekToSlug = []
  for (let i = 6; i >= 0; i--) {
    const dateFrom = moment(slug).subtract(i, 'd').format('YYYY-MM-DD');
    listWeekToSlug.push(dateFrom)
  }

  let listCalo = []
  listWeekToSlug.forEach(item => {
    if (foodLog) {
      listCalo.push(CalculateTotalCalories(item, foodLog))
    }
  })

  console.log(listCalo);

  function onFullRender(date) {
    const dates = moment(date).format('YYYY-MM-DD')
    const day = moment(date).format('D')

    if (listDay && listDay.includes(dates)) {
      return (
        <div className="ant-picker-cell-inner ant-picker-calendar-date">
          <div className="ant-picker-calendar-date-value choose-date">{day}</div>
          <div className="ant-picker-calendar-date-content"></div>
        </div>
      )
    }
    else {
      return (
        <div className="ant-picker-cell-inner ant-picker-calendar-date">
          <div className="ant-picker-calendar-date-value ">{day}</div>
          <div className="ant-picker-calendar-date-content"></div>
        </div>
      )
    }

  }

  return (
    <DashboardLayout collapse={collapse} setCollapse={setCollapse}>
      <section className="dashboard-main flex">
        <div className="flex">
          <div>
            <Title level={4}>Food Log</Title>

            <TrackingList />


          </div>
          <div className="calendar">
            <Calendar
              fullscreen={false}
              onSelect={onSelectCalenDar}
              mode="month"
              value={moment(slug)}
              dateFullCellRender={onFullRender}
              headerRender={() => {
                return (<Title level={4}>Lịch</Title>)
              }}
            />
          </div>
        </div>
        <div className="lineChart">
          <Line
            data={{
              labels: listWeekToSlug,
              datasets: [
                {
                  data: listCalo,
                  label: "Tổng Calo trong 7 ngày gần nhất",
                  borderColor: "#3e95cd",
                  fill: false
                }
              ]
            }}
            options={{
              title: {
                display: true,
                text: "World population per region (in millions)"
              },
              legend: {
                display: true,
                position: "bottom"
              }
            }}
          />
        </div>
      </section>
    </DashboardLayout>
  )
}

export default TrackingPage