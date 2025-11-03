import bcrypt from "bcryptjs";

export const hashPasswordMiddleware = async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.SALT_ROUNDS)
  );
  next();
};

export const comparePasswordMethod = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const comparePasswordService = async (plainText, hashPassword) => {
  return await bcrypt.compare(plainText, hashPassword);
};

export const hashSinglePassword = async (password) => {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password: " + error.message);
  }
};

export const hashPasswordsForBulkInsert = async (users) => {
  try {
    const processedUsers = await Promise.all(
      users.map(async (user) => {
        // not provided password
        if (!user.password) {
          const defaultPassword = process.env.PASSWORD_DEFAULT;
          const hashedPassword = await bcrypt.hash(
            defaultPassword,
            parseInt(process.env.SALT_ROUNDS)
          );
          return { ...user, password: hashedPassword };
        }
        // provide password
        else {
          const hashedPassword = await bcrypt.hash(
            user.password,
            parseInt(process.env.SALT_ROUNDS)
          );
          return { ...user, password: hashedPassword };
        }
      })
    );
    return processedUsers;
  } catch (error) {
    throw new Error("Error hashing passwords: " + error.message);
  }
};
