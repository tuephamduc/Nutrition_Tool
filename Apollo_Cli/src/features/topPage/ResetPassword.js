import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import AuthLayout from 'components/AuthLayout/AuthLayout';
import { FormProvider, useForm } from "react-hook-form";
import { Form, Input, Button, notification, message } from "antd";
import { Link } from 'react-router-dom';
import { RESET_PASS, LINK_RESET } from 'graphql/Auth/Auth';
import { Result } from "antd";
import { useParams, useHistory } from "react-router-dom";
import LinkButton from 'components/LinkButton/LinkButton';
import { Forgot } from 'constants/Images/Images';

const ResetPassword = () => {
  const [status, setStatus] = useState();
  const { slug } = useParams();
  const methods = useForm;
  const history = useHistory()

  const [linkReset] = useMutation(LINK_RESET, {
    onCompleted({ linkReset }) {
      setStatus(linkReset)
    },
    onError(error) {
      setStatus(false)
    }
  })
  useEffect(() => {
    linkReset({
      variables: {
        token: slug
      }
    })
  }, [slug, linkReset]);

  const [forgotPassword, { loading }] = useMutation(RESET_PASS,
    {
      onCompleted({ forgotPassword }) {
        notification.success({
          message: "Đổi mật khẩu thành công",
        });
        history.push(`/login`);
      },
      onError(error) {
        notification.error({
          message: "Có lỗi xảy ra !!!",
          description: error.message
        })
      }
    })
  const onSubmit = (data) => {
    if (data.password !== data.repassword) {
      message.error("Nhập lại mật khẩu trùng nhau!!")
    }
    else {
      forgotPassword({
        variables: {
          newPassword: data.password,
          token: slug
        }
      })
    }
  }
  return (
    <AuthLayout>
      {
        status ?
          <React.Fragment>
            <div>
              <img src={Forgot} alt="Forgot Password" className="logo-forgot" />
            </div>
            <FormProvider {...methods}>
              <Form
                layout='vertical'
                onFinish={onSubmit}
              >
                <div className="text-forgot">Đặt lại mật khẩu</div>
                <Form.Item
                  label="Mật khẩu mới"
                  name="password"
                  className='login-form-group'
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
                >
                  <Input className="login-form-control" name="password"
                  />
                </Form.Item>
                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="repassword"
                  className='login-form-group'
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
                >
                  <Input className="login-form-control" name="repassword"
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
          </React.Fragment>
          : <Result
            status="error"
            title="Reset mật khẩu thất bại"
            subTitle="Link của bạn đã hết hạn hoặc không đúng, vui lòng thử lại sau"
            extra={[
              <LinkButton to="/" className="active-button">Trở lại trang chủ</LinkButton>
            ]}
          />
      }
    </AuthLayout>
  )
}

export default ResetPassword