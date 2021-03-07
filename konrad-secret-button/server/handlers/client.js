import { authenticatedFetch } from "@shopify/app-bridge-utils";
import ApolloClient from "apollo-boost";

export const createClient = () => {
  return new ApolloClient({
    uri: `https://konradbartlett-linustechtips-application.myshopify.com/api/2021-01/graphql.json`,
    fetchOptions: {
      credentials: "include"
    },
    request: operation => {
      operation.setContext({
        headers: {
          "Content-Type": "application/graphql",
          "User-Agent": `shopify-app-node ${process.env.npm_package_version} | Shopify App CLI`
        }
      });
    }
  });
};
