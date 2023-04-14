// import { hashSync } from "bcrypt";
import { addUser, getUsers } from "../../dto/users.js";
// import { usersMongoDb } from "../../dao/mongoDA.js";

const signup = async (email, password) => {
  try {
    const users = await getUsers();

    const existUser = users.find((user) => user.email === email);

    if (existUser) {
      return {
        success: false,
        error: "El usuario ya existe",
      };
    }

    await addUser({ email, password });

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
};

export default signup;
