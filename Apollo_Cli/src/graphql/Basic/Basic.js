import { gql } from "@apollo/client"
import { NutritionFactSelect } from "constants/NutritionFactSelect"



export const ALL_GROUP = gql`
query getAllFoodGroup{
  getAllFoodGroup{
    id
    groupName
  }
}
`


export const FOOD_BY_ID = gql`
query getFoodById($id:String){
  getFoodById(id:$id){
    id
    name
    image
    language
    foodGroup
    owner
    scope
    isIngredient
    serving_weight_grams
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
    extraNutrients{
      nutrients{
        unit
        nutrient
      }
      nutrientId
      value
    }
    group{
      groupName
    }
    components{
      componentId
      value
      component{
        name
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
      extraNutrients{
      nutrientId
      value
      }
      }
    }
  }
  }

`

export const IGRE_BY_NAME = gql`
  query getIngredientsByName($search:String){
    getIngredientsByName(search:$search){
    id
    name
    image
    language
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
    extraNutrients{
      nutrientId
      value
    }
    group{
      groupName
    }
  }
    }
  `

export const ALL_NUTRIENT = gql`
query getAllNutrients{
  getAllNutrients{
    id
    nutrient
    unit
  }
}

`

export const orderByFact = (nutrientFact) => {
  return (
    gql`
    query orderFoodByNutrient($nutrient:String){
      orderFoodByNutrient(nutrient:$nutrient){
        id
        name
        image
        basicNutrients{
          ${nutrientFact}
        }
        group{
      groupName
    }
      }
    }
    `
  )
}

export const SORT_FOOD = gql`
query sortFoodByNutrient($query:SortFoodQuery){
  sortFoodByNutrient(query:$query){
    total
    totalPage
    edges{
    id
    name
    image
    group{
      groupName
    }

    extraNutrients{
      nutrients{
        unit
        nutrient
      }
      nutrientId
      value
    }   
  }
  }
}
`

export const SEARCH_BY_NAME = gql`
query searchFoodByName($search:String,$foodGroup:Int){
  searchFoodByName(search:$search, foodGroup:$foodGroup){
    id
    name
    image
    serving_weight_grams
    group{
        groupName
        }

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
`
export const SEARCH_FULL_BY_NAME = gql`
query searchFoodByName($search:String,$foodGroup:Int){
  searchFoodByName(search:$search, foodGroup:$foodGroup){
    id
    name
    image
    serving_weight_grams
    group{
        groupName
        }

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
    extraNutrients{
      nutrients{
        unit
        nutrient
      }
      nutrientId
      value
    }    
  }
}
`


export const searchbyNutrient = gql`
    query searchFoodByNutrient($query:NutrientFoodQuery){
      searchFoodByNutrient(query:$query){
        id
        name
        image
        serving_weight_grams
        group{
        groupName
        }
        basicNutrients{
      serving_unit

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
        extraNutrients{
      nutrients{
        unit
        nutrient
      }
      nutrientId
      value
    }
      }
    }
    `
