import React, { useState, useEffect } from "react"
import { Avatar, Modal, Typography, Radio, Input, Button, DatePicker, Collapse } from "antd";
import moment from "moment";
import dotenv from 'dotenv'
import NutritionFact from "components/NutritionFact/NutritionFact";
import useFoodLog from "hooks/FoodLog/useFoodLog";
const server = process.env.REACT_APP_SERVER

dotenv.config();
const { Title } = Typography
const { Panel } = Collapse;
const CalculateNFByValue = (weight, food) => {
  const listAttr = [
    'Calories',
    'Fat',
    'TransFat',
    'SaturatedFat',
    'Protein',
    'Cholesterol',
    'Sodium',
    'Potassium',
    'Carbohydrates',
    'DiateryFiber',
    'Sugars',
    'VitaminA',
    'VitaminC',
    'Calcium',
    'Iron',
  ]
  let result = {}
  result['serving_weight_grams'] = weight
  listAttr.forEach(attr => {
    result[attr] = food?.basicNutrients[attr] * weight / food?.serving_weight_grams
  })
  return result
}

const EditLogModal = ({ visible, setVisible, data }) => {
  const {
    editFoodLog,
    editLoading,
    deleteFoodLog,
    deleteLoading } = useFoodLog();
  const [logInput, setlogInput] = useState();

  useEffect(() => {
    if (data) {
      setlogInput({
        id: data.id,
        foodId: data.foodId,
        meal: data.meal,
        date: data.date,
        weight: data.weight
      })
    }

    // return () => {
    //   setlogInput("")
    // }
  }, [data]);

  const onWeightChange = (e) => {
    setlogInput(prevState => {
      return ({
        ...prevState,
        weight: parseFloat(e.target.value)
      })
    })
  }
  const onDateChange = (value) => {
    setlogInput(prevState => {
      return ({
        ...prevState,
        date: value
      })
    })
  }

  const onMealChange = (e) => {
    setlogInput(prevState => {
      return ({
        ...prevState,
        meal: e.target.value
      })
    })
  }

  const nutritionFact = logInput && logInput?.weight ? CalculateNFByValue(logInput?.weight, data?.food) : CalculateNFByValue(0, data?.food)

  const onEditFoodLog = () => {
    editFoodLog({
      variables: {
        input: {
          foodId: logInput.foodId,
          meal: logInput.meal,
          date: logInput.date,
          weight: logInput.weight
        },
        id: logInput.id
      }
    })
    setVisible(false)
  }

  const onDeleteFoodLog = () => {
    deleteFoodLog({
      variables: {
        id: logInput.id
      }
    })
    setVisible(false)
  }

  return (
    <Modal
      title="Sửa Food Log"
      visible={visible}
      onCancel={() => {
        setVisible(false)
        Modal.destroyAll()
      }}
      destroyOnClose
      footer={[
        <>
          <Button
            type="primary"
            danger
            loading={deleteLoading}
            onClick={onDeleteFoodLog}
          >
            Xoá
          </Button>
          <Button
            type="primary"
            loading={editLoading}
            onClick={onEditFoodLog}
          >Lưu</Button>
        </>

      ]}
    >
      <div className="track-modal-item none-border">
        <Avatar
          className="item-image"
          src={`${server}${data?.food?.image}`}
        />
        <span className="item-name">{data?.food?.name}</span>
        <Input className="flog-weight"
          defaultValue={data?.weight}
          onChange={onWeightChange}
        />
        <span style={{ marginLeft: "5px" }}>(gram)</span>
      </div>
      <div className="track-modal-item">
        <Title level={5}>Bữa ăn</Title>
        <Radio.Group defaultValue={data?.meal} onChange={onMealChange}>
          <Radio.Button key="BREAK" value="BREAK">Sáng</Radio.Button>
          <Radio.Button key="LUNCH" value="LUNCH">Trưa</Radio.Button>
          <Radio.Button key="DINNER" value="DINNER">Chiều</Radio.Button>
          <Radio.Button key="SNACK" value="SNACK">Ăn vặt</Radio.Button>
        </Radio.Group>
      </div>
      <div className="track-modal-item">
        <Title level={5}>Ngày</Title>
        <DatePicker inputReadOnly={true}
          defaultValue={moment(data?.date)}
          onChange={onDateChange}
        />
      </div>
      <div className="track-modal-item">
        <Collapse className="collapse-track">
          <Panel
            header={<Title level={5}>Nhãn dinh dưỡng</Title>}
            className="panel-track"
          >
            <NutritionFact nutrientData={nutritionFact} />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  )

}

export default EditLogModal