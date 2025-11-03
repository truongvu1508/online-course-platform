import User from "../models/users.model.js";

const createUserService = async (userData) => {
  const { fullName, email, phone, password, address, role, avatar } = userData;

  try {
    const newUser = await User.create({
      email,
      fullName,
      phone,
      password,
      address,
      role,
      avatar,
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export { createUserService };
