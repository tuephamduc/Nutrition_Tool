import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Input, message, Select, Tabs, Typography, Space, List, Spin } from "antd";
import MainLayout from "components/MainLayout/MainLayout"
import { ALL_GROUP, ALL_NUTRIENT, SEARCH_BY_NAME } from "graphql/Basic/Basic";
import React, { useState, useEffect, useRef, useMemo } from "react"
import dotenv from 'dotenv'
import { Link } from "react-router-dom";
const server = process.env.REACT_APP_SERVER

dotenv.config();

const { Title } = Typography
const { Search } = Input
const { Option } = Select
const SearchByName = () => {
  const { data: groupData } = useQuery(ALL_GROUP)
  const [searchFoodByName, { data: foodData, loading }] = useLazyQuery(SEARCH_BY_NAME,
    {
      onCompleted(data) {

      },
      onError(err) {
        message.error(err.message)
      }
    })
  const [searchQuery, setSearchQuery] = useState({
    search: "",
    foodGroup: 0
  });


  const onChangeName = (e) => {
    setSearchQuery(prevState => {
      return ({
        ...prevState,
        search: e.target.value
      })
    })
  }

  const onChangeFoodGroup = (value) => {
    setSearchQuery(prevState => {
      return ({
        ...prevState,
        foodGroup: value
      })
    })
  }

  const onSearch = () => {
    console.log(searchQuery);
    searchFoodByName({
      variables: {
        foodGroup: searchQuery?.foodGroup,
        search: searchQuery?.search
      }
    })
  }

  const Content = useMemo(() => {
    return (
      <>
        <Title level={5}>Kết quả tìm kiếm</Title>
        <List
          itemLayout="vertical"
          size="large"
          className="articles-list"
          dataSource={foodData?.searchFoodByName}

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
              <Link to={`/food/${item.id}`}>Xem chi tiết</Link >
            </List.Item>
          )}
        />
      </>

    )
  }, [foodData]
  )

  return (
    <div className="only-flex">
      <div className="search-query">
        <div>
          <Title level={5}>Tên thức ăn hoặc thành phần</Title>
          <Input
            placeholder="Nhập tên"
            onChange={onChangeName}
            style={{ width: '20rem' }}
          />
        </div>
        <div>
          <Title level={5} style={{}} >Chọn nhóm thực phẩm:</Title>
          <Select
            style={{ width: '20rem' }}
            // style={{ minWidth: 200 }}
            className="tools-select"
            // clearIcon={true}
            placeholder="Chọn nhóm thực phẩm"
            size="middle"
            onChange={onChangeFoodGroup}
            defaultValue={0}
          >
            <Option value={0}>Tất cả</Option>
            {
              groupData?.getAllFoodGroup ? groupData?.getAllFoodGroup.map(item => {
                return (<Option value={parseInt(item.id)}>{item.groupName}</Option>)
              }) : ""

            }
          </Select>
        </div>

        <Button
          type="primary"
          style={{ marginTop: "3.2rem", marginLeft: "2rem" }}
          onClick={onSearch}
        > Tìm kiếm </Button>

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
            </div>
            :
            foodData ?
              Content : ""
        }
      </div>
    </div>
  )
}

export default SearchByName