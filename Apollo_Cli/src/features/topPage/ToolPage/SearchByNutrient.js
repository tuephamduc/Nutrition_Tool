import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Input, Select, message, Tabs, Typography, Space, Spin, List, Avatar } from "antd";
import MainLayout from "components/MainLayout/MainLayout"
import { NutritionFactSelect } from "constants/NutritionFactSelect";
import { ALL_GROUP, ALL_NUTRIENT, searchbyNutrient } from "graphql/Basic/Basic";
import React, { useState, useEffect, useMemo } from "react"
import dotenv from 'dotenv'
import { Link } from "react-router-dom";
const server = process.env.REACT_APP_SERVER

dotenv.config();

const { Title } = Typography
const { Search } = Input
const { Option } = Select
const SearchByNutrient = () => {

  const [searchQuery, setSearchQuery] = useState();
  const [nutrient, setnutrient] = useState();
  const [foodRender, setFoodRender] = useState();
  const { data: nutrientData, loading } = useQuery(ALL_NUTRIENT, {
    onError(err) {
      message.error(err.message)
    }
  })


  const [searchFoodByNutrient, { data: foodData, loading: searchLoading }] = useLazyQuery(searchbyNutrient, {
    onError(err) {
      message.error(err.message)
    },
    onCompleted(data) {
      // setnutrient(searchQuery.nutrient)
    }

  })
  const onChangeContent = (e) => {
    setSearchQuery(prevState => {
      return ({
        ...prevState,
        content: parseFloat(e.target.value)
      })
    })
  }

  const onChangeOperation = (value) => {
    setSearchQuery(prevState => {
      return ({
        ...prevState,
        op: value
      })
    })
  }

  const onChangeNutrient = (value) => {
    setSearchQuery(prevState => {
      return ({
        ...prevState,
        nutrient: value
      })
    })
  }


  const onSearch = () => {
    searchFoodByNutrient({
      variables: {
        query: searchQuery
      }
    })
    setnutrient(searchQuery.nutrient)
  }

  useEffect(() => {
    const listExistId = [2, 3, 5, 50, 67, 4, 68, 22, 21, 6, 7, 9, 36, 26, 16, 17]
    if (nutrient && foodData) {
      if (listExistId.includes(nutrient)) {
        const fact = NutritionFactSelect.find(item => item.id === nutrient)
        const data = foodData && foodData?.searchFoodByNutrient.map(item => {
          return {
            ...item,
            data: {
              nutrient: fact?.nutrient,
              value: item.basicNutrients[`${fact.nutrient}`],
              unit: fact?.unit
            }
          }
        })
        setFoodRender(data)
      } else {

        const data = foodData && foodData?.searchFoodByNutrient.map(item => {
          const ntd = item?.extraNutrients.find(el => parseInt(el.nutrientId) === parseInt(nutrient))
          console.log(ntd);
          return {
            ...item,
            data: {
              nutrient: ntd && ntd?.nutrients?.nutrient,
              value: ntd && ntd?.value,
              unit: ntd && ntd?.nutrients?.unit
            }
          }
        })
        setFoodRender(data)
      }
    }
  }, [nutrient, foodData]);


  console.log(foodRender)


  const Content = useMemo(() => {
    return (
      <>
        <Title level={5}>Kết quả</Title>
        <List
          itemLayout="vertical"
          size="large"

          dataSource={foodRender}

          renderItem={item => (
            <List.Item
              key={item.id}

              extra={
                <img
                  // width={272}
                  alt="logo"
                  className="article-foodimg"
                  src={`${server}${item.image}`}
                />
              }
            >
              <List.Item.Meta
                // avatar={<Avatar src={item.avatar} />}
                title={item.name}
                description={item.group.groupName}
              />
              Hàm lượng {item.data.nutrient} trong {item.serving_weight_grams} (g) thực phẩm <br />
              {item.data.value} {item.data.unit}
              <div>
                <Link to={`/food/${item.id}`}>Xem chi tiết</Link>
              </div>
            </List.Item>
          )}
        />
      </>

    )
  }, [foodRender]
  )

  return (
    <div className="only-flex" >
      <div className="search-query">
        {/* <div className="tool-content__search"> */}
        <Title level={5}>Chọn tên và hàm lượng dinh dưỡng</Title>
        <div className="tool-search-item">
          <Select
            // className="tools-select"
            placeholder="Toán tử"
            style={{ minWidth: "20rem" }}
            onChange={onChangeOperation}
          >
            <Option key="equal" value="=">=</Option>
            <Option key="max" value="max">Lớn nhất</Option>
            <Option key="min" value="min">Nhỏ nhất</Option>
            <Option key="gt" value=">">&gt;</Option>
            <Option key="lt" value="<">&lt;</Option>
          </Select>
        </div>
        {
          (searchQuery?.op !== "max" && searchQuery?.op !== "min") ?
            <div className="tool-search-item">
              <Input
                placeholder="Hàm lượng trong 100g thức ăn"
                type="number"
                // enterButton={<div sty></div>}
                style={{ width: "20rem" }}
                onChange={onChangeContent}
              />
            </div>
            : ""
        }
        <div className="tool-search-item">
          <Select
            className="tools-select"
            placeholder="Chọn chất dinh dưỡng"
            style={{ width: "20rem" }}
            onChange={onChangeNutrient}
          >
            {
              NutritionFactSelect.map(item => {
                return (<Option key={item.id} value={item.id}>{`${item.nutrient} (${item.unit})`}</Option>)
              })
            }
            {

              nutrientData?.getAllNutrients ? nutrientData?.getAllNutrients.map(item => {
                return (<Option key={parseInt(item.id)} value={parseInt(item.id)}>{item.nutrient}</Option>)
              }) : ""
            }

          </Select>
        </div>
        <div className="tool-search-item">
          <Button
            type="primary"
            style={{ marginLeft: "3rem" }}
            onClick={onSearch}
          > Tìm kiếm</Button>
        </div>
        {/* </div> */}
      </div>
      <div className="search-result">
        {
          searchLoading ?
            <div className="search-loading">
              <Space
                className="search-loading__load"
              >
                <Spin size="large" />
              </Space>
            </div> : foodData ?
              Content : ""
        }
      </div>
    </div>

  )
}

export default SearchByNutrient