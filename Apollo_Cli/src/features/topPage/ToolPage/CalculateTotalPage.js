import { useLazyQuery } from "@apollo/client";
import { Input, message, Typography, Space, Spin, Table, Form, List, Button, Tooltip, Avatar } from "antd";
import MainLayout from "components/MainLayout/MainLayout"
import { SEARCH_BY_NAME, SEARCH_FULL_BY_NAME } from "graphql/Basic/Basic";
import React, { useRef, useState, useEffect } from "react"
import dotenv from 'dotenv'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { listAttr } from "constants/DVNutrition";
import NutritionFact from "components/NutritionFact/NutritionFact";
import { Doughnut } from "react-chartjs-2";
import 'chart.js/auto';
import { CalculateExtraNutrition } from "features/admin/RecipeFoodPage";

const { Title } = Typography
const { Search } = Input
const server = process.env.REACT_APP_SERVER
dotenv.config();

const CalculateNF = (input) => {
  let result = {}
  listAttr.forEach(attr => {
    result[attr] = 0
    result['serving_weight_grams'] = 0
    input.forEach(item => {
      result[attr] = result[attr] + item.value * item.food.basicNutrients[attr] / item.food.serving_weight_grams
      result['serving_weight_grams'] = result['serving_weight_grams'] + item.value
    })
  })
  return result
}

const CalculateExtra = (listTotal) => {
  var holder = {};

  listTotal.forEach(function (d) {
    if (holder.hasOwnProperty(d.nutrientId)) {
      holder[d.nutrientId] = holder[d.nutrientId] + d.value;
    } else {
      holder[d.nutrientId] = d.value;
    }
  });

  var obj2 = [];

  for (var prop in holder) {
    const list = listTotal.filter(item => item.nutrientId === prop)
    obj2.push({
      nutrientId: prop,
      value: parseFloat(holder[prop]).toFixed(2),
      nutrient: list[0].nutrient,
      unit: list[0].unit
    });
  }

  return obj2
}
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

