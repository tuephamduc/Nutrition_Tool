import React, { useState, useEffect, useRef } from "react"
import { Avatar, Modal, Typography, Radio, Form, Button, List, Input, DatePicker, message, Tabs, Spin, Tooltip } from "antd";
import moment from "moment";
import dotenv from 'dotenv'
import NutritionFact from "components/NutritionFact/NutritionFact";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_USER_FOOD } from "graphql/User/UserQuery";
import { PER_PAGE } from "constants/Pagination";
import { SEARCH_BY_NAME } from "graphql/Basic/Basic";
import { ref } from "yup";
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import useFoodLog from "hooks/FoodLog/useFoodLog";
const server = process.env.REACT_APP_SERVER

dotenv.config();
const { Title } = Typography
const { Search } = Input
const { TabPane } = Tabs;
const AddLogModal = ({ visible, setVisible, data }) => {
  const [modalSearch, setmodalSearch] = useState(false);
  const searchRef = useRef();
  const { addLoaing, addFoodLog } = useFoodLog();

  const [foodLogInput, setFoodLogInput] = useState({
    foods: [],
    date: data && data.date,
    meal: data && data.meal
  });

  const [getUserFoods, { data: userFood, loading: userloading }] = useLazyQuery(GET_USER_FOOD, {
    onError(err) {
      message.error(err.message)
    },
    onCompleted(data) {
      debugger
    }
  })

  const [searchFoodByName, { data: publicFood, loading: publicloading }] = useLazyQuery(SEARCH_BY_NAME, {
    onError(err) {
      message.error(err.message)
    }
  })


  const onSearch = (value) => {
    getUserFoods({
      variables: {
        query: {
          search: value,
          limit: PER_PAGE,
          page: 1
        }
      }
    });

    searchFoodByName({
      variables: {
        foodGroup: 0,
        search: value
      },
    })
    setmodalSearch(true)
  }

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

  const onAddFood = (item) => {
    setFoodLogInput(prevState => {
      return {
        ...prevState,
        foods: [...prevState.foods, {
          food: item,
          value: item.serving_weight_grams
        }]
      }
    })
  }

  const onDeleteFood = (id) => {
    const newList = foodLogInput.foods.filter(item => item.food.id !== id)
    setFoodLogInput(prevState => {
      return {
        ...prevState,
        foods: newList
      }
    })

  }

  const onSubmit = (data) => {
    if (foodLogInput.foods.length === 0) {
      message.error("Vui lòng chọn ít nhất 1 món ăn")
    } else {
      const input = foodLogInput.foods.map(item => {
        return {
          foodId: item.food.id,
          weight: parseFloat(data[item.food.id]),
          date: data.date,
          meal: data.meal
        }
      })
      addFoodLog({
        variables: {
          input: input
        }
      })
      setVisible(false)
    }
  }
  const SearchContent = (
    modalSearch ?
      <div className="search-content add-log-search" >
        <Tabs >
          <TabPane tab="Thức ăn" key={1}>
            {publicloading ?
              <div style={{ width: "100%", textAlign: "center" }}>
                <Spin size="large"></Spin>
              </div> :
              <List>
                {publicFood?.searchFoodByName.map(item => {
                  return (
                    <List.Item
                      actions={
                        [
                          <PlusCircleOutlined onClick={() => { onAddFood(item) }} className="btn-add" />
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
          </TabPane>
          <TabPane tab="Thức ăn của bạn" key={2}>
            {userloading ? <Spin size="large"></Spin> :
              <List>
                {userFood?.getUserFoods?.edges.map(item => {
                  return (
                    <List.Item
                      actions={
                        [
                          <PlusCircleOutlined onClick={() => { onAddFood(item) }} className="btn-add" />
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
          </TabPane>
        </Tabs>
      </div>
      : ""
  )



  return (
    <Modal
      title="Thêm vào Food Log"
      visible={visible}
      onCancel={() => setVisible(false)}
      destroyOnClose
      className="modal-addLog"
      footer={[
        <Form.Item>
          <Button
            form="myForm"
            key="submit"
            htmlType="submit"
            type="primary"
            loading={addLoaing}
          >Thêm</Button>
        </Form.Item>
      ]}
    >

      <div className="search-log" ref={searchRef}>

        <Search
          onSearch={onSearch}
        />
        {
          SearchContent
        }
      </div>
      <Form
        onFinish={onSubmit}
        id="myForm"
      >
        <div className="track-modal-item">
          <Title level={5}>Thức ăn</Title>
          {
            foodLogInput.foods.map(item => {
              return (
                <div className="flex item-fl">
                  <div className="text-center">
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
                    >
                      <Input defaultValue={item.value} type="number" name={item.food.id} />
                    </Form.Item>
                    <DeleteOutlined onClick={() => { onDeleteFood(item.food.id) }} />
                  </div>

                </div>
              )
            })
          }
        </div>
        <div className="track-modal-item">
          <Title level={5}>Bữa ăn</Title>
          <Form.Item
            name="meal"
            initialValue={foodLogInput.meal}
          >
            <Radio.Group defaultValue={foodLogInput.meal}>
              <Radio.Button value="BREAK">Sáng</Radio.Button>
              <Radio.Button value="LUNCH">Trưa</Radio.Button>
              <Radio.Button value="DINNER">Chiều</Radio.Button>
              <Radio.Button value="SNACK">Ăn vặt</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className="track-modal-item">
          <Title level={5}>Ngày</Title>
          <Form.Item
            name="date"
            initialValue={moment(foodLogInput.date)}
            rules={[{ required: true, message: 'Vui lòng chọn giá trị' },]}
          >
            <DatePicker name="date" inputReadOnly={true} defaultValue={moment(foodLogInput.date)} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default AddLogModal