import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "remixicon/fonts/remixicon.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ReactNotifications } from "react-notifications-component";

const client = new ApolloClient({
  uri: "http://127.0.0.1:8000/subgraphs/name/example",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "ignore",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <ReactNotifications />
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
