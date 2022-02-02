import authResolvers from "./authResolver";
// import profileResolvers from './userResolver';
// import adminResolvers from './adminResolver';
// import rootResolvers from "./rootResolver";
import userResolver from "./userResolver";
import foodGroupResolver from "./foodGroupResolver";
import foodResolver from "./foodResolver";
import foodLogResolver from "./foodLogResolver";

import { merge } from "lodash";
const { GraphQLDateTime } = require('graphql-iso-date')
import { GraphQLUpload } from 'graphql-upload'
const typeResolvers = {
  Date: GraphQLDateTime,
  Upload: GraphQLUpload,
}
const resolvers = merge(
  typeResolvers,
  authResolvers,
  userResolver,
  foodGroupResolver,
  foodResolver,
  foodLogResolver
  // rootResolvers,
  // adminResolvers,
  // profileResolvers
)
export default resolvers