const CalculateTotalPage = () => {
  const searchRef = useRef();
  const [modalSearch, setmodalSearch] = useState(false);
  const [listFood, setListFood] = useState([]);
  const [nutrition, setNutrition] = useState();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setmodalSearch(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [searchRef]);

  const [searchFoodByName, { data: publicFood, loading: publicloading }] = useLazyQuery(SEARCH_FULL_BY_NAME, {
    onError(err) {
      message.error(err.message)
    },
    onCompleted(data) {
    }
  })

  const onSearch = (value) => {
    searchFoodByName({
      variables: {
        foodGroup: 0,
        search: value
      },
    })
    setmodalSearch(true)
  }

  const onAddFood = (item) => {
    setListFood([...listFood, {
      food: item,
      value: item.serving_weight_grams
    }])
  }

  const onDeleteFood = (id) => {
    const newList = listFood.filter(item => item.food.id !== id)
    setListFood(newList)
  }

  const onCalculate = (data) => {

    const input = listFood.map(item => {
      return {
        food: item.food,
        value: parseFloat(data[item.food.id])
      }
    })
    const nutritionFact = CalculateNF(input)

    const listExtra = input.map(item => {
      const factor = item.value / item.food.serving_weight_grams
      const map = item.food.extraNutrients.map(e => {
        return {
          nutrientId: e.nutrientId,
          value: (factor * parseFloat(e.value)),
          nutrient: e.nutrients.nutrient,
          unit: e.nutrients.unit
        }
      })
      return { extra: map }
    })
    let listTotal = []
    listExtra.forEach(item => {
      listTotal = listTotal.concat(item.extra)
    })

    const extraNutrient = CalculateExtra(listTotal)

    setNutrition({
      NF: nutritionFact,
      EX: extraNutrient
    })
  }

  const SearchContent = (
    modalSearch ?
      <div className="search-content add-log-search" >
        {
          publicloading
            ?
            <div className="search-loading">
              <Space
                className="search-loading__load"
              >
                <Spin size="large" />
              </Space>
            </div>
            :
            <List>
              {publicFood?.searchFoodByName.map(item => {
                return (
                  <List.Item
                    key={item.id}
                    actions={
                      [
                        <PlusCircleOutlined className="btn-add" onClick={() => { onAddFood(item) }} />
                      ]
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={`${server}${item.image}`} />}
                      title={item.name}
                    />
                  </List.Item>
                )
              })}
            </List>
        }
      </div>
      : "")

  const tableData = nutrition?.EX.map(item => {
    return {
      nutrients: item.nutrient,
      value: `${item.value} ${item.unit}`
    }
  })

  return (
    <MainLayout>
      <div className="tool-content only-flex">
        <div className={nutrition?.NF ? "input-caltool" : "input-larger"}>

          <div className={`search-log ${nutrition?.NF ? "" : "search-larger"}`} ref={searchRef}>
            <Title level={3}>Công cụ tính hàm lượng dinh dưỡng</Title>
            <span style={{ fontSize: "15px" }}><i>Thêm các món ăn trong bữa ăn hoặc các thành phần của món ăn để tính giá trị dinh dưỡng </i></span>
            <Search
              onSearch={onSearch}
              placeholder="Tìm kiếm thức ăn (VD:Cá)"
              style={{ marginTop: '3rem' }}
            />
            {
              SearchContent
            }
          </div>

          <div>
            <Form
              onFinish={onCalculate}
              className={`${nutrition?.NF ? "" : "search-larger"}`}
            >
              {
                listFood.map(item => {
                  return (
                    <div className={`flex item-fl `} key={item.food.id}>
                      <div className={`text-center item-food-name`} style={{ textAlign: "left" }}>
                        <Tooltip title={item.food.name}>
                          <Avatar src={`${server}${item.food.image}`} />
                        </Tooltip>
                        {item.food.name}
                      </div>
                      <div className="flex text-center">
                        <Form.Item
                          key={item.food.id}
                          name={item.food.id}
                          className="input-logfood"
                          initialValue={item.value}
                          style={{ width: "10rem" }}
                        >
                          <Input type="number" name={item.food.id} />
                        </Form.Item>
                        <DeleteOutlined onClick={() => { onDeleteFood(item.food.id) }} />
                      </div>

                    </div>
                  )
                })
              }
              {listFood.length > 0 ?
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Xác nhận
                  </Button>
                </Form.Item>
                : ""
              }
            </Form>
          </div>
        </div>

        {nutrition?.NF ?
          <div className="calculate-content">
            <>
              <Title level={4}>Nhãn dinh dưỡng</Title>
              <NutritionFact nutrientData={nutrition.NF} />
              <Title level={4}>Các chất dinh dưỡng khác</Title>
              <Table
                // width={100}
                style={{ width: '40rem' }}
                columns={column}
                dataSource={tableData}
                pagination={false}
                scroll={{ y: 240 }}
              />

              <Title level={4}>Các nguồn Calo</Title>
              <Doughnut
                data={{
                  labels: [
                    "Chất béo",
                    "Protein",
                    "Carbohydrates",
                    "Nguồn khác"
                  ],
                  datasets: [
                    {
                      label: "Population (millions)",
                      backgroundColor: [
                        "#3e95cd",
                        "#8e5ea2",
                        "#3cba9f",
                        "#404244"

                      ],
                      data: [
                        nutrition?.NF?.Fat * 9,
                        nutrition?.NF?.Protein * 4,
                        nutrition?.NF?.Carbohydrates * 4,
                        nutrition?.NF?.Calories - nutrition?.NF?.Fat * 9 - nutrition?.NF?.Protein * 4 - nutrition?.NF?.Carbohydrates * 4,

                      ]
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

            </>
          </div>
          : ""}
      </div>
    </MainLayout>
  )
}
export default CalculateTotalPage