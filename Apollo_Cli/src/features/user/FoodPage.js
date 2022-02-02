import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from '@apollo/client';
import { GET_USER_FOOD } from "graphql/User/UserQuery";
import { PER_PAGE } from "constants/Pagination";
import { Breadcrumb, Table, Pagination, Image, Input, Spin, Empty, DatePicker, Button, Modal, Tag, Form, Select, Switch, message, Popconfirm } from 'antd';
import dotenv from 'dotenv'
import LinkButton from "components/LinkButton/LinkButton"
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { exportSample, exportFood } from "axiosClient/appAPI"
import { DELETE_FOOD } from 'graphql/Basic/BasicMutation';
dotenv.config();
let locale = {
  emptyText: 'Data Empty',
};
const { Search } = Input;
const { Option } = Select;
const UserFood = ({ collapse, setCollapse }) => {
  const [foodData, setFoodData] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    search: "",
    limit: PER_PAGE,
    page: 1,
  });

  const { loading, error, data } = useQuery(GET_USER_FOOD, {
    variables: {
      query: searchQuery
    }
  })

  const [deleteFood, { loading: deleteLoading }] = useMutation(DELETE_FOOD, {
    onCompleted({ deleteFood }) {
      const newArr = foodData.filter(item => item.id !== deleteFood)
      setFoodData(newArr)
      message.success("Xoá thành công")
    },
    onError(err) {
      message.error(err.message)
    }
  })
  const pageChange = (page) => {
    setSearchQuery(prevState => {
      return ({
        ...prevState,
        page: page
      })
    })
  }

  const onSearch = (value) => {
    setSearchQuery(prevState => {
      return ({
        ...prevState,
        search: value
      })
    })
  }

  useEffect(() => {
    if (data) {
      setFoodData(data.getUserFoods.edges)
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const dataMap = data.getUserFoods?.edges.map(item => {
        const foodImage = `${process.env.REACT_APP_SERVER}${item.image}`
        const newItem = {
          ...item,
          foodImage: foodImage,
          groupName: item.group.groupName
        }
        return newItem
      })
      setFoodData(dataMap)
    }
  }, [data]);


  const FoodColumn = [
    {
      title: "Ảnh",
      key: "foodImage",
      dataIndex: 'foodImage',
      width: '10%',
      render: image => {
        return (<Image src={image}
          preview={false}
          className='food-image' />)
      }
    },
    {
      title: "Tên",
      key: "name",
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: "Nhóm thực phẩm",
      key: "groupName",
      dataIndex: 'groupName',
      width: '25%',
    },
    {
      title: "Chia sẻ",
      key: "scope",
      dataIndex: 'scope',
      width: '20%',
      render: scope => {
        return (<Tag color={scope ? "green" : "volcano"} key={scope}>{scope ? "Công khai" : "Riêng tư"}</Tag>)
      }
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: 'action',
      width: '20%',
      align: 'center',
      render: (text, record, index) => {
        return (
          <>
            <Button
              type="link"
              href={`/user/food/${record.id}`}
            >Chi tiết</Button>
            <Button
              href={`/user/edit-food/${record.id}`}
              type="link"
            >Sửa</Button>
            <Popconfirm
              title="Bạn có muốn xoá item không?"
              onConfirm={() => {
                deleteFood({
                  variables: {
                    id: record.id
                  }
                })
              }
              }
            >
              <Button type='link' danger>Xoá</Button>
            </Popconfirm>
          </>

        )
      }
    }
  ]

  return (
    <DashboardLayout collapse={collapse} setCollapse={setCollapse}>
      <section className='dashboard-header'>
        <Breadcrumb className='dashboard-header__breadcum'>
          <Breadcrumb.Item href='/user'>
            <DashboardOutlined />
            <span>Home</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            <UserOutlined />
            <span>My Food</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </section>


      <section className="dashboard-main">
        <div className="search-bar">
          <div>
            <Search
              placeholder="Tìm thức ăn"
              allowClear
              style={{ width: "30rem" }}
              onSearch={onSearch}
            // loading={loading}
            />

          </div>
          <div>
            <Button type="link" onClick={() => exportSample()}>Download Sample</Button>
            <Button type="link" onClick={() => exportFood()}>Download Food</Button>
            <Button type="link"
              href='/user/import-food'
            >
              Import food
            </Button>
            <Button type="ghost"
              href='/user/new-food'
            >
              Thêm
            </Button>
          </div>
        </div>
        <Table
          columns={FoodColumn}
          dataSource={data && foodData}
          pagination={false}
          locale={locale}
          loading={{
            indicator: <div><Spin size="large" /></div>,
            spinning: loading
          }}
        />

        <Pagination
          total={data && data.getUserFoods.total}
          defaultPageSize={PER_PAGE}
          defaultCurrent={searchQuery.page}
          onChange={pageChange}
          hideOnSinglePage={true}
          responsive={true}
          showSizeChanger={false}
        />
      </section>
    </DashboardLayout>
  )
}

export default UserFood