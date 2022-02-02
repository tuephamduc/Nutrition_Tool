import { gql } from "@apollo/client"


export const GET_USER = gql`
query getUsers($userQuery:UserQuery!){
  getUsers(userQuery:$userQuery){
    total
    totalPage
    edges{
      id
      username
      email
      active
      roles
      userProfile
      {
        gender
        birthday
      }
    }
  }
}
`
export const GET_FGROUP = gql`
query getFoodGroup($limit:Int,$page:Int){
  getFoodGroup(limit:$limit,page:$page){
    total
    totalPage
    edges{
      id
      groupName
    }
    hasNextPage
  }
}
`
export const GET_NUTRIENT = gql`
query getNutrients($limit:Int,$page:Int){
  getNutrients(limit:$limit,page:$page){
    total
    totalPage
    edges{
      id
      nutrient
      unit
      tagname
    }
    hasNextPage
  }
}
`

export const GET_FOOD = gql`
query getFoods($query:AdminFoodQuery){
  getFoods(query:$query){
    total
    totalPage
    edges{
      id
      name
      scope
      image
      foodGroup
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

export const COUNT_USER = gql`
query countUser{
  countUser
}
`

export const COUNT_NEWUSER = gql`
query countNewUser{
  countNewUser
}
`

export const COUNT_FOOD = gql`
query countFood{
  countFood
}
`

export const COUNT_NEWFOOD = gql`
query countNewFood{
  countNewFood
}
`