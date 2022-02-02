import { useLazyQuery, useQuery } from "@apollo/client"
import { Button, message, Radio, Select, Space, List, Typography, Pagination, Spin } from "antd"
import MainLayout from "components/MainLayout/MainLayout"
import { ALL_GROUP, ALL_NUTRIENT, SORT_FOOD } from "graphql/Basic/Basic"
import React, { useState, useMemo } from "react"
import { Link } from "react-router-dom";
import { NutritionFactSelect } from "constants/NutritionFactSelect";
import dotenv from 'dotenv'
const server = process.env.REACT_APP_SERVER
dotenv.config();
const { Option } = Select
const { Title } = Typography
const SortPage = () => {

  const [sortQuery, setsortQuery] = useState({
    nutrient: 0,
    foodGroup: 0,
    sort: 2,
    page: 1,
    limit: 50
  });
  const { data: groupData } = useQuery(ALL_GROUP)
  const { data: nutrientData } = useQuery(ALL_NUTRIENT)
  const { data: foodData, loading } = useQuery(SORT_FOOD, {
    variables: {
      query: sortQuery
    },
    onError(err) {
      message.error(err.message)
    }
  })

  const onChangeNutrient = (value) => {
    setsortQuery(prevState => {
      return {
        ...prevState,
        nutrient: value
      }
    })
  }

  const onChangeFoodGroup = (value) => {
    setsortQuery(prevState => {
      return {
        ...prevState,
        foodGroup: value
      }
    })
  }

  const onChangeSort = (e) => {
    setsortQuery(prevState => {
      return {
        ...prevState,
        sort: parseInt(e.target.value)
      }
    })
  }

  const onPageChange = (page) => {
    setsortQuery(prevState => {
      return {
        ...prevState,
        page: page
      }
    })
  }
  foodData && console.log(foodData);

  let renderData
  const nutrient = sortQuery.nutrient
  const listExistId = [2, 3, 5, 50, 67, 4, 68, 22, 21, 6, 7, 9, 36, 26, 16, 17]
  if (nutrient && foodData) {
    if (listExistId.includes(nutrient)) {
      const fact = NutritionFactSelect.find(item => item.id === nutrient)
      console.log(fact);
      renderData = foodData && foodData?.sortFoodByNutrient.edges.map(item => {
        return {
          ...item,
          data: {
            nutrient: fact.nutrient,
            value: item.basicNutrients[`${fact.nutrient}`],
            unit: fact.unit
          }
        }
      })

    } else {
      renderData = foodData && foodData?.sortFoodByNutrient.edges.map(item => {
        const ntd = item.extraNutrients.find(el => parseInt(el.nutrientId) === parseInt(nutrient))
        return {
          ...item,
          data: {
            nutrient: ntd.nutrients.nutrient,
            value: ntd.value,
            unit: ntd.nutrients.unit
          }
        }
      })
    }
  }


  const Content = useMemo(() => {
    return (
      <>
        <Title level={5}>Kết quả tìm kiếm: </Title>
        <List
          itemLayout="vertical"
          size="large"
          className="articles-list"
          dataSource={renderData}

          renderItem={item => (
            <List.Item
              key={item.id}
              pagination={{
                onChange: page => {
                  setsortQuery(prevState => {
                    return {
                      ...prevState,
                      page: page
                    }
                  })
                },
                pageSize: sortQuery.limit,
              }}
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
              <div>
                Hàm lượng {item.data.nutrient} mỗi 100 g thực phẩm <br />
                {item.data.value} {item.data.unit}
              </div>
              <Link to={`/food/${item.id}`}>Xem chi tiết</Link >
            </List.Item>
          )}
        />
        <Pagination
          total={foodData?.sortFoodByNutrient?.total}
          defaultPageSize={sortQuery.limit}
          defaultCurrent={sortQuery.page}
          onChange={onPageChange}
          hideOnSinglePage={true}
          responsive={true}
          showSizeChanger={false}
        />

      </>
    )
  }, [foodData, sortQuery.limit]
  )



  return (
    <MainLayout>
      <div className="tool-content only-flex">
        <div className="search">
          <Title level={5}>Chọn chất dinh dưỡng:</Title>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn chất dinh dưỡng"
            onChange={onChangeNutrient}
          >
            {
              nutrientData?.getAllNutrients ? nutrientData?.getAllNutrients.map(item => {
                return (<Option
                  value={parseInt(item.id)}
                  key={item.id}
                >{item.nutrient}</Option>)
              }) : ""
            }
          </Select>
          <Title level={5} style={{ marginTop: '2rem' }} >Chọn nhóm thực phẩm:</Title>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn nhóm thực phẩm"
            onChange={onChangeFoodGroup}
            defaultValue={0}
          >
            <Option value={0}>Tất cả</Option>
            {
              groupData?.getAllFoodGroup ? groupData?.getAllFoodGroup.map(item => {
                return (<Option
                  value={parseInt(item.id)}
                  key={item.id}
                >{item.groupName}</Option>)
              }) : ""
            }
          </Select>
          <Title level={5} style={{ marginTop: '2rem' }}>Sắp xếp:</Title>
          <Radio.Group
            defaultValue={sortQuery.sort}
            onChange={onChangeSort}
          >
            <Space direction="vertical">
              <Radio value={2}>
                Tăng dần
              </Radio>
              <Radio value={1}>
                Giảm dần
              </Radio>
            </Space>
          </Radio.Group>

        </div>
        <div className="search-result">
          {
            loading ?
              <div className="search-loading">
                <Space
                  className="search-loading__load"
                >
                  <Spin size="large" />
                </Space>
              </div> :
              foodData?.sortFoodByNutrient ? Content : ""
          }
        </div>

      </div>
    </MainLayout>
  )
}
export default SortPage