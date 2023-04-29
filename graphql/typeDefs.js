export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    password: String
  }

  input UserToAdd {
    email: String!
    password: String!
  }

  type Query {
    users: [User]!
  }

  type Mutation {
    addUser(userToAdd: UserToAdd!): User!
  }
`;
