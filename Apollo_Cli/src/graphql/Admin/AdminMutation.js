import { gql } from "@apollo/client"

export const ADD_FGROUP = gql`
mutation addFoodGroup($groupName:String){
  addFoodGroup(groupName:$groupName){
    id
    groupName
  }
}
`

export const EDIT_FGROUP = gql`
mutation editFoodGroup($id:ID,$groupName:String){
  editFoodGroup(id:$id,groupName:$groupName){
    id
    groupName
  }
}
`
export const DELETE_FGROUP = gql`
mutation deleteFoodGroup($id:ID){
  deleteFoodGroup(id:$id)
}
`

export const ADD_NUTRIENT = gql`
mutation addNutrient($nutrient: String, $unit: String, $tagname: String){
  addNutrient( nutrient:$nutrient, unit: $unit, tagname: $tagname){
    id 
    nutrient
    unit
    tagname
  }
}
`

export const EDIT_NUTRIENT = gql`
mutation editNutrient($id:ID,$nutrient: String, $unit: String, $tagname: String){
  editNutrient(id:$id,nutrient:$nutrient, unit: $unit, tagname: $tagname){
    id 
    nutrient
    unit
    tagname
  }
}
`

export const DELETE_NUTRIENT = gql`
mutation deleteNutrient($id:ID){
  deleteNutrient(id:$id)
}
`

export const ADD_USER = gql`
mutation addUser($userInput:UserInput){
  addUser(userInput:$userInput){
    id
    username
    email
    active
    roles
    gender
    birthday
    height
    weight
  }
}
`
export const EDIT_USER = gql`
mutation editUser($id:ID, $userInput:UserInput){
  editUser(id:$id,userInput:$userInput){
    id
    username
    email
    active
    roles
    gender
    birthday
    height
    weight
  }
}
`
