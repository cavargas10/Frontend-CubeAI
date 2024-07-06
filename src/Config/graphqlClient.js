import { GraphQLClient } from "graphql-request";

const hygraphClient = new GraphQLClient(import.meta.env.VITE_HYGRAPH_URL, {
  headers: {
    authorization: `Bearer ${import.meta.env.VITE_HYGRAPH_PERMANENTAUTH_TOKEN}`,
  },
});

export default hygraphClient;
