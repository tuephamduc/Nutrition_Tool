import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { menuRoute } from 'components/DashboardLayout/MenuRoute';
import { Helmet } from "react-helmet-async";
import { Logo } from 'constants/Images/Images';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import DashHeader from 'components/DashboardLayout/DashBoardHeader';
import useAuth from "hooks/Auth/useAuth";


const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;



const DashboardLayout = ({ children, description, title, collapse, setCollapse }) => {
  const auth = useAuth()
  const roles = auth?.user?.roles
  const location = useLocation()
  const history = useHistory()
  const onCollapse = () => {
    setCollapse(!collapse)
  }

  const onSelect = ({ item, key, selectedKeys }) => {

  }


  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Logo and Menu dashboard */}
      <Layout style={{ height: "100vh" }}>
        <div className={`sidebar-wrapper ${collapse ? `collapse` : ""}`}>
          <Sider
            trigger={null}
            className="sidebar"
            collapsible
            collapsed={collapse}
            width={200}
          >
            <div className="logo"
              onClick={(e) => {
                e.stopPropagation()
                history.push("/")
              }
              }>
              {/* <img src={Logo} alt="Logo" className="logo__image" /> */}
              <h2 className={`logo__name ${collapse ? `hidden` : ""}`}> Dashboard</h2>
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={[location.pathname]}
              onSelect={onSelect}
              style={{ paddingTop: "3rem" }}
            >
              {menuRoute[roles].map(item => (
                <Menu.Item key={item.id} icon={item.icon} >
                  <Link to={item.to}>
                    {item.label}
                  </Link>
                </Menu.Item>
              ))
              }
            </Menu>
            <div className="sidebar__footer">
              {
                collapse ? <MenuFoldOutlined onClick={onCollapse} className='trigger' /> : <MenuUnfoldOutlined onClick={onCollapse} className='trigger' />
              }
            </div>
          </Sider>
        </div>

        {/*Header and Content*/}
        <Layout >
          <Header className={`header-content ${collapse ? `collapsed` : ""}`}>
            <DashHeader />
          </Header>
          <Content>
            <div className="container">
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>,
    </>
  )
}



export default DashboardLayout