import React, { useState, useEffect } from "react";
import { PlusCircleOutlined } from '@ant-design/icons'
import { Avatar, Modal, Typography, Radio, Input, Button, DatePicker } from "antd"
import { Logo } from "constants/Images/Images"
import useFoodLog from "hooks/FoodLog/useFoodLog";
import { useParams } from "react-router";
import moment from "moment";
import dotenv from 'dotenv'
import EditLogModal from "./EditModal";
import AddLogModal from "./AddModal";
const server = process.env.REACT_APP_SERVER

dotenv.config();


const { Title } = Typography
const { Search } = Input
const TrackingList = () => {
  const { slug } = useParams()
  const { foodLog } = useFoodLog();
  const [foodData, setfoodData] = useState();
  const [visible, setVisible] = useState({
    modalAdd: false,
    modalEdit: false
  });
  const [editData, seteditData] = useState();
  const [addData, setAddData] = useState();

  useEffect(() => {
    const day = slug ? slug : moment().format('YYYY-MM-DD')

    if (foodLog) {
      const food = foodLog.filter(item => moment(item.date).format('YYYY-MM-DD') === day)
      setfoodData(food)
    }
    setAddData({
      date: moment(day),
      meal: "BREAK"
    })
  }, [foodLog, slug]);

  const setModalAddvisible = (value) => {
    setVisible({ ...visible, modalAdd: value })
  }
  const setModalEditvisible = (value) => {
    setVisible({ ...visible, modalEdit: value })
  }

  const Content = (key) => {
    const data = foodData && foodData.filter(item => item.meal === key)

    const render = data && data.map(item => {
      return (
        <li
          key={item.id}
          className="list-group__item" onClick={() => {
            setModalEditvisible(true)
            seteditData(item)
          }
          }>
          <span className="badge-calorie">{item.weight * item.food.basicNutrients.Calories / item.food.serving_weight_grams}</span>
          <Avatar
            className="item-image"
            src={`${server}${item.food.image}`}
          />
          <span className="item-name">{item.food.name}</span>
          <span className="item-serving">{item.weight} g</span>

        </li>
      )
    })
    return render

  }

  return (
    <React.Fragment>
      <div style={{ padding: "0 1rem", textAlign: "right" }}>
        <Button type="primary"
          onClick={() => { setModalAddvisible(true) }}
        >
          <PlusCircleOutlined />
          Thêm vào FoodLog</Button>
      </div>
      <div className="panel">
        <ul className="track-list">
          <li className="list-group" key="BREAK">
            <label className="list-group__item divider">
              Bữa sáng
              <PlusCircleOutlined
                style={{ marginLeft: "2rem" }}
                onClick={() => {
                  setModalAddvisible(true)
                  setAddData(prevState => {
                    return ({
                      ...prevState,
                      meal: "BREAK"
                    })
                  })
                }}
              />
            </label>
            <ul>
              {Content("BREAK")}
            </ul>
          </li>
          <li className="list-group" key="LUNCH">
            <label className="list-group__item divider">
              Bữa trưa
              <PlusCircleOutlined style={{ marginLeft: "2rem" }}
                onClick={() => {
                  setModalAddvisible(true)
                  setAddData(prevState => {
                    return ({
                      ...prevState,
                      meal: "LUNCH"
                    })
                  })
                }}
              />
            </label>
            <ul>
              {Content("LUNCH")}
            </ul>
          </li>
          <li className="list-group" key="DINNER">
            <label className="list-group__item divider">
              Bữa tối
              <PlusCircleOutlined style={{ marginLeft: "2rem" }}
                onClick={() => {
                  setModalAddvisible(true)
                  setAddData(prevState => {
                    return ({
                      ...prevState,
                      meal: "DINNER"
                    })
                  })
                }}

              />
            </label>
            <ul>
              {Content("DINNER")}
            </ul>
          </li>

          <li className="list-group" key="SNACK">
            <label className="list-group__item divider">
              SNACK
              <PlusCircleOutlined style={{ marginLeft: "2rem" }}
                onClick={() => {
                  setModalAddvisible(true)
                  setAddData(prevState => {
                    return ({
                      ...prevState,
                      meal: "SNACK"
                    })
                  })
                }}

              />
            </label>
            <ul>
              {Content("SNACK")}
            </ul>
          </li>
        </ul>

        {
          visible.modalAdd ?
            <AddLogModal
              visible={visible.modalAdd}
              setVisible={setModalAddvisible}
              data={addData}
            />
            : ""
        }

        {visible.modalEdit ?
          <EditLogModal visible={visible.modalEdit} setVisible={setModalEditvisible} data={editData} />
          : ""
        }
      </div>
    </React.Fragment>
  )
}

export default TrackingList