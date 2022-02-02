import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import React, { useEffect, useState } from "react";
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { Breadcrumb, Input, Spin, Typography, DatePicker, Button, Modal, Image, Form, Select, message, Popconfirm, Upload } from 'antd';
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { FormProvider, useForm } from "react-hook-form";
import DateFormat from "helpers/DateFormat"
import useUserInfo from 'hooks/UserInfo/useUserInfo';
import moment from 'moment';
import { CHANGE_PASS } from "graphql/Basic/BasicMutation";
import { UploadOutlined } from '@ant-design/icons';
import dotenv from 'dotenv'
dotenv.config();

const server = process.env.REACT_APP_SERVER
const layout = {
  labelCol: { span: 15 },
  wrapperCol: { span: 30 }
}

const modalLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 15 }
}
const { Title } = Typography;
const { Option } = Select;

const dateFormat = "YYYY/MM/DD";

const SettingPage = ({ collapse, setCollapse }) => {
  const userInfo = useUserInfo();
  const methods = useForm();
  const [form] = Form.useForm();
  const info = userInfo?.userInfo;
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState();
  const [file, setFile] = useState();
  useEffect(() => {
    if (info && info?.avatar) {
      setAvatar(`${server}${info?.avatar}`)
    }
  }, [info?.avatar, info]);

  useEffect(() => {
    form.setFieldsValue({
      username: info?.username,
      email: info?.email,
      gender: info?.gender,
      birthday: info?.birthday ? moment(info?.birthday) : "",
      height: info?.height,
      weight: info?.weight
    })
  }, [info, form]);

  const [changePassword, { loading }] = useMutation(CHANGE_PASS, {
    onCompleted({ changePassword }) {
      message.success("Đổi mật khẩu thành công")
      setVisible(false)
    },
    onError(error) {
      message.error(error.message)
    }
  })
  const handleSubmit = (data) => {
    const newBirth = new Date(data.birthday)
    const newheight = data.height && parseFloat(data.height)
    const newweight = data.weight && parseFloat(data.weight)
    const convertData = { ...data, birthday: newBirth, height: newheight, weight: newweight }
    const { email, ...rawData } = convertData
    userInfo.changeUserProfile({
      variables: {
        userProfileInput: rawData
      }
    })
  }

  const handleChangePass = (data) => {
    debugger
    if (data.newPassword !== data.return) {
      message.error("Vui lòng nhập mật khẩu xác nhận trùng khớp")
    }
    else {
      changePassword({
        variables: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        }
      })
    }

  }

  const onCancel = () => {
    setVisible(false)
  }

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    var url = reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      setAvatar(reader.result)
    }
    setFile(file)
  }

  const handleChangeAvatar = () => {
    userInfo.uploadAvatar({
      variables: {
        file: file
      }
    })
  }

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
            <span>Setting Account</span>
          </Breadcrumb.Item>
        </Breadcrumb>

      </section>

      <section className="dashboard-main">
        <div className="search-bar">
          <Button type="ghost"
            onClick={() => {
              setVisible(true)
            }}
          >Đổi mật khẩu</Button>
        </div>
        <div className="container-flex justify">

          <FormProvider {...methods}>
            <Form
              {...layout}
              form={form}
              onFinish={
                handleSubmit
              }
            >
              <Title level={4}>Thông tin cá nhân</Title>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
              >
                <Input disabled />
              </Form.Item>


              <Form.Item
                label="Giới tính"
                name="gender"
              >
                <Select>
                  <Select.Option value={1}>Male</Select.Option>
                  <Select.Option value={2}>Female</Select.Option>
                  <Select.Option value={3}>Other</Select.Option>
                </Select>
              </Form.Item>


              <Form.Item
                label="Ngày sinh"
                name="birthday"
              >
                <DatePicker name="birthday" format={dateFormat} />

              </Form.Item>


              <Form.Item
                label="Chiều cao"
                name="height"
              >
                <Input placeholder="cm" name="height" type='number' />
              </Form.Item>


              <Form.Item
                label="Cân nặng"
                name="weight"
              >
                <Input placeholder="kg" name="weight" type='number' />
              </Form.Item>

              <Form.Item className='modal-footer'>
                <Button type="primary" htmlType="submit"
                >
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </FormProvider>

          <div style={{ marginRight: " 5rem", textAlign: "center" }}>

            <Image src={avatar}
              preview={false}
              alt="User Avatar"
              className="custom-avt"
            />
            <div style={{ fontSize: "1.5rem", marginTop: "4rem" }}>
              <label style={{ border: "solid 1px gray", padding: "1rem", cursor: "pointer", borderRadius: "3px" }}>

                <input type="file" style={{ display: "none" }} onChange={handleChangeImage} accept="image/*" />
                <span>
                  <UploadOutlined />
                  &nbsp;   Upload
                </span>
              </label>
              {
                file ?
                  <Button
                    type="primary"
                    style={{ marginLeft: "1rem", height: "4rem", width: "8rem" }}
                    onClick={handleChangeAvatar}
                  >
                    Lưu
                  </Button> : ""
              }
            </div>
          </div>
        </div>
      </section>

      <Modal
        title="Đổi mật khẩu"
        visible={visible}
        onCancel={onCancel}
        footer={null}
        destroyOnClose={true}
      >
        <FormProvider {...methods}>
          <Form {...modalLayout}
            onFinish={
              handleChangePass
            }
          >
            <Form.Item
              label="Mật khẩu"
              name="oldPassword"
              rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
            >
              <Input name="oldPassword" type="password" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
            >
              <Input name="newPassword" type="password" />
            </Form.Item>

            <Form.Item
              label="Nhập lại"
              name="return"
              rules={[{ required: true, message: 'Vui lòng nhập giá trị' },]}
            >
              <Input name="return" type="password" />
            </Form.Item>
            <Form.Item className='modal-footer'>
              <Button type="primary" htmlType="submit"
                loading={loading}
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

export default SettingPage