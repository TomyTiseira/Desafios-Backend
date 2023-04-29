import { hashSync } from "bcrypt";
import { usersMongoDb } from "../dao/mongoDA.js";

const mapUser = (user) => ({
  email: user.email,
  password: hashSync(user.password, 10),
});

export const getUsers = async () => {
  const users = await usersMongoDb.getUsers();
  return users;
};

export const addUser = async (userToAdd) => {
  const newUser = await usersMongoDb.addUser(mapUser(userToAdd));
  return newUser;
};
