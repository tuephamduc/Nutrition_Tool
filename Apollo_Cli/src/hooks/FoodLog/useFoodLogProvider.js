import { useEffect, useState } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { message } from "antd";
import useAuth from "hooks/Auth/useAuth";
import { GET_FOOD_LOG } from "graphql/User/UserQuery";
import { ADD_FOOD_LOG, DELETE_FOOD_LOG, EDIT_FOOD_LOG } from "graphql/User/UserMutation";


const useFoodLogProvider = () => {
  const auth = useAuth();
  const [foodLog, setFoodLog] = useState();
  const [getFoodsLog, { data: foodLogData }] = useLazyQuery(GET_FOOD_LOG, {
    onError(err) {
      message.error(err.message)
    }
  })
  const [addFoodLog, { loading: addLoaing }] = useMutation(ADD_FOOD_LOG, {
    onCompleted({ addFoodLog }) {
      setFoodLog([...foodLog, ...addFoodLog])
      message.success("Thêm thành công!!!")
    },
    onError(err) {
      message.error(err.message)
    }
  })

  const [editFoodLog, { loading: editLoading }] = useMutation(EDIT_FOOD_LOG, {
    onCompleted({ editFoodLog }) {
      const filterList = foodLog.filter(item => item.id !== editFoodLog.id)
      setFoodLog([...filterList, editFoodLog])
      message.success("Sửa thành công!!!")
    },
    onError(err) {
      message.error(err.message)
    }
  })

  const [deleteFoodLog, { loading: deleteLoading }] = useMutation(DELETE_FOOD_LOG, {
    onCompleted({ deleteFoodLog }) {
      const filterList = foodLog.filter(item => item.id !== deleteFoodLog)
      setFoodLog(filterList)
      message.success("Xoá thành công!!!")
    },
    onError(err) {
      message.error(err.message)
    }
  })

  useEffect(() => {
    if (auth && auth?.user?.roles === "USER") {
      getFoodsLog()
    };
    if (auth && foodLogData) {
      setFoodLog(foodLogData.getFoodsLog)
    }
  }, [auth, foodLogData, getFoodsLog]);





  return {
    foodLog,
    addFoodLog,
    addLoaing,
    editFoodLog,
    editLoading,
    deleteFoodLog,
    deleteLoading,
  }

}
export default useFoodLogProvider