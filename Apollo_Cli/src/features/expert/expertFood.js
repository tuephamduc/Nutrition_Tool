import React, { useEffect, useState } from 'react';
import DashboardLayout from 'components/DashboardLayout/DashboardLayout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { GET_FOOD } from 'graphql/Admin/AdminQueries'
import { ALL_GROUP } from 'graphql/Basic/Basic';
import { PER_PAGE } from 'constants/Pagination';
import { Breadcrumb, Table, Pagination, Image, Input, Spin, Empty, DatePicker, Button, Modal, Tag, Form, Select, Switch, message, Popconfirm } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { FormProvider, useForm } from "react-hook-form";
import dotenv from 'dotenv'
import LinkButton from "components/LinkButton/LinkButton"
import { exportSample, exportFood } from "axiosClient/appAPI"
import { DELETE_FOOD } from 'graphql/Basic/BasicMutation';
dotenv.config();

let locale = {
  emptyText: 'Data Empty',
};

const layout = {
  labelCol: { span: 4 },
}

const ExpertFood = ({ collapse, setCollapse }) => {
  const { Search } = Input;
  const { Option } = Select;
  const methods = useForm()
  const [page, setPage] = useState(1);
  const [foodData, setFoodData] = useState([]);


  const [searchQuery, setSearchQuery] = useState({
    search: "",
    limit: PER_PAGE,
    page: 1,
    foodGroup: 0
  });


  const { loading, error, data } = useQuery(GET_FOOD, {
    variables: {
      query: searchQuery
    }
  })
  useEffect(() => {
    if (data) {
      setFoodData(data.getFoods.edges)
    }
  }, [data]);

  const { data: groupData } = useQuery(ALL_GROUP)

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

  // Search and filter function
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

  const onFilterGroup = (value) => {
    setSearchQuery(prevState => {
      return ({
        ...prevState,
        foodGroup: value
      })
    })
  }

  useEffect(() => {
    if (data) {
      const dataMap = data.getFoods?.edges.map(item => {
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
            <LinkButton
              to={`/expert/food/${record.id}`}
              type="link"
              className="linkbutton"
            >Chi tiết</LinkButton>
            <Button
              href={`/expert/edit-food/${record.id}`}
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
          <Breadcrumb.Item href='/expert/foods'>
            <DashboardOutlined />
            <span>Home</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href='/expert/foods'>
            <UserOutlined />
            <span>Foods</span>
          </Breadcrumb.Item>
        </Breadcrumb>

      </section>
      <section className="dashboard-main">
        <div className="search-bar">
          <div>
            <Search
              placeholder="Search food"
              allowClear
              style={{ width: "30rem" }}
              onSearch={onSearch}
            // loading={loading}
            />
            <Select
              style={{ width: 160, marginLeft: '2rem' }}
              onChange={onFilterGroup}
              placeholder="Select FoodGroup"
            >
              <Option value={0}>All</Option>
              {
                groupData?.getAllFoodGroup ? groupData?.getAllFoodGroup.map(item => {
                  return (<Option value={parseInt(item.id)}>{item.groupName}</Option>)
                }) : ""
              }
            </Select>
          </div>
          <div>
            <Button type="link" onClick={() => exportSample()}>Download Sample</Button>
            <Button type="link" onClick={() => exportFood()}>Download Food</Button>
            <Button type="link"
              href='/expert/import-food'
            >
              Import food
            </Button>
            <Button type="ghost"
              href='/expert/new-food'
            >
              Thêm mới
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
          total={data && data.getFoods.total}
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

export default ExpertFood