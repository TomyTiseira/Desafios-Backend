import { hashSync } from "bcrypt";
import { usersMongoDb } from "../../dataAccess/mongoDA.js";

const signup = async (email, password) => {
  const users = await usersMongoDb.getUsers();

  const existUser = users.find((user) => user.email === email);

  if (existUser) {
    return {
      success: false,
      error: "El usuario ya existe",
    };
  }

  await usersMongoDb.addUser({ email, password: hashSync(password, 10) });

  return {
    success: true,
  };
};

export default signup;
