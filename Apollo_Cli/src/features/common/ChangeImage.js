import dotenv from 'dotenv'
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { Image, Button, message } from "antd";
import { EDIT_FOOD_IMAGE } from 'graphql/Basic/BasicMutation';
import { UploadOutlined } from '@ant-design/icons'

const server = process.env.REACT_APP_SERVER

dotenv.config();

const ChangeImage = ({ image, id }) => {

  const [avatar, setAvatar] = useState();
  const [file, setFile] = useState();

  useEffect(() => {
    if (image) setAvatar(`${server}${image}`)
  }, [image]);

  const [changeImageFood, { loading }] = useMutation(EDIT_FOOD_IMAGE, {
    onCompleted({ changeImageFood }) {
      setAvatar(`${server}${changeImageFood.url}`)
      message.success("Thay đổi thành công")
    },
    onError(err) {
      message.error(err.message)
    }
  })

  const onChangeFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    var url = reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      setAvatar(reader.result)
    }
    setFile(file)
  }

  const onSubmit = () => {
    changeImageFood({
      variables: {
        file: file,
        foodId: id
      }
    })
    setFile()
  }
  return (
    <div>
      <Image src={avatar}
        preview={false}
        alt="FoodImage"
        className='food-image-change'
      />
      <div style={{ fontSize: "1.5rem", marginTop: "4rem" }}>
        <label style={{ border: "solid 1px gray", padding: "1rem", cursor: "pointer", borderRadius: "3px" }}>
          <input type="file" style={{ display: "none" }} onChange={onChangeFile} accept="image/*" />
          <span>
            <UploadOutlined />
            &nbsp;   Upload
          </span>
        </label>

        <Button
          type="primary"
          style={{ marginLeft: "1rem", height: "4rem", width: "8rem" }}
          onClick={onSubmit}
          disabled={file ? false : true}
        >
          Lưu
        </Button>
      </div>
    </div>
  )
}

export default ChangeImage