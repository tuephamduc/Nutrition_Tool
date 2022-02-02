import React, { useEffect, useState } from 'react';
import DashboardLayout from 'components/DashboardLayout/DashboardLayout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { GET_USER } from 'graphql/Admin/AdminQueries'
import { PER_PAGE } from 'constants/Pagination';
import { Breadcrumb, Table, Pagination, Input, Spin, Empty, message, DatePicker, Button, Modal, Tag, Form, Select, Switch } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { FormProvider, useForm } from "react-hook-form";
import { ADD_USER, EDIT_USER } from "graphql/Admin/AdminMutation"
import DateFormat from "helpers/DateFormat"
import moment from 'moment';

let locale = {
  emptyText: 'Data Empty',
};

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10 }
}
const dateFormat = "YYYY/MM/DD";
const ListUserPage = ({ collapse, setCollapse }) => {
  const methods = useForm()
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [modalProps, setModalProps] = useState({
    visible: false,
    modalType: 1,
    dataEdit: {}
  });

  const { Search } = Input

  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userQuery: {
        page: page,
        limit: PER_PAGE,
        search: search
      }
    }
  })
  useEffect(() => {
    if (data) {
      setUserData(data.getUsers.edges)
    }

  }, [data]);

  const [addUser] = useMutation(ADD_USER, {
    onCompleted({ addUser }) {
      const userProfiles = {
        birthday: addUser.birthday,
        gender: addUser.gender,
      }
      const newUser = { ...addUser, userProfile: userProfiles }
      setUserData([...userData, newUser]);
      message.success("Success!!!")
    },
    onError(error) {
      message.error(error.message)
    }
  })

  const [editUser] = useMutation(EDIT_USER, {
    onCompleted({ editUser }) {
      const userProfile = {
        birthday: editUser.birthday,
        gender: editUser.gender,
      }
      const newUser = { ...editUser, userProfile }
      const newArr = userData.map(item => {
        if (item.id === newUser.id) {
          return { ...item, ...newUser }
        } return item
      })
      setUserData(newArr)
      message.success("Success!!!")
    },
    onError(error) {
      message.error(error.message)
    }
  })

  const tableData = data?.getUsers && userData.map(item => {
    let usergender
    if (item?.userProfile?.gender === 1) {
      usergender = "Male"
    }
    else if (item?.userProfile?.gender === 2) {
      usergender = "Female"
    }
    else if (item?.userProfile?.gender === 3) {
      usergender = "Other"
    } else {
      usergender = null
    }
    return {
      id: item.id,
      username: item.username,
      email: item.email,
      roles: item.roles,
      active: item.active,
      birthday: item?.userProfile?.birthday ? DateFormat(item?.userProfile?.birthday) : "",
      gender: usergender,
      height: item?.userProfile?.height,
      weight: item?.userProfile?.weight
    }
  })

  // TableColumn
  const UserColumn = [
    {
      title: "Username",
      key: "username",
      dataIndex: 'username',
      width: '20%',
    },
    {
      title: "Email",
      key: "email",
      dataIndex: 'email',
      width: '30%',
    },

    {
      title: "Birthday",
      key: "birthday",
      dataIndex: 'birthday',
      width: '20%',
    },
    {
      title: "Gender",
      key: "gender",
      dataIndex: 'gender',
      width: '20%',
    },
    {
      title: "Role",
      key: "roles",
      dataIndex: 'roles',
      width: '15%',
      render: roles => {
        return (<Tag color={'cyan'}>{roles}</Tag>)
      }
    },
    {
      title: "Active",
      key: "active",
      dataIndex: 'active',
      render: active => {
        return (
          <div style={{ display: "flex" }}>
            <Tag color={active ? "green" : "volcano"} key={active}>{active ? "Active" : "Deactivating"}</Tag>
          </div>
        )
      }
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: 'right',

      render: (text, record, index) => {
        return (
          <>
            <Button
              type="link"
              onClick={
                () => {
                  const findData = userData.find(item => item.id === record.id)
                  const newbirthday = record.birthday ? moment(record.birthday) : null
                  const EditData = { ...findData, birthday: (findData?.userProfile?.birthday ? moment(findData?.userProfile?.birthday) : null), gender: findData?.userProfile?.gender }

                  setModalProps(prevState => {
                    return ({
                      ...prevState,
                      visible: true,
                      modalType: 2,
                      dataEdit: EditData
                    })
                  })
                }
              }>Sửa</Button>
          </>
        )
      }
    }
  ]

  const onSearch = (value) => {
    setSearch(value)
  }
  const pageChange = (page) => {
    setPage(page)
  }
  //Modal function

  const handleCancel = () => {
    setModalProps(prevState => {
      return ({
        ...prevState,
        visible: false
      })
    })
  }

  const onSubmit = (data) => {
    const newBirth = new Date(data.birthday)
    const { birthday, ...raw } = data
    const convertData = { ...raw, birthday: newBirth }
    if (modalProps.modalType === 1) {
      addUser({
        variables: {
          userInput: convertData
        }
      })

      setModalProps(prevState => {
        return ({
          ...prevState,
          visible: false
        })
      })
    } else {
      editUser({
        variables: {
          userInput: convertData,
          id: parseInt(modalProps.dataEdit.id)
        }
      })
      setModalProps(prevState => {
        return ({
          ...prevState,
          visible: false
        })
      })
    }
  }

  return (
    <DashboardLayout collapse={collapse} setCollapse={setCollapse}>
      <section className='dashboard-header'>
        <Breadcrumb className='dashboard-header__breadcum'>
          <Breadcrumb.Item href='/admin'>
            <DashboardOutlined />
            <span>Home</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href='/admin/users'>
            <UserOutlined />
            <span>Người dùng</span>
          </Breadcrumb.Item>
        </Breadcrumb>

      </section>
      <section className="dashboard-main">
        <div className="search-bar">
          <Search
            placeholder="Search"
            allowClear
            onSearch={onSearch}
            style={{ width: "30rem" }}
            loading={loading}
          />
          <Button type="ghost" onClick={() => {
            setModalProps(prevState => {
              return ({
                ...prevState,
                visible: true,
                modalType: 1,
                dataEdit: {}
              })
            })
          }}>
            Thêm mới
          </Button>
        </div>
        <Table
          columns={UserColumn}
          dataSource={data && tableData}
          pagination={false}
          locale={locale}
          loading={{
            indicator: <div><Spin size="large" /></div>,
            spinning: loading
          }}
        />

        <Pagination
          total={data && data.getUsers.total}
          defaultPageSize={PER_PAGE}
          defaultCurrent={page}
          onChange={pageChange}
          hideOnSinglePage={true}
          responsive={true}
        />

        <Modal
          title={modalProps.modalType === 1 ? "Add User" : "Edit User"}
          visible={modalProps.visible}
          onCancel={handleCancel}
          destroyOnClose={true}
          footer={null}
        >

          <FormProvider {...methods}>
            <Form {...layout}
              initialValues={modalProps.dataEdit}
              onFinish={onSubmit}

            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
              >
                <Input name="email" />
              </Form.Item>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
              >
                <Input name="username" />
              </Form.Item>
              {
                (modalProps.modalType === 1) ?
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
                  >
                    <Input.Password name="password" />
                  </Form.Item> : ""
              }
              <Form.Item
                label="Birthday"
                name="birthday"
                rules={[{ required: false }]}

              >
                <DatePicker name="birthday" format={dateFormat} />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
              >
                <Select name="gender">
                  <Select.Option value={1}>Male</Select.Option>
                  <Select.Option value={2}>Female</Select.Option>
                  <Select.Option value={3}>Other</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Role"
                name="roles"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
              >
                <Select name="roles">
                  <Select.Option value="ADMIN">ADMIN</Select.Option>
                  <Select.Option value="USER">USER</Select.Option>
                  <Select.Option value="EXPERT">EXPERT</Select.Option>
                </Select>

              </Form.Item>

              <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
                valuePropName="checked"
              >

                <Switch name="active"></Switch>

              </Form.Item>

              <Form.Item className='modal-footer'>
                <Button type="primary" htmlType="submit"
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </FormProvider>
        </Modal>
      </section>
    </DashboardLayout >
  )
}

export default ListUserPage