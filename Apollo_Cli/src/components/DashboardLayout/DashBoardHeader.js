import React from 'react';
import { Badge, Menu, Dropdown, Avatar, Tabs, List } from 'antd'
import {
  BellOutlined, LogoutOutlined, SettingOutlined
} from '@ant-design/icons';
import useUserInfo from 'hooks/UserInfo/useUserInfo';
import dotenv from 'dotenv'
import useAuth from "hooks/Auth/useAuth";
import { useHistory } from 'react-router-dom';
dotenv.config();

const { TabPane } = Tabs;


const Notify = (
  <>

    <Tabs className="tab-content">
      <TabPane tab="Notice" key="1">
        <List
          itemLayout="horizontal">

        </List>
      </TabPane>
    </Tabs>
  </>
)


const DashHeader = () => {
  const userInfo = useUserInfo()
  const avatar = userInfo && userInfo?.userInfo?.avatar
  const src = avatar && `${process.env.REACT_APP_SERVER}${avatar}`

  const auth = useAuth()
  const roles = auth.user.roles

  const history = useHistory()
  const handleAccountSetting = () => {

    if (roles === "ADMIN") {
      history.push("/admin/account-setting")
    }
    if (roles === "USER") {
      history.push("/user/account-setting")
    }

    if (roles === "EXPERT") {
      history.push("/expert/account-setting")
    }
  }



  const AccountSetting = (
    <>
      <Menu>
        <Menu.Item icon={<SettingOutlined />} onClick={(e) => {
          handleAccountSetting()
        }}>
          Account Setting
        </Menu.Item>

        <Menu.Item icon={<LogoutOutlined />} onClick={
          () => {
            auth.logout();
            history.push("/login")
          }
        }>
          Log out
        </Menu.Item>
      </Menu>
    </>
  )


  return (
    <>
      <div className="header-item">
        <Dropdown trigger={['hover']} overlay={AccountSetting} placement="bottomCenter">
          <div className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <Avatar src={src} style={{ marginRight: "1rem" }} />
            Account Setting
          </div>
        </Dropdown>
      </div>
      {/* <div className="header-item">
        <Dropdown trigger={['click']} overlay={Notify} placement="bottomCenter">
          <BellOutlined />
        </Dropdown>
      </div> */}
    </>
  )
}
export default DashHeader;