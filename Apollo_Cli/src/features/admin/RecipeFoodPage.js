import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import { FOOD_BY_ID, IGRE_BY_NAME } from "graphql/Basic/Basic";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Popover, Tabs, Input, List, Button, Form, Select, Breadcrumb, Typography, Space, message, Empty, Spin, Image, Collapse } from "antd";
import NutritionFact from "components/NutritionFact/NutritionFact";
import Avatar from "antd/lib/avatar/avatar";
import { ALL_GROUP, ALL_NUTRIENT } from 'graphql/Basic/Basic';

import { FormProvider, useForm } from "react-hook-form";
import { MinusCircleOutlined, PlusOutlined, DownCircleOutlined } from '@ant-design/icons';
import { ADD_FOOD, EDIT_FOOD } from "graphql/Basic/BasicMutation";
import { useHistory, useParams } from 'react-router-dom';
import useAuth from "hooks/Auth/useAuth"
import dotenv from 'dotenv'
import ChangeImage from "features/common/ChangeImage";

const server = process.env.REACT_APP_SERVER

dotenv.config();
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 }
}
const { Search } = Input
const { Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse
const { TabPane } = Tabs;

const CacluateNutritionFact = (listNutrient) => {
  const listAttr = [
    'Calories',
    'Fat',
    'TransFat',
    'SaturatedFat',
    'Protein',
    'Cholesterol',
    'Sodium',
    'Potassium',
    'Carbohydrates',
    'DiateryFiber',
    'Sugars',
    'VitaminA',
    'VitaminC',
    'Calcium',
    'Iron',
  ]
  let result = {}

  listAttr.forEach(attr => {
    result[attr] = 0
    result['serving_weight_grams'] = 0
    result['serving_unit'] = "serving"
    listNutrient.forEach(item => {
      result[attr] = result[attr] + item[attr] * item['value'] / item['serving_weight_grams']
      result['serving_weight_grams'] = result['serving_weight_grams'] + item['value']
    })
  })
  return result

}

export const CalculateExtraNutrition = (listTotal) => {
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
    obj2.push({ nutrientId: prop, value: holder[prop] });
  }

  return obj2
}

const checkDupAttr = (list, att) => {
  let listAttr = list.map(item => item[att])
  let isDup = listAttr.some(
    function (item, idx) {
      return listAttr.indexOf(item) != idx
    }
  )
  return isDup
}

