import React, { useState, useEffect, useRef } from "react";
import { gql, useQuery, useMutation } from '@apollo/client';
import { Breadcrumb, Input, Spin, message, Button, Form, Select, Upload } from 'antd';
import { IMPORT_FOOD } from "graphql/Basic/BasicMutation";
import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import { UserOutlined, DashboardOutlined, UploadOutlined } from '@ant-design/icons';
import { FormProvider, useForm } from "react-hook-form";
import useAuth from "hooks/Auth/useAuth";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 4 }
}
const ImportFood = ({ collapse, setCollapse }) => {
  const auth = useAuth()
  const roles = auth.user.roles
  const methods = useForm()
  const { Option } = Select
  const [file, setFile] = useState();


  const [importFoodData, { data, loading }] = useMutation(IMPORT_FOOD, {
    onCompleted(data) {
      message.success("Thêm thành công")
    },
    onError(err) {
      message.error(err.message)
    }
  })

  const handleChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = (data) => {

    if (roles === "ADMIN") {
      importFoodData({
        variables: {
          file: file,
          owner: data.owner,
          scope: data.scope
        }
      })
    } else {
      importFoodData({
        variables: {
          file: file,
          scope: data.scope
        }
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
            <span>Import Food</span>
          </Breadcrumb.Item>
        </Breadcrumb>

      </section>

      <section className="dashboard-main">
        <FormProvider {...methods} >
          <Form
            className="upload-form" {...layout}
            onFinish={handleSubmit}
          >
            <Form.Item
            >
              {/* <Upload
                {...props}
                accept=".xlsx"
                onChange={handleChange}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload> */}
              <Input
                type="file"
                onChange={handleChange}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </Form.Item>
            {roles === "ADMIN" ?
              <Form.Item
                name="owner"
                label="Nguồn"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
              >
                <Input name="owner" />
              </Form.Item>
              : ""}
            <Form.Item
              name="scope"
              label="Chia sẻ"
              rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
            >
              <Select>
                <Option value={true}>Công khai</Option>
                <Option value={false}>Riêng tư</Option>
              </Select>
            </Form.Item>
            <Form.Item className='modal-footer'>
              <Button type="primary" htmlType="submit"
                loading={loading}
              >
                {`Import dữ liệu${loading ? "..." : ""}`}
              </Button>
            </Form.Item>
          </Form>
        </FormProvider>
      </section>

    </DashboardLayout>
  )
}

export default ImportFood