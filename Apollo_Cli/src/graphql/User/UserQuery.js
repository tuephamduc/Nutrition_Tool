import { gql } from "@apollo/client"

export const GET_USER_INFO = gql`
query currentUser{
  currentUser{
    id
    username
    email
    userProfile{
      avatar
      gender
      birthday
      height
      weight
    }
  }
}
`

export const GET_USER_FOOD = gql`
query getUserFoods($query:AdminFoodQuery){
  getUserFoods(query:$query){
    total
    totalPage
    edges{
      id
      name
      scope
      image
      foodGroup
      serving_weight_grams
		  group{
        groupName
      }
      basicNutrients{
        Protein
        Calories
        Carbohydrates
      }
    }
  }
}
`

export const GET_FOOD_LOG = gql`
query getFoodsLog{
  getFoodsLog{
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