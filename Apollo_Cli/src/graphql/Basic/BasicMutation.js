import { gql } from "@apollo/client"

export const ADD_FOOD = gql`
mutation addFood($foodInput:FoodInput){
  addFood(foodInput:$foodInput){
    id
    name
    language
  }
}
`

export const EDIT_FOOD = gql`
mutation editFood($foodInput:FoodInput,$id:String){
  editFood(foodInput:$foodInput, id:$id){
    id
    name
  }
}
`

export const DELETE_FOOD = gql`
mutation deleteFood($id:String){
  deleteFood(id:$id)
}
`

export const IMPORT_FOOD = gql`
mutation importFoodData($file:Upload!,$owner: String,$scope:Boolean){
  importFoodData(file:$file, owner: $owner, scope:$scope){
    success
  }
}
`
export const EDIT_FOOD_IMAGE = gql`
mutation changeImageFood ($file:Upload!,$foodId: String){
  changeImageFood(file:$file,foodId: $foodId){
    url
    success
  }
}
`
export const EDIT_AVATAR = gql`
mutation uploadAvatar($file:Upload!){
  uploadAvatar(file:$file){
    url
    success
  }
}
`

export const EDIT_USER_INFO = gql`
mutation changeUserProfile($userProfileInput:UserProfileInput){
  changeUserProfile(userProfileInput:$userProfileInput){
    username
    gender
    birthday
    height
    weight
    avatar
  }
}
`
export const CHANGE_PASS = gql`
mutation changePassword($oldPassword:String, $newPassword: String){
  changePassword(oldPassword:$oldPassword,newPassword:$newPassword)
}
`