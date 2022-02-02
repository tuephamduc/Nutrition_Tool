import React from 'react';
import { gql, useMutation } from '@apollo/client';
import AuthLayout from 'components/AuthLayout/AuthLayout';
import { FormProvider, useForm } from "react-hook-form";
import { Form, Input, Button, notification } from "antd";
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { SIGNUPUSER } from 'graphql/Auth/Auth';

const Register = () => {
  const methods = useForm();
  const history = useHistory()
  const [signupUser, { data, loading, error }] = useMutation(SIGNUPUSER, {
    onCompleted(data) {
      notification.success({
        message: "Vui lòng kiểm tra email để xác nhận đăng ký thành công",
      })
      history.push(`/login`)
    },
    onError(error) {
      notification.error({
        message: "Có lỗi xảy ra. Vui lòng kiểm tra lại",
        description: error.message
      })
    }
  })

  const onSubmit = (data) => {
    const regisData = {
      ...data,
      roles: "USER"
    }
    signupUser({
      variables: regisData
    })
  }


  const layout = {
    labelCol: { span: 4 },
  }
  return (
    <AuthLayout>
      <div className="grid__logo">
        <div className="title">
          Đăng Ký Thành Viên
        </div>
      </div>
      <FormProvider {...methods}>
        <Form {...layout}
          layout='vertical'
          onFinish={onSubmit}
        >
          <Form.Item
            label="Tên"
            name="username"
            className='login-form-group'
            rules={[
              { required: true, message: 'Vui lòng nhập username' }
            ]}
          >
            <Input className="login-form-control" name="username"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            className='login-form-group'
            rules={[
              { required: true, message: 'Vui lòng nhập email' }
            ]}
          >
            <Input className="login-form-control" name="email"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            className='login-form-group'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' }
            ]}
          >
            <Input.Password className="login-form-control" name="password"
            />
          </Form.Item>

          <Form.Item className='login-form-group'>
            <Button type="primary" htmlType="submit" className="submit-button"
              loading={loading}
            >
              Đăng ký
            </Button>
            <div className='login-footer'>
              <div>
                <span>Bạn đã là thành viên?   </span>
                <Link to="/login">Đăng nhập</Link>
              </div>
              <div>
                <Link to="/">Quay lại trang chủ</Link>
              </div>
            </div>
          </Form.Item>
        </Form>
      </FormProvider>
    </AuthLayout>
  )
}
export default Register