import express from "express";
import bodyParser from 'body-parser';
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import cors from 'cors';
import expressJwt from 'express-jwt';
import _ from "lodash";
import { execute, subscribe } from "graphql";
import { graphqlUploadExpress } from "graphql-upload";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { createServer } from "http";

import AuthDirective from "./directives/AuthDirective";
import typeDefs from "./schema/schema";
import resolvers from "./resolvers/resolvers";

import foodGroupLoader from './loader/foodGroupLoader'
import nutritionFactLoader from './loader/nutritionFactLoader'
import nutrientsLoader from './loader/nutrientsLoader'
// import extraNutritionLoader from './loader/extraNutrientLoader'
import foodLoader from "./loader/foodLoader";

import appApi from './api/appApi'

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


const corsOptions = {
  origin: 'http://localhost:4000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(
  expressJwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false
  })
)
app.use(express.static(__dirname + '/public'));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective
  }
})

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const user = req.user || null;
    return {
      user: user,
      loader: {
        foodLoader: foodLoader,
        foodGroupLoader: foodGroupLoader,
        nutritionFactLoader: nutritionFactLoader,
        nutrientsLoader: nutrientsLoader,
        // extraNutritionLoader: extraNutritionLoader
      }
    }
  },
  uploads: false
});

app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
server.applyMiddleware({ app });

//other router from 

const servers = createServer(app);

// const router = express.Router();
app.get('/export-sample', appApi.exportSampleFile)
app.get('/export-food', appApi.exportFoodFile)


servers.listen({ port: 4000 }, () => {
  console.log(`Server ready at: http://localhost:4000${server.graphqlPath}`);
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect(connectionParams, webSocket, context) {
        console.log('Connected!')
      },
    },
    {
      server: servers,
      path: "/subscriptions"
    }
  )
});
