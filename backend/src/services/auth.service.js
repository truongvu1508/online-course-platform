import passport from "passport";
import User from "../models/users.model.js";
import { comparePasswordService } from "../middleware/user.middleware.js";

const handleRegisterService = async (dataRegister) => {
  const { email, fullName, password, verificationCode } = dataRegister;
  try {
    // check exist email
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    const userRegister = User.create({
      email,
      fullName,
      password,
      verificationCode,
      lastVerificationSent: new Date(),
    });

    return userRegister;
  } catch (error) {
    throw error;
  }
};

const handleVerifyEmailService = async (verificationCode) => {
  const userVerify = await User.findOne({
    verificationCode,
    isVerified: false,
  });

  if (!userVerify) {
    throw new Error("Mã xác thực không hợp lệ hoặc tài khoản đã được xác thực");
  }

  const codeTime =
    Date.now() - new Date(userVerify.lastVerificationSent).getTime;
  const MAX_TIME = 15 * 60 * 1000; // 15 minutes

  if (codeTime > MAX_TIME) {
    // auto delete verification code
    userVerify.verificationCode = undefined;
    await userVerify.save();

    const error = new Error(
      "Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã mới"
    );

    error.expired = true;
    throw error;
  }

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: userVerify._id,
      verificationCode,
      isVerified: false,
    },
    { $set: { isVerified: true }, $unset: { verificationCode: "" } },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("Không thể xác thực tài khoản. Vui lòng thử lại");
  }

  return {
    username: updatedUser.username,
    email: updatedUser.email,
  };
};

const handleResendVerificationCodeService = async (email) => {
  const user = await User.findOne({ email, isVerified: false });

  if (!user) {
    throw new Error("Không tìm thấy tài khoản hoặc tài khoản đã được xác thực");
  }

  // create new verification code
  const newVerificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.verificationCode = newVerificationCode;
  user.lastVerificationSent = new Date();
  await user.save();

  return newVerificationCode;
};

const handleLoginService = async (email, password, callback) => {
  // kiem tra user co trong db
  const user = await User.findOne({ email }).select("+password").exec();

  if (!user) {
    return callback(null, false, {
      message: `Email hoặc mật khẩu không chính xác. Vui lòng đăng nhập lại!`,
    });
  }

  // cap nhat thoi gian dang nhap
  await User.updateOne({ email }, { $set: { lastLoginAt: new Date() } });

  // so sanh password
  const isMatch = await comparePasswordService(password, user.password);
  if (!isMatch) {
    return callback(null, false, {
      message: `Email hoặc mật khẩu không chính xác. Vui lòng đăng nhập lại!`,
    });
  }

  return callback(null, user);
};

export {
  handleRegisterService,
  handleVerifyEmailService,
  handleResendVerificationCodeService,
  handleLoginService,
};