const RecipeFoodPage = ({ collapse, setCollapse }) => {
  const auth = useAuth();
  const methods = useForm();
  const [form] = Form.useForm()
  const history = useHistory()
  const { slug } = useParams()
  const searchRef = useRef();

  const [search, setSearch] = useState(null);
  const [listIngredient, setlistIngredient] = useState([]);
  const [food, setFood] = useState();
  const [modalSearch, setmodalSearch] = useState(false);

  const { data, loading: searchLoading } = useQuery(IGRE_BY_NAME, {
    variables: {
      search: search
    }
  })
  const { data: groupData } = useQuery(ALL_GROUP);
  const { data: nutrientData } = useQuery(ALL_NUTRIENT);

  const [addFood, { loading: addloading }] = useMutation(ADD_FOOD, {
    onCompleted({ addFood }) {
      message.success("Thêm thức ăn thành công !!!")
      if (auth.user.roles === "ADMIN") {
        history.push(`/admin/food/${addFood.id}`)
      }
      if (auth.user.roles === "USER") {
        history.push(`/user/my-food`)
      }
      if (auth.user.roles === "EXPERT") {
        history.push(`/expert/foods`)
      }
    },
    onError(error) {
      message.error(error.message)
    }
  })

  const [editFood, { loading: editLoading }] = useMutation(EDIT_FOOD, {
    onCompleted({ editFood }) {
      message.success("Sửa thức ăn thành công !!!")
      // history.push(`/admin/food/${editFood.id}`)
      if (auth.user.roles === "ADMIN") {
        history.push(`/admin/foods`)
      }
      if (auth.user.roles === "USER") {
        history.push(`/user/my-food`)
      }
      if (auth.user.roles === "EXPERT") {
        history.push(`/expert/foods`)
      }
    }, onError(error) {
      message.error(error.message)
    }

  })

  const [loadingfood, { data: foodItem, loading: itemLoading }] = useLazyQuery(FOOD_BY_ID, {
    variables: {
      id: slug
    },
    onError(error) {
      message.error(error.message)
    }
  })



  useEffect(() => {
    if (slug) {
      loadingfood()
    }
    if (slug && foodItem) {
      setFood(foodItem.getFoodById)
      setlistIngredient(foodItem.getFoodById?.components)
    }
  }, [slug, foodItem, loadingfood]);

  useEffect(() => {
    let listIngre = {}
    if (listIngredient.length > 0) {
      listIngredient.forEach(item => {
        listIngre[item.componentId] = item.value
      })
    }
    if (!slug) {
      form.setFieldsValue({
        scope: false
      })
    }
    if (slug || food) {
      form.setFieldsValue({
        name: food?.name,
        language: food?.language,
        owner: food?.owner,
        foodGroup: food?.foodGroup,
        scope: food?.scope,
        isIngredient: food?.isIngredient,
        serving_weight_grams: food?.basicNutrients?.serving_weight_grams,
        serving_unit: food?.basicNutrients?.serving_unit,
        Calories: food?.basicNutrients?.Calories,
        Fat: food?.basicNutrients?.Fat,
        TransFat: food?.basicNutrients?.TransFat,
        SaturatedFat: food?.basicNutrients?.SaturatedFat,
        Protein: food?.basicNutrients?.Protein,
        Cholesterol: food?.basicNutrients?.Cholesterol,
        Sodium: food?.basicNutrients?.Sodium,
        Potassium: food?.basicNutrients?.Potassium,
        Carbohydrates: food?.basicNutrients?.Carbohydrates,
        DiateryFiber: food?.basicNutrients?.DiateryFiber,
        Sugars: food?.basicNutrients?.Sugars,
        VitaminA: food?.basicNutrients?.VitaminA,
        VitaminC: food?.basicNutrients?.VitaminC,
        Calcium: food?.basicNutrients?.Calcium,
        Iron: food?.basicNutrients?.Iron,
        extraNutrients: food?.extraNutrients,
        ...listIngre
      })
    }
  }, [food, form, slug]);
  //search and add ingredient

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

  const onSearch = (value) => {
    setSearch(value)
    setmodalSearch(true)
  }

  const addIngre = (ingre) => {
    const existItem = listIngredient.find(item => item.componentId === ingre.id)
    if (existItem) {
      message.error("Bạn không thể chọn 1 nguyên liệu 2 lần")
    }
    else {
      setlistIngredient([...listIngredient, {
        componentId: ingre.id,
        component: ingre,
        value: 0
      }])
    }
  }



  // Submit form Add food by recipe
  const onSubmit = (data) => {
    const ingredients = listIngredient && listIngredient.map(item => {
      return ({
        componentId: item.componentId,
        value: parseFloat(item.value)
      })
    })
    const extraNutrient = data?.extraNutrients && data?.extraNutrients.map(item => {
      return ({
        nutrientId: parseInt(item.nutrientId),
        value: parseFloat(item.value)
      })
    })

    const isDup = extraNutrient && checkDupAttr(extraNutrient, 'nutrientId')

    if (isDup) {
      message.error("Bạn không thể chọn 1 MicroNutrient 2 lần. Vui lòng kiểm tra lại")
    } else {
      const foodInput = {
        ingredients: ingredients,
        name: data.name,
        foodGroup: data.foodGroup,
        language: data.language,
        owner: data.owner,
        scope: data.scope,
        isIngredient: data.isIngredient,
        basicNutrients: {
          serving_unit: data.serving_unit && data.serving_unit,
          serving_weight_grams: data.serving_weight_grams && parseFloat(data.serving_weight_grams),
          Calories: data.Calories && parseFloat(data.Calories),
          Fat: data.Fat && parseFloat(data.Fat),
          SaturatedFat: data.SaturatedFat && parseFloat(data.SaturatedFat),
          TransFat: parseFloat(data.TransFat),
          Protein: parseFloat(data.Protein),
          Cholesterol: parseFloat(data.Cholesterol),
          Sodium: parseFloat(data.Sodium),
          Potassium: parseFloat(data.Potassium),
          Carbohydrates: parseFloat(data.Carbohydrates),
          DiateryFiber: parseFloat(data.DiateryFiber),
          Sugars: parseFloat(data.Sugars),
          VitaminA: parseFloat(data.VitaminA),
          VitaminC: parseFloat(data.VitaminC),
          Calcium: parseFloat(data.Calcium),
          Iron: parseFloat(data.Iron),
        },
        extraNutrients: extraNutrient
      }
      if (!slug) {
        addFood({
          variables: {
            foodInput: foodInput
          }
        })
      } else {
        editFood({
          variables: {
            foodInput: foodInput,
            id: slug
          }
        })
      }
    }
  }

  const autoCalculateNutrient = (data) => {

    if (listIngredient.length === 0) {
      message.error("You must choose at least 1 ingredient")
    } else {

      // Caculate NutritionFact
      const listBasic = listIngredient.map(item => {
        return { ...item.component.basicNutrients, value: item.value }
      })

      const a = CacluateNutritionFact(listBasic)


      // Caculate Extra Nutrient
      const listExtra = listIngredient.map(item => {
        const factor = item.value / item.component.basicNutrients.serving_weight_grams
        const map = item.component.extraNutrients.map(e => {
          return { nutrientId: e.nutrientId, value: (factor * parseFloat(e.value)) }
        })
        return { extra: map }
      })

      let listTotal = []
      listExtra.forEach(item => {
        listTotal = listTotal.concat(item.extra)
      })

      const extraNutrition = CalculateExtraNutrition(listTotal)
      setFood(prevState => {
        return ({
          ...prevState,
          basicNutrients: a,
          extraNutrients: extraNutrition
        })
      })
    }
  }


  // Delete Ingredient into List Component
  const deleteInge = (deleteItem) => {
    const newList = listIngredient.filter(item => item.componentId !== deleteItem.componentId)
    setlistIngredient(newList)
  }
  const searchContent = (
    modalSearch ?
      searchLoading ?
        <Spin size="large" tip="Loading..." />
        :
        (data && data.getIngredientsByName.length > 0) ?
          <List
            className="search-content"
          >
            {
              data.getIngredientsByName.map(item => {
                return (
                  <List.Item
                    actions={
                      [
                        <Button onClick={() => { addIngre(item) }}>Add Ingredient</Button>
                      ]
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={`${process.env.REACT_APP_SERVER}${item.image}`} />}
                      title={item.name}
                    />
                  </List.Item>
                )
              })
            }
          </List>
          : ""
      : ""
  )



  return (
    <DashboardLayout collapse={collapse} setCollapse={setCollapse}>
      <section className='dashboard-header'>
        <Breadcrumb className='dashboard-header__breadcum'>
          <Breadcrumb.Item>
            {/* // <DashboardOutlined /> */}
            <span>Home</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            {/* <UserOutlined /> */}
            <span>{slug ? "Sửa thức ăn" : "Thêm thức ăn"}</span>
          </Breadcrumb.Item>
        </Breadcrumb>

      </section>
      <section className="dashboard-main">

        {
          itemLoading ? <Spin /> :
            <div className="container-flex justify">
              <div>
                <FormProvider {...methods}>
                  <Form {...layout}
                    onFinish={onSubmit}
                    form={form}
                  >
                    <Form.Item >
                      <Button type="primary" htmlType="submit"
                      >
                        Lưu
                      </Button>
                    </Form.Item>
                    <div className="container-flex">
                      <Tabs>
                        {/* Common Info */}
                        <TabPane key="1" tab="Thông tin cơ bản">
                          <div className="container-flex">
                            <div>
                              <Title level={4}>Thông tin cơ bản</Title>
                              <Form.Item
                                label="Tên thức ăn"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
                              >
                                <Input name="name" />
                              </Form.Item>

                              <Form.Item
                                label="Quốc gia"
                                name="language"
                              >
                                <Select>
                                  <Option key="VIE" value="VIE">Việt Nam</Option>
                                  <Option key="ENG" value="ENG">Anh</Option>
                                  <Option key="US" value="US">Mỹ</Option>
                                </Select>
                              </Form.Item>

                              <Form.Item
                                label="Nhóm thức ăn"
                                name="foodGroup"
                                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
                              >
                                <Select

                                >
                                  {
                                    groupData?.getAllFoodGroup ? groupData?.getAllFoodGroup.map(item => {
                                      return (<Option key={(item.id)} value={parseInt(item.id)}>{item.groupName}</Option>)
                                    }) : ""
                                  }

                                </Select>
                              </Form.Item>
                              {auth.user.roles !== "USER" ?
                                <Form.Item
                                  label="Nguồn"
                                  name="owner"
                                >
                                  <Input name="owner" />
                                </Form.Item>
                                : ""
                              }
                              <Form.Item
                                label="Ingredient"
                                name="isIngredient"
                              >
                                <Select
                                  name="isIngredient"
                                >
                                  <Option key={true} value={true}>True</Option>
                                  <Option key={false} value={false}>False</Option>
                                </Select>
                              </Form.Item>
                              <Form.Item
                                label="Chia sẻ"
                                name="scope"
                              >
                                <Select
                                  name="scope"
                                  disabled={auth && (auth.user.roles === "USER")}
                                >
                                  <Option key={true} value={true}>Công khai</Option>
                                  <Option key={false} value={false}>Riêng tư</Option>
                                </Select>
                              </Form.Item>

                              <Form.Item
                                label="Tên khẩu phần"
                                name="serving_unit"
                                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
                              >
                                <Input name="serving_unit" />
                              </Form.Item>


                              <Form.Item
                                label="Khối lượng"
                                name="serving_weight_grams"
                                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
                              >
                                <Input name="serving_weight_grams" type="number" />
                              </Form.Item>
                            </div>
                            <div>
                              <Title level={4}>Thành phần (g)</Title>
                              <div className="search-food" ref={searchRef}>

                                <Search
                                  placeholder="Thêm thành phần"
                                  allowClear
                                  style={{ width: "30rem" }}
                                  onSearch={
                                    (value, e) => {
                                      onSearch(value)
                                      e.preventDefault()
                                    }
                                  }
                                />
                                {searchContent}

                              </div>
                              {
                                listIngredient.map(item => {
                                  return (
                                    <div className="ingre-group">
                                      <div>
                                        <Form.Item

                                          label={<label className="input-lable">{item.component.name}</label>}
                                          name={item.componentId}
                                          {...layout}
                                          rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
                                        >

                                          <Input type="number"
                                            name={item.componentId}
                                            onChange={(e) => {
                                              e.preventDefault()
                                              const newArr = listIngredient.map(ex => {
                                                if (ex.componentId === item.componentId) {
                                                  return { ...ex, value: parseFloat(e.target.value) }
                                                }
                                                return ex
                                              })

                                              setlistIngredient(newArr)

                                            }}
                                          />

                                        </Form.Item>
                                      </div>
                                      <MinusCircleOutlined className="dynamic-delete-button" onClick={() =>
                                        deleteInge(item)
                                      } />

                                    </div>

                                  )
                                })
                              }
                              <Button
                                type="link"
                                htmlType="submit"
                                onClick={(e) => {
                                  autoCalculateNutrient()
                                  e.preventDefault()
                                }}
                              >
                                Tự động tính chất dinh dưỡng dựa trên thành phần
                              </Button>
                            </div>



                          </div>
                        </TabPane>

                        {/* Nutrition Info */}
                        <TabPane key="2" tab="Thông tin dinh dưỡng">
                          <Collapse
                            className="collapse-container only-flex"
                            defaultActiveKey={[1, 2]}
                          >
                            <Panel
                              header={<Title level={4}>Nhãn dinh dưỡng</Title>}
                              showArrow={false}
                              extra={<DownCircleOutlined className="down-arrow" />}
                              key={1}
                              className="panel-form mr"
                            >

                              <Form.Item
                                label="Calories"
                                name="Calories"
                              >
                                <Input type="number" name="Calories" />
                              </Form.Item>

                              <Form.Item
                                label="Fat"
                                name="Fat"
                              >
                                <Input type="number" name="Fat" />
                              </Form.Item>

                              <Form.Item
                                label="TransFat"
                                name="TransFat"
                              >
                                <Input type="number" name="TransFat" />
                              </Form.Item>

                              <Form.Item
                                label="SaturatedFat"
                                name="SaturatedFat"
                              >
                                <Input type="number" name="SaturatedFat" />
                              </Form.Item>

                              <Form.Item
                                label="Protein"
                                name="Protein"
                              >
                                <Input type="number" name="Protein" />
                              </Form.Item>

                              <Form.Item
                                label="Cholesterol"
                                name="Cholesterol"
                              >
                                <Input type="number" name="Cholesterol" />
                              </Form.Item>

                              <Form.Item
                                label="Sodium"
                                name="Sodium"
                              >
                                <Input type="number" name="Sodium" />
                              </Form.Item>

                              <Form.Item
                                label="Carbohydrates"
                                name="Carbohydrates"
                              >
                                <Input type="number" name="Carbohydrates" />
                              </Form.Item>

                              <Form.Item
                                label="DiateryFiber"
                                name="DiateryFiber"
                              >
                                <Input type="number" name="DiateryFiber" />
                              </Form.Item>

                              <Form.Item
                                label="Sugars"
                                name="Sugars"
                              >
                                <Input type="number" name="Sugars" />
                              </Form.Item>

                              <Form.Item
                                label="VitaminA"
                                name="VitaminA"
                              >
                                <Input type="number" name="VitaminA" />
                              </Form.Item>

                              <Form.Item
                                label="VitaminC"
                                name="VitaminC"
                              >
                                <Input type="number" name="VitaminC" />
                              </Form.Item>

                              <Form.Item
                                label="Calcium"
                                name="Calcium"
                              >
                                <Input type="number" name="Calcium" />
                              </Form.Item>

                              <Form.Item
                                label="Iron"
                                name="Iron"
                              >
                                <Input type="number" name="Iron" />
                              </Form.Item>
                            </Panel>

                            <Panel
                              header={<Title level={4}>MicroNutrient</Title>}
                              showArrow={false}
                              extra={<DownCircleOutlined className="down-arrow" />}
                              key={2}
                              className="panel-form"

                            >

                              <Form.List name="extraNutrients">
                                {(fields, { add, remove }) => (
                                  <>
                                    {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                                      return (
                                        <Space key={key} align="baseline">
                                          <Form.Item
                                            {...restField}
                                            name={[name, 'nutrientId']}
                                            // label="Nutrients"
                                            fieldKey={[fieldKey, 'nutrientId']}
                                            rules={[{ required: true, message: 'Chọn chất dinh dưỡng' }]}

                                          >
                                            <Select
                                              // layout={{ wrapperCol: "20" }}
                                              style={{ width: "15rem" }}
                                              name="nutrientId"
                                              placeholder="Chọn chất dinh dưỡng"
                                            >
                                              {
                                                nutrientData?.getAllNutrients ? nutrientData?.getAllNutrients.map(item => {
                                                  return (<Option
                                                    key={item.id}
                                                    value={(item.id)}
                                                  >{`${item.nutrient} (${item.unit})`}</Option>)
                                                }) : ""
                                              }
                                            </Select>
                                          </Form.Item>

                                          <Form.Item
                                            {...restField}
                                            name={[name, 'value']}
                                            // label="Value"
                                            wrapperCol={{ span: 30 }}
                                            fieldKey={[fieldKey, 'value']}
                                            rules={[{ required: true, message: 'Nhập giá trị' }]}
                                            style={{ width: "12rem" }}
                                          >
                                            <Input placeholder="Value" name="value" type="number" />
                                          </Form.Item>
                                          <MinusCircleOutlined
                                            onClick={() => {
                                              remove(name)
                                            }}
                                          />
                                        </Space>
                                      )
                                    }
                                    )}
                                    <Form.Item>
                                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add field
                                      </Button>
                                    </Form.Item>
                                  </>
                                )}

                              </Form.List>
                            </Panel>


                          </Collapse>
                        </TabPane>
                      </Tabs>
                    </div>

                  </Form>
                </FormProvider>
              </div>
              <div>

                {slug ?
                  <ChangeImage image={food?.image} id={slug} />
                  : ""
                }
                {food?.basicNutrients &&
                  <NutritionFact nutrientData={food.basicNutrients} />
                }
              </div>
            </div>

        }
      </section>
    </DashboardLayout >
  )
}
export default RecipeFoodPage