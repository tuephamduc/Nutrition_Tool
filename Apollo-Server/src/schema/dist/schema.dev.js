"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  scalar Date\n  scalar Upload\n\n  directive @auth(\n    requires: Role!\n  ) on FIELD_DEFINITION\n\n  enum Role {\n    ADMIN\n    USER\n    COMPANY\n  }\n\n  type File {\n    url: String!\n    mimetype:String!\n    encoding:String!\n  }\n\n  type User {\n    id: ID\n    username:String\n    email:String\n    password:String\n    active:Boolean\n    roles:Role\n  }\n\n  type AuthPayLoad{\n    user: User\n    token:String!\n    createdAt: String!\n    updatedAt: String!\n  }\n\n  type UserProfile {\n    userId:ID\n    gender:Int \n    birthday: Date \n    avatar:String\n  }\n\n  type Query {\n    users:  [User] @auth(requires:ADMIN)\n    user (id:ID!):  User\n    currentUser: User!\n    userProfile(id:ID!):UserProfile\n  }\n\n  type Mutation {\n    # auth\n    signupUser(username: String,email:String, password:String, roles:String): User\n    login(email:String!,password:String!,roles:String): AuthPayLoad\n    activeEmail(token:String!): Boolean\n    sendMailForgotPassword(email:String!):Boolean\n    forgotPassword( token:String, newPassword:String):Boolean\n\n    #user profile mutation\n    changeUserProfile(user:String):UserProfile\n    aploadAvatar(file:Upload!):File!\n\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServerExpress.gql)(_templateObject());
var _default = typeDefs;
exports["default"] = _default;