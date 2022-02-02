"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _apolloServerExpress = require("apollo-server-express");

var _cors = _interopRequireDefault(require("cors"));

var _expressJwt = _interopRequireDefault(require("express-jwt"));

var _lodash = _interopRequireDefault(require("lodash"));

var _graphql = require("graphql");

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _http = require("http");

var _AuthDirective = _interopRequireDefault(require("./directives/AuthDirective"));

var _schema = _interopRequireDefault(require("./schema/schema"));

var _resolvers = _interopRequireDefault(require("./resolvers/resolvers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import { makeExecutableSchema } from '@graphql-tools/schema';
var app = (0, _express["default"])();
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
var corsOptions = {
  origin: 'http://localhost:4000',
  credentials: true
};
app.use((0, _cors["default"])(corsOptions));
app.use((0, _expressJwt["default"])({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false
}));
app.use(_express["default"]["static"]('public'));
var schema = (0, _apolloServerExpress.makeExecutableSchema)({
  typeDefs: _schema["default"],
  resolvers: _resolvers["default"],
  schemaDirectives: {
    auth: _AuthDirective["default"]
  }
});
var server = new _apolloServerExpress.ApolloServer({
  schema: schema,
  context: function context(_ref) {
    var req = _ref.req;
    var user = req.user || null;
    return user;
  }
});
server.applyMiddleware({
  app: app
});
var servers = (0, _http.createServer)(app);
servers.listen({
  port: 4000
}, function () {
  console.log("Server ready at: http://localhost:4000".concat(server.graphqlPath));
  new _subscriptionsTransportWs.SubscriptionServer({
    execute: _graphql.execute,
    subscribe: _graphql.subscribe,
    schema: schema,
    onConnect: function onConnect(connectionParams, webSocket, context) {
      console.log('Connected!');
    }
  }, {
    server: servers,
    path: "/subscriptions"
  });
});