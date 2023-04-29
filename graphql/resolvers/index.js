import { userQueries } from "./login/queries.js";
import { userMutations } from "./login/mutations.js";

export const resolvers = {
  Query: {
    ...userQueries,
  },
  Mutation: {
    ...userMutations,
  },
};
