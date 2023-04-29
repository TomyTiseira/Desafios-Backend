import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers/index.js";

export const serverGQL = new ApolloServer({
  typeDefs,
  resolvers,
});
