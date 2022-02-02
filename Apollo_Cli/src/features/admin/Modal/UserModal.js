import React, { useEffect, useState } from 'react'
import { Form, Input, Switch, message, Modal } from "antd";
import { FormProvider, useForm } from "react-hook-form";

const UserModal = (props) => {
  const methods = useForm();
  const { modalType, setIsModalVisible, isModalVisible, record, setDataEdit } = props

  const title = (modalType === 1) ? "Create User" : "Edit User"
  const handleCancel = () => {
    setIsModalVisible(false);
    // setDataEdit("")
  };
  const layout = {
    labelCol: { span: 4 },
  }


  return (
    <Modal title={title} visible={isModalVisible} onCancel={handleCancel}>
      <FormProvider {...methods}>
        <Form {...layout}
          initialValues={record}
        >
          <Form.Item
            label="Email"
            name="email"
          // initialValue={record && record.email}
          >
            <Input name="email" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
          >
            <Input name="username" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="roles"
          >
            <Input name="email" />
          </Form.Item>

          <Form.Item
            label="Active"
            name="active"
          >
            <Switch />
          </Form.Item>
        </Form>
      </FormProvider>
    </Modal>
  )
}

export default UserModal