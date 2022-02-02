import { UserOutlined, LogoutOutlined, SettingOutlined, CustomerServiceFilled, AndroidOutlined, DashboardOutlined } from '@ant-design/icons';

import moment from 'moment';
const currentDate = moment().format('YYYY-MM-DD')

export const menuRoute = {
  // Role s 0 :admin 1:company
  "ADMIN": [
    {
      id: "/admin",
      label: "Dashboard",
      to: "/admin",
      icon: <DashboardOutlined />
    },
    {
      id: "/admin/users",
      label: "Người dùng",
      to: "/admin/users",
      icon: <UserOutlined />
    },
    {
      id: "/admin/foods",
      label: "Thực phẩm",
      to: "/admin/foods",
      icon: <CustomerServiceFilled />
    },
    {
      id: "/admin/food-groups",
      label: "Nhóm thực phẩm",
      to: "/admin/food-groups",
      icon: <AndroidOutlined />
    },
    {
      id: "/admin/nutrients",
      label: "Chất dinh dưỡng",
      to: "/admin/nutrients",
      icon: <AndroidOutlined />
    },
    {
      id: "/admin/account-setting",
      label: "Thông tin cá nhân ",
      to: "/admin/account-setting",
      icon: <SettingOutlined />
    }

  ],
  "USER": [
    {
      id: "/user/my-food",
      label: "Thực phẩm",
      to: "/user/my-food",
      icon: <UserOutlined />
    },
    {
      id: `/user/${currentDate}`,
      label: "Food Log",
      to: `/user/${currentDate}`,
      icon: <UserOutlined />
    },


    {
      id: "/user/account-setting",
      label: "Thông tin cá nhân ",
      to: "/user/account-setting",
      icon: <SettingOutlined />
    }
  ],
  "EXPERT": [
    {
      id: "/expert/foods",
      label: "Thực phẩm",
      to: "/expert/foods",
      icon: <UserOutlined />
    },
    {
      id: "/expert/account-setting",
      label: "Thông tin cá nhân ",
      to: "/expert/account-setting",
      icon: <SettingOutlined />
    }
  ]
}