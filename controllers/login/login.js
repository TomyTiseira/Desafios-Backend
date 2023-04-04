import { compareSync } from "bcrypt";

const login = async (email, password) => {
  const users = await usersMongoDb.getUsers();

  const existUser = users.find(
    (user) => user.email === email && compareSync(password, user.password)
  );

  if (!existUser) {
    return {
      success: false,
      error: "Datos inválidos",
    };
  }

  return {
    success: true,
  };
};

export default login;
