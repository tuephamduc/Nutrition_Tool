import React, { useState, useEffect } from 'react';
import AuthLayout from 'components/AuthLayout/AuthLayout';
import { useParams, useHistory } from "react-router-dom";
import { ACTIVE_ACC } from 'graphql/Auth/Auth';
import { gql, useMutation } from '@apollo/client';
import { Result } from "antd";
import LinkButton from 'components/LinkButton/LinkButton';

const ActiveAcc = () => {
  const { slug } = useParams();
  const [status, setStatus] = useState();
  const [activeEmail, { data, error }] = useMutation(ACTIVE_ACC,
    {
      onCompleted({ activeEmail }) {
        setStatus(activeEmail)
      },
      onError(error) {
        setStatus(false)
      }
    }
  )
  useEffect(() => {
    activeEmail({
      variables: {
        token: slug
      }
    })
  }, [slug, activeEmail]);

  return (
    <AuthLayout>
      {status ?
        <Result
          status="success"
          title="Kích hoạt tài khoản thành công"
          subTitle="Vui lòng đăng nhập để sử dụng dịch vụ"
          extra={
            [
              <LinkButton to="/login" className="active-button">Đăng nhập ngay</LinkButton>
            ]
          }
        />
        :
        <Result
          status="error"
          title="Kích hoạt tài khoản thất bại"
          subTitle="Link kích hoạt đã hết hạn, vui lòng thử lại sau"
          extra={[
            <LinkButton to="/" className="active-button">Trở lại trang chủ</LinkButton>
          ]}
        />
      }
    </AuthLayout>
  )
}

export default ActiveAcc;