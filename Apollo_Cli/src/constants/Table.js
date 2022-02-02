import { Table, Tag, Space } from 'antd';

export const UserColumn = [
  {
    title: "Username",
    key: "username",
    dataIndex: 'username',
    width: '20%',
  },
  {
    title: "Email",
    key: "email",
    dataIndex: 'email',
    width: '30%',
  },
  {
    title: "Role",
    key: "roles",
    dataIndex: 'roles',
    width: '15%',
  },
  {
    title: "Active",
    key: "active",
    dataIndex: 'active',
    render: active => {
      return (<Tag color={active ? "green" : "volcano"} key={active}>{active ? "Active" : "Deactivating"}</Tag>)
    }
  },
  {
    title: "Action",
    key: "id",
    dataIndex: "id",
    render: id => {
      return (<a>Edit</a>)
    }
  }
]

export const FoodGroupColumn = [
  {
    title: "STT",
    key: "stt",
    dataIndex: 'stt',
    width: '15%',
  },
  {
    title: "GroupName",
    key: "groupName",
    dataIndex: 'groupName',
    width: '35%',
  },
  {
    title: "Action",
    key: "action"
  }
]

export const NutrientsColumn = [
  {
    title: "STT",
    key: "stt",
    dataIndex: 'stt',
    width: '15%',
  },
  {
    title: "Nutrient",
    key: "nutrient",
    dataIndex: 'nutrient',
    width: '20%',
  },
  {
    title: "Unit",
    key: "unit",
    dataIndex: 'unit',
    width: '15%',
  },
  {
    title: "Tag Name",
    key: "tagname",
    dataIndex: 'tagname',
    width: '25%',
  },
  {
    title: "Action",
    key: "action",
    width: '25%',
  }
]