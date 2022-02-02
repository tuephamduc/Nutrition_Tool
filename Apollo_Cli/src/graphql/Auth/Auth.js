import { gql } from "@apollo/client"

export const LOGIN = gql`
mutation Login($email:String!, $password:String!, $roles:String!){
  login(email:$email,password:$password ,roles:$roles){
  token
  user{
    roles
    email
  }
  }
}
`
export const SIGNUPUSER = gql`
mutation SignupUser($username: String,$email:String!, $password:String!, $roles:String!){
  signupUser(username:$username,email:$email,password:$password,roles: $roles){
    id
  }
}
`

export const ACTIVE_ACC = gql`
mutation ActiveEmail($token:String!){
  activeEmail(token:$token)
}
`

export const SEND_FORGOT = gql`
mutation sendMailForgotPassword($email:String!){
  sendMailForgotPassword(email:$email)
}
`
export const LINK_RESET = gql`
mutation linkReset($token:String!){
  linkReset(token:$token)
}
`

export const RESET_PASS = gql`
mutation forgotPassword($token:String!,$newPassword:String!){
  forgotPassword(token:$token,newPassword:$newPassword)
}
`
