import React from 'react';
import DashboardLayout from 'components/DashboardLayout/DashboardLayout';
import { gql, useQuery } from '@apollo/client';
import NutritionFact from "components/NutritionFact/NutritionFact"
import { Breadcrumb, Table, Image, Spin, Empty, Button, Modal, Tag, Form, Select, Switch, message, Popconfirm, Card, Col, Row } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { COUNT_FOOD, COUNT_NEWFOOD, COUNT_NEWUSER, COUNT_USER } from 'graphql/Admin/AdminQueries';

const AdminDashBoard = ({ collapse, setCollapse }) => {
  const { data: totalFood } = useQuery(COUNT_FOOD)
  const { data: totalUser } = useQuery(COUNT_USER)
  const { data: newFood } = useQuery(COUNT_NEWFOOD)
  const { data: newUser } = useQuery(COUNT_NEWUSER)


  return (
    <DashboardLayout collapse={collapse} setCollapse={setCollapse}>
      <section className='dashboard-header'>
        <Breadcrumb className='dashboard-header__breadcum'>
          <Breadcrumb.Item href='/admin'>
            <DashboardOutlined />
            <span>Home</span>
          </Breadcrumb.Item>
        </Breadcrumb>

      </section>

      <section className="dashboard-main">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={6}>
            <Card
            // style={{ width: 250 }}
            >
              <div className="card_title">
                <span>Người dùng</span>
              </div>
              <div className='card-total'>
                <span>{totalUser?.countUser}</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
            // style={{ width: 250 }}
            >
              <div className="card_title">
                <span>Người dùng mới</span>
              </div>
              <div className='card-total'>
                <span>{newUser?.countNewUser}</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
            // style={{ width: 250 }}
            >
              <div className="card_title">
                <span>Thức ăn</span>
              </div>
              <div className='card-total'>
                <span>{totalFood?.countFood}</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
            // style={{ width: 250 }}
            >
              <div className="card_title">
                <span>Thức ăn mới</span>
              </div>
              <div className='card-total'>
                <span>{newFood?.countNewFood}</span>
              </div>
            </Card>
          </Col>
        </Row>
      </section>
    </DashboardLayout>
  )
}

export default AdminDashBoard