import { getUsers } from "../../../dto/users.js";

export const userQueries = {
  users: async () => await getUsers(),
};
