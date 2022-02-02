import { gql } from "apollo-server-express";
import { Page } from "../helpers/pagination"

const typeDefs = gql`
  scalar Date
  scalar Upload
  scalar Cursor 

  directive @auth(
    requires: Role!
  ) on FIELD_DEFINITION

  enum Role {
    ADMIN
    USER
    EXPERT
  }

  enum MEAL {
    BREAK
    LUNCH
    DINNER
    SNACK
  }

  type File {
    url: String!
    mimetype:String!
    encoding:String!
    success:Boolean
  }

  type User {
    id: ID
    username:String
    email:String
    password:String
    active:Boolean
    roles:Role
    userProfile: UserProfile
  }

  type AuthPayLoad{
    user: User
    token:String!
    createdAt: String!
    updatedAt: String!
  }

  type UserProfile {
    userId:ID
    gender:Int 
    birthday: Date 
    height: Float
    weight: Float
    avatar: String
  }

  type FoodGroup{
    id:ID
    groupName:String
  }

  type NutritionFact {
    foodId: String
    serving_unit: String
    serving_weight_grams: Float
    Calories: Float
    Fat: Float
    SaturatedFat: Float
    TransFat: Float
    Protein: Float
    Cholesterol: Float
    Sodium: Float
    Potassium: Float
    Carbohydrates: Float
    DiateryFiber: Float
    Sugars: Float
    VitaminA: Float
    VitaminC: Float
    Calcium: Float
    Iron: Float
    updatedAt: Date
  }

  type Components {
    foodId: ID
    componentId: ID
    value: Float
    component: Food
  }

  type Nutrients {
    id: ID
    nutrient: String
    unit: String
    tagname: String
  }

  type ExtraNutrition{
    foodId: ID
    nutrientId: ID
    value: String
    nutrients: Nutrients
  }


  type Food {
    id: String
    name: String
    foodGroup: Int
    language: String
    image: String
    scope: Boolean
    owner: String
    isIngredient: Boolean
    serving_unit: String
    serving_weight_grams:Float
    active:Boolean
    basicNutrients: NutritionFact
    extraNutrients: [ExtraNutrition]
    components: [Components]
    group: FoodGroup
  }

  type Tracking {
    id: ID!
    userId: String
    foodId: String
    user: User
    food: Food
    meal: MEAL
    date: Date
    weight: Float
  }


  type FoodResponse{
    total:Int
    totalPage: Int
    edges: [Food]
    hasNextPage:Boolean
  } 

  type UserResponse{
    total: Int
    totalPage:Int 
    edges: [User]
    hasNextPage: Boolean
  }
  
  type FoodGroupResponse{
    total: Int
    totalPage:Int 
    edges: [FoodGroup]
    hasNextPage: Boolean
  }

  type NutrientResponse{
    total: Int
    totalPage:Int 
    edges: [Nutrients]
    hasNextPage: Boolean
  }

  type CountFoodInGroup{
    group: String
    count:Int
  }

  input UserQuery{
    search: String
    active: Boolean
    orderby: Int
    limit: Int
    page:Int
  }

  input AdminFoodQuery{
    search: String
    orderby: Int
    limit: Int
    page:Int
    foodGroup:Int
  }

  input NutrientFoodQuery{
    nutrient: Int
    op: String
    content: Float
  }

  input SortFoodQuery{
    nutrient:Int
    foodGroup:Int
    sort: Int
    page:Int
    limit:Int
    
  }
 ## Các query

  type Query {
    # users:  [User] 
    user (id:ID!):  User
    currentUser: User! 
    userProfile(id:ID!):UserProfile @auth(requires:USER)
    getUsers(userQuery:UserQuery):UserResponse
    getUserById(id:String): User
    basic(id:String):NutritionFact

    # food Query
    getFoodByGroup(foodGroup:ID!):[Food]
    getFoodById(id:String):Food
    getFoods(query:AdminFoodQuery):FoodResponse
    getIngredientsByName(search:String):[Food]

    getUserFoods(query:AdminFoodQuery):FoodResponse @auth(requires:USER)

    orderFoodByNutrient(nutrient: String):[Food]
    orderFoodByExtraNutrient(nutrient:Int):[Food]

    searchFoodByNutrient(query:NutrientFoodQuery):[Food]
    searchFoodByName(search:String,foodGroup:Int):[Food]
    sortFoodByNutrient(query:SortFoodQuery):FoodResponse

    # FoodGroupQuery
    getAllFoodGroup: [FoodGroup]
    getFoodGroup(limit:Int,page:Int):FoodGroupResponse

    # NutrientQuery
    getNutrients(limit:Int,page:Int):NutrientResponse
    getAllNutrients:[Nutrients]


    # FoodLog Query
    getFoodsLog:[Tracking]
    getFoodsLogByDate(date:Date):[Tracking]
    getFoodLogById(id:ID):Tracking

    # Count query
    countUser:Int
    countFood:Int
    countNewUser:Int
    countNewFood:Int 
    countFoodInGroup:[CountFoodInGroup]
  }

  ## Các Input

  input UserProfileInput{
    username:String
    gender:Int 
    birthday: Date 
    height: Float
    weight: Float
  }
  type UserProfileRes{
    username:String
    gender:Int 
    birthday: Date 
    height: Float
    weight: Float
    avatar:String
  }

  input FoodInputFact {
    serving_unit:String
    serving_weight_grams: Float
    Calories: Float
    Fat: Float
    SaturatedFat: Float
    TransFat: Float
    Protein: Float
    Cholesterol: Float
    Sodium: Float
    Potassium: Float
    Carbohydrates: Float
    DiateryFiber: Float
    Sugars: Float
    VitaminA: Float
    VitaminC: Float
    Calcium: Float
    Iron: Float
  }

  input FoodInputIngredient{
    componentId: String
    value: Float
  }

  input FoodInputExtraNutrition {
    nutrientId:ID
    value:Float
  }

  input FoodInput{
    name: String
    foodGroup: Int
    language: String
    owner: String
    scope: Boolean
    isIngredient: Boolean

    basicNutrients: FoodInputFact
    extraNutrients:[FoodInputExtraNutrition]
    ingredients:[FoodInputIngredient]
  }

  input UserInput {
    id:ID
    username: String
    email: String
    password: String
    active: Boolean
    roles:String
    gender: Int
    birthday: Date
    weight: Float
    height: Float
  }
  
  type MutationUserRes{
    id:ID
    username: String
    email: String
    password: String
    active: Boolean
    roles:String
    gender: Int
    birthday: Date
    weight: Float
    height: Float
  }

  input FoodLogInput{
    userId:String
    foodId:String
    meal: String
    date: Date
    weight:Float
  }

  input TrackingInput{
    foodId:String
    meal: MEAL
    date: Date
    weight: Float
  }
  ## Các Mutation
  type Mutation {
    # auth
    signupUser(username: String,email:String, password:String, roles:String): User
    login(email:String!,password:String!,roles:String): AuthPayLoad
    activeEmail(token:String!): Boolean
    sendMailForgotPassword(email:String!):Boolean
    forgotPassword( token:String, newPassword:String):Boolean
    linkReset (token: String!):Boolean
    
    # user profile mutation
    changeUserProfile( userProfileInput:UserProfileInput):UserProfileRes 
    uploadAvatar(file:Upload!):File! 
    changePassword(oldPassword:String, newPassword:String):Boolean
    # guess mutation
    
    # admin mutation
    addUser(userInput:UserInput):MutationUserRes
    editUser(userInput:UserInput,id:ID):MutationUserRes
    changeActiveUser(id:ID): Boolean

    addFood(foodInput:FoodInput):Food
    editFood(foodInput:FoodInput,id:String):Food
    deleteFood(id: String): ID
    changeImageFood(file:Upload!,foodId: String):File

    addFoodGroup(groupName:String):FoodGroup
    editFoodGroup(groupName:String, id:ID):FoodGroup
    deleteFoodGroup(id:ID): ID

    addNutrient(nutrient: String, unit: String, tagname: String):Nutrients
    editNutrient(id: ID, nutrient:String, unit: String, tagname: String):Nutrients
    deleteNutrient(id:ID):ID

    # userMutation
    addFoodLog(input:[TrackingInput]):[Tracking] @auth(requires:USER)
    editFoodLog(input: TrackingInput, id:ID): Tracking @auth(requires:USER)
    deleteFoodLog(id:ID):ID

    # import export
    importFoodData(file:Upload!, owner: String, scope:Boolean):File

    
  }

  type Subscription {
    NotifyRegisUser:String
  }
`


export default typeDefs;
