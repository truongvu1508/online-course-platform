import {
  handleRegisterService,
  handleResendVerificationCodeService,
  handleVerifyEmailService,
} from "../../services/public/auth.service.js";
import { sendVerificationCode } from "../../services/shared/email.service.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const handleRegister = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    if (!email?.trim() || !fullName?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đủ thông tin",
      });
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ",
      });
    }

    // validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const dataRegister = {
      email,
      fullName,
      password,
      verificationCode,
    };

    const resultRegister = await handleRegisterService(dataRegister);

    // send verificationCode to email
    await sendVerificationCode(dataRegister.email, verificationCode);
    try {
    } catch (mailError) {
      console.error("Không thể gửi mã xác thực đến email", mailError);
      return res.status(201).json({
        success: true,
        data: {
          email: resultRegister.email,
          fullName: resultRegister.fullName,
        },
        message:
          "Đăng ký thành công nhưng không thể gửi email xác thực. Vui lòng yêu cầu gửi lại",
        emailSent: false,
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        email: resultRegister.email,
        fullName: resultRegister.fullName,
      },
      message:
        "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản",
      emailSent: true,
    });
  } catch (error) {
    console.log(error);
    if (error.message === "Email đã tồn tại") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống, vui lòng thử lại sau",
    });
  }
};

const handleVerifyEmail = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    // Validate input
    if (!verificationCode || !/^\d{6}$/.test(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: "Mã xác thực không hợp lệ",
      });
    }

    const resultVerify = await handleVerifyEmailService(verificationCode);

    return res.status(200).json({
      success: true,
      data: resultVerify,
      message: "Xác thực tài khoản thành công",
    });
  } catch (error) {
    console.error("Email verification error:", error.message);

    // verificationCode expired
    if (error.expired) {
      return res.status(400).json({
        success: false,
        message: error.message,
        expired: true,
      });
    }

    if (
      error.message ===
        "Mã xác thực không hợp lệ hoặc tài khoản đã được xác thực" ||
      error.message === "Không thể xác thực tài khoản. Vui lòng thử lại"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống, vui lòng thử lại sau",
    });
  }
};

const handleResendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email không được để trống",
      });
    }

    const newVerificationCode = await handleResendVerificationCodeService(
      email
    );

    try {
      await sendVerificationCode(email, newVerificationCode);

      return res.status(200).json({
        success: true,
        message: "Đã gửi lại mã xác thực. Vui lòng kiểm tra email",
      });
    } catch (mailError) {
      console.error("Failed to resend verification email:", mailError.message);

      return res.status(500).json({
        success: false,
        message: "Không thể gửi email. Vui lòng thử lại sau",
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error.message);

    if (
      error.message ===
      "Không tìm thấy tài khoản hoặc tài khoản đã được xác thực"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
    });
  }
};

const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  // validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ email và password",
    });
  }

  passport.authenticate("local", { session: false }, (err, user, info) => {
    // system error
    if (err) {
      console.error(">>> error: ", err);

      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống, vui lòng thử lại sau",
      });
    }

    // xac thuc that bai (email hoac password khong dung)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Thông tin đăng nhập không chính xác",
      });
    }

    // xac thuc thanh cong
    // thong tin chua trong access token
    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    const access_token = jwt.sign(payload, secret, { expiresIn });

    return res.status(200).json({
      success: true,
      data: {
        access_token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
        },
      },
      message: "Đăng nhập thành công",
    });
  })(req, res, next);
};

export {
  handleRegister,
  handleVerifyEmail,
  handleResendVerificationCode,
  handleLogin,
};
