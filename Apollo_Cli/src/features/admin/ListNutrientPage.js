import React, { useEffect, useState } from 'react';
import DashboardLayout from 'components/DashboardLayout/DashboardLayout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { GET_NUTRIENT } from 'graphql/Admin/AdminQueries';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { PER_PAGE } from 'constants/Pagination';
import { Breadcrumb, Table, Button, Input, Spin, Modal, Pagination, Form, Popconfirm, message } from 'antd';
import { ADD_NUTRIENT, EDIT_NUTRIENT, DELETE_NUTRIENT } from "graphql/Admin/AdminMutation"
import { FormProvider, useForm } from 'react-hook-form';
let locale = {
  emptyText: 'Data Empty',
};


const layout = {
  labelCol: { span: 5 },
}
const ListNutrientPage = ({ collapse, setCollapse }) => {
  const methods = useForm()
  const [page, setPage] = useState(1);
  const [nutrientsData, setNutrientsData] = useState();
  const [modalProps, setModalProps] = useState({
    visible: false,
    modalType: 1,
    dataEdit: {}
  });
  const { loading, error, data } = useQuery(GET_NUTRIENT, {
    variables: {
      page: page,
      limit: PER_PAGE
    }
  })
  useEffect(() => {
    if (data) setNutrientsData(data.getNutrients.edges)
  }, [data]);

  const [addNutrient] = useMutation(ADD_NUTRIENT, {
    onCompleted({ addNutrient }) {
      setNutrientsData([...nutrientsData, addNutrient])
      message.success("Success!!!")
    },
    onError(error) {
      message.error(error.message)
    }
  })

  const [editNutrient] = useMutation(EDIT_NUTRIENT, {
    onCompleted({ editNutrient }) {
      const newArr = nutrientsData.map(item => {
        if (item.id === editNutrient.id) {
          return { ...item, ...editNutrient }
        }
        return item
      })
      setNutrientsData(newArr)
      debugger
      message.success("Success!!!")
    },
    onError(error) {
      message.error(error.message)
    }
  })

  const [deleteNutrient] = useMutation(DELETE_NUTRIENT, {
    onCompleted({ deleteNutrient }) {
      const newArr = nutrientsData.filter(item =>
        parseInt(item.id) !== parseInt(deleteNutrient)
      )
      setNutrientsData(newArr)
      message.success("Success!!!")
    },
    onError(error) {
      message.error(error.message)
    }
  })

  const FGColumn = [
    {
      title: "Chất dinh dưỡng",
      key: "nutrient",
      dataIndex: 'nutrient',
      width: '30%',
    },
    {
      title: "Đơn vị",
      key: "unit",
      dataIndex: 'unit',
      width: '20%',
    },
    {
      title: "Tag Name",
      key: "tagname",
      dataIndex: 'tagname',
      width: '20%',
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

              title="Bạn có muốn xoá chất dinh dưỡng này không"
              onConfirm={
                () => {
                  deleteNutrient({ variables: { id: parseInt(record.id) } })
                }
              }
            >
              <Button danger type='text'>Xoá</Button>
            </Popconfirm>
          </>
        )
      }
    }
  ]

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
    if (modalProps.modalType === 1) {
      debugger
      addNutrient({
        variables: data
      })
      setModalProps(prevState => {
        return ({
          ...prevState,
          visible: false
        })
      })
    }
    else {
      editNutrient({
        variables: { ...data, id: parseInt(modalProps.dataEdit.id) }
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
            <span>Chất dinh dưỡng</span>
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
          dataSource={data && nutrientsData}
          pagination={false}
          locale={locale}
          loading={{
            indicator: <div><Spin size="large" tip='Loading!!!' /></div>,
            spinning: loading
          }}
        />

        <Pagination
          total={data && data.getNutrients.total}
          defaultPageSize={PER_PAGE}
          defaultCurrent={page}
          onChange={pageChange}
          hideOnSinglePage={true}
          responsive={true}
          showSizeChanger={false}
        />
      </section>

      <Modal
        title={modalProps.modalType === 1 ? "Add Nutrient" : "Edit Nutrient"}
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
              label="Nutrient"
              name="nutrient"
              rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
            >
              <Input name="nutrient" />
            </Form.Item>
            <Form.Item
              label="Unit"
              name="unit"
              rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
            >
              <Input name="unit" />
            </Form.Item>
            <Form.Item
              label="Tag Name"
              name="tagname"
            >
              <Input name="tagname" />
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

export default ListNutrientPage