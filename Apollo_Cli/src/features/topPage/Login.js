import React from 'react';
import { gql, useMutation } from '@apollo/client';
import AuthLayout from 'components/AuthLayout/AuthLayout';
import { FormProvider, useForm } from "react-hook-form";
import { Form, Input, Button, message, notification } from "antd";
import { Link } from 'react-router-dom';
import { LOGIN } from 'graphql/Auth/Auth';
import useAuth from "hooks/Auth/useAuth"
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';


const LoginPage = ({ roles }) => {
  const methods = useForm();
  const history = useHistory()
  const auth = useAuth()

  const [login, { data, loading, error }] = useMutation(LOGIN, {
    onCompleted({ login }) {
      auth.handleLoginSuccess(login)
      if (login.user.roles === "USER") {
        history.push(`/user/my-food`)
      }
      if (login.user.roles === "ADMIN") {
        history.push(`/admin`)
      }
      if (login.user.roles === "EXPERT") {
        history.push(`/expert/foods`)
      }
    },
    onError(error) {
      notification.error({
        message: "Có lỗi xảy ra !!!",
        description: error.message
      })
    }
  })

  const layout = {
    labelCol: { span: 4 },
  }

  const onSubmit = (data) => {
    const loginData = {
      ...data,
      roles: roles
    }
    login({
      variables: loginData
    },
    )
  }

  return (
    <AuthLayout>
      <div className="grid__logo">
        <div className="title">
          Đăng nhập để tiếp tục
        </div>
      </div>
      <FormProvider {...methods}>
        <Form {...layout}
          layout='vertical'
          onFinish={onSubmit}
        >
          <Form.Item
            label="Email"
            name="email"
            className='login-form-group'
            rules={[{ required: true, message: 'Vui lòng nhập email' },
              // { pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, message: 'Email không đúng format' },
            ]}
          >
            <Input className="login-form-control" name="email"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            className='login-form-group'
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password className="login-form-control" name="password" />
          </Form.Item>
          <div className="login-link">
            <Link to="/forgot">Quên Mật Khẩu?</Link>
          </div>
          <Form.Item className='login-form-group'>
            <Button type="primary" htmlType="submit" className="submit-button"
              loading={loading}
            >
              {loading ? `Đang đăng nhập...` : `Đăng nhập`}
            </Button>
            <div className='login-footer'>
              <div>
                <span>Chưa có tài khoản? </span>
                <Link to="/register">Đăng ký ngay !</Link>
              </div>
              <div>
                <Link to="/">Quay lại trang chủ</Link>
              </div>
            </div>
          </Form.Item>
        </Form>
      </FormProvider>
    </AuthLayout >
  )
}

export default LoginPage