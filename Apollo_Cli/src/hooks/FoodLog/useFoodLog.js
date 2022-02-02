import { useContext } from "react";
import { FoodLogContext } from "features/context/foodLogContext";

const useFoodLog = () => {
  return useContext(FoodLogContext)
}

export default useFoodLog