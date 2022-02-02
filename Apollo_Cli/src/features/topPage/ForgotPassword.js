import React from 'react';
import { gql, useMutation } from '@apollo/client';
import AuthLayout from 'components/AuthLayout/AuthLayout';
import { FormProvider, useForm } from "react-hook-form";
import { Form, Input, Button, notification } from "antd";
import { Link } from 'react-router-dom';
import { Forgot } from 'constants/Images/Images';
import { SEND_FORGOT } from 'graphql/Auth/Auth';

const ForgotPassword = () => {
  const methods = useForm();
  const [sendMailForgotPassword, { loading }] = useMutation(SEND_FORGOT, {
    onCompleted({ sendMailForgotPassword }) {
      notification.success({
        message: "Link đặt lại mật khẩu đã được gửi vào email của bạn. Vui lòng kiểm tra email",
      })
    },
    onError(error) {
      notification.error({
        message: "Có lỗi xảy ra !!! Vui lòng kiểm tra lại",
        description: error.message
      })
    }
  })

  const onSubmit = (data) => {
    sendMailForgotPassword({
      variables: data
    })
  }
  return (
    <AuthLayout>
      <div>
        <img src={Forgot} alt="Forgot Password" className="logo-forgot" />
      </div>
      <FormProvider {...methods}>
        <Form
          layout='vertical'
          onFinish={onSubmit}
        >
          <div className="text-forgot">Vui lòng nhập email đăng ký tài khoản. Chúng tôi sẽ gửi link đặt lại mật khẩu vào email của bạn</div>
          <Form.Item
            label="Email"
            name="email"
            className='login-form-group'
            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
          >
            <Input className="login-form-control" name="email"
            />
          </Form.Item>

          <Form.Item className='login-form-group'>
            <Button type="primary" htmlType="submit" className="submit-button"
              loading={loading}
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </FormProvider>
    </AuthLayout>
  )
}

export default ForgotPassword