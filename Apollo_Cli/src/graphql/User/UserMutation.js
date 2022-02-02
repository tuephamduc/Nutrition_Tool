import { gql } from "@apollo/client"

export const ADD_FOOD_LOG = gql`
mutation addFoodLog($input:[TrackingInput]){
  addFoodLog(input:$input){
    id
    foodId
    meal
    date
    weight
    food {
    serving_weight_grams
    name
    image
      basicNutrients{
      serving_unit
      serving_weight_grams
      Calories
      Fat
      TransFat
      SaturatedFat
      Protein
      Cholesterol
      Sodium
      Potassium
      Carbohydrates
      DiateryFiber
      Sugars
      VitaminA
      VitaminC
      Calcium
      Iron
      }
    }
  }
}
`

export const EDIT_FOOD_LOG = gql`
mutation editFoodLog($input: TrackingInput, $id:ID){
  editFoodLog(input:$input, id:$id){
    id
    foodId
    meal
    date
    weight
    food {
    serving_weight_grams
    name
    image
      basicNutrients{
      serving_unit
      serving_weight_grams
      Calories
      Fat
      TransFat
      SaturatedFat
      Protein
      Cholesterol
      Sodium
      Potassium
      Carbohydrates
      DiateryFiber
      Sugars
      VitaminA
      VitaminC
      Calcium
      Iron
      }
    }
  }
}
`

export const DELETE_FOOD_LOG = gql`
mutation deleteFoodLog($id:ID){
  deleteFoodLog(id:$id)
}
`
//Tracking