import { addUser } from "../../../dto/users.js";

export const userMutations = {
  addUser: async (_, { userToAdd }) => await addUser(userToAdd),
};
