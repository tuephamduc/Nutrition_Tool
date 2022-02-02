import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "assets/scss/main.scss"
import { relayStylePagination } from "@apollo/client/utilities";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  ApolloLink,
  createHttpLink
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from '@apollo/client/link/ws';
import Cookies from "js-cookie";
import dotenv from 'dotenv'

dotenv.config();

const uploadLink = createUploadLink({
  uri: process.env.REACT_APP_SERVER_GRAPH,
  // credentials: 'include'
})

// console.log(process.env.REACT_APP_SERVER_GRAPH);
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/subscriptions',
  options: {
    reconnect: true
  }
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const userCookie = Cookies.getJSON("userCookie");
  const token = userCookie ? userCookie.token : "";

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});


const client = new ApolloClient({
  link: authLink.concat(uploadLink).concat(httpLink).concat(wsLink),
  cache: new InMemoryCache(
    // {
    //   typePolicies: {
    //     Query: {
    //       fields: {
    //         foods: relayStylePagination(),
    //       }
    //     }
    //   }
    // }

  ),
  // defaultOptions: {
  //   mutate: { errorPolicy: 'all' },
  // },

  onError: ({ networkError, graphQLErrors }) => {
    console.log("graphQLErrors", graphQLErrors)
    console.log("networkError", networkError)
  },
});



ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
