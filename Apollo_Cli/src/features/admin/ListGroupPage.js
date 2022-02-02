import React, { useEffect, useState } from 'react';
import DashboardLayout from 'components/DashboardLayout/DashboardLayout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { GET_FGROUP } from 'graphql/Admin/AdminQueries'
import { PER_PAGE } from 'constants/Pagination';
import { Breadcrumb, Input, Table, Button, Modal, message, Pagination, Form, Popconfirm } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { ADD_FGROUP, EDIT_FGROUP, DELETE_FGROUP } from "graphql/Admin/AdminMutation"
import { FormProvider, useForm } from 'react-hook-form';

let locale = {
  emptyText: 'Data Empty',
};
const layout = {
  labelCol: { span: 6 },
}
const ListGroupPage = ({ collapse, setCollapse }) => {
  const methods = useForm()
  const [page, setPage] = useState(1);
  const [FGData, setFGData] = useState();
  const [modalProps, setModalProps] = useState({
    visible: false,
    modalType: 1,
    dataEdit: {}
  });

  const { loading, error, data } = useQuery(GET_FGROUP, {
    variables: {
      page: page,
      limit: PER_PAGE
    }
  })

  const [addFoodGroup, { loading: addLoading }] = useMutation(ADD_FGROUP, {
    onCompleted({ addFoodGroup }) {
      setFGData([...FGData, addFoodGroup])
      message.success("Success!!!")
    },
    onError(error) {
      message.error(error.message)
    }
  })

  const [editFoodGroup, { loading: editLoaing }] = useMutation(EDIT_FGROUP, {
    onCompleted({ editFoodGroup }) {
      const newArr = FGData.map(item => {
        if (item.id === editFoodGroup.id) {
          return { ...item, ...editFoodGroup }
        }
        return item
      })
      setFGData(newArr)
      message.success("Success!!!")
    },
    onError(error) {
      message.error(error.message)
    }
  })
  const [deleteFoodGroup] = useMutation(DELETE_FGROUP, {
    onCompleted({ deleteFoodGroup }) {

      const newArr = FGData.filter(item =>
        parseInt(item.id) !== parseInt(deleteFoodGroup)
      )
      setFGData(newArr)
      message.success("Success!!!")
    },
    onError(error) {
      message.error(error.message)
    }
  })

  useEffect(() => {
    if (data) setFGData(data.getFoodGroup.edges)
  }, [data]);
  const FGColumn = [
    {
      title: "STT",
      width: '10%',
      render: (text, record, index) => {
        return (index + 1)
      }
    },
    {
      title: "Nhóm thực phẩm",
      key: "groupName",
      dataIndex: 'groupName',
      width: '50%',
    },

    {
      title: "Hành động",
      key: "action",
      dataIndex: "action",
      fixed: 'right',
      align: 'center',
      render: (text, record, index) => {
        return (
          <>
            <Button
              type="link"
              onClick={
                () => {
                  setModalProps(prevState => {
                    return ({
                      ...prevState,
                      visible: true,
                      modalType: 2,
                      dataEdit: record
                    })
                  })
                }
              }>Sửa</Button>

            <Popconfirm

              title="Bạn có muốn xoá nhóm thức ăn này không?"
              onConfirm={
                () => {
                  deleteFoodGroup({ variables: { id: parseInt(record.id) } })
                }
              }
            >
              <Button danger type='text'>Xoá</Button>
            </Popconfirm>
          </>
        )
      }
    }
  ];
  const pageChange = (page) => {
    setPage(page)
  }
  const handleCancel = () => {
    setModalProps(prevState => {
      return ({
        ...prevState,
        visible: false
      })
    })
  }

  const onSubmit = (data) => {
    console.log(modalProps.modalType);
    if (modalProps.modalType === 1) {
      addFoodGroup({
        variables: data
      })

      setModalProps(prevState => {
        return ({
          ...prevState,
          visible: false
        })
      })
    } else {
      const variable = {
        groupName: data.groupName,
        id: parseInt(modalProps.dataEdit.id)
      }
      editFoodGroup({
        variables: variable
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
          <Breadcrumb.Item>
            <UserOutlined />
            <span>Nhóm thực phẩm</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </section>
      <section className="dashboard-main">
        <div className="search-bar reverse">
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
          columns={FGColumn}
          dataSource={data && FGData}
          pagination={false}
          locale={locale}
          loading={loading}
        />
        <Pagination
          total={data && data.getFoodGroup.total}
          defaultPageSize={PER_PAGE}
          defaultCurrent={page}
          onChange={pageChange}
          hideOnSinglePage={true}
          responsive={true}
          showSizeChanger={false}
        />
      </section>

      <Modal
        title={modalProps.modalType === 1 ? "Add Foodgroup" : "Edit Foodgroup"}
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
              label="Group Name"
              name="groupName"
              rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
            >
              <Input name="groupName" />
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
    </DashboardLayout>
  )
}

export default ListGroupPage