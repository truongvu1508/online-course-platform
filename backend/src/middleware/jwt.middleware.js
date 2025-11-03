import passport from "passport";

// using passport-jwt
const checkValidJWT = (req, res, next) => {
  const path = req.path;
  const whiteList = [
    "/auth/register",
    "/auth/verify-email",
    "/auth/resend-verification",
    "/auth/login",
    "/file",
    "/files",
  ];

  const isWhiteList = whiteList.some((route) => route === path);
  if (isWhiteList) {
    return next();
  }

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("JWT Authentication Error:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi xác thực. Vui lòng thử lại sau.",
      });
    }
    if (!user) {
      let message = "";

      if (info) {
        if (info.message === "No auth token") {
          message = "Thiếu token xác thực. Vui lòng đăng nhập.";
        } else if (info.name === "TokenExpiredError") {
          message = "Token đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (info.name === "JsonWebTokenError") {
          message = "Token không hợp lệ.";
        } else if (info.message) {
          message = info.message;
        }
      }
      return res.status(401).json({
        success: false,
        message: message || "Token không hợp lệ",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export { checkValidJWT };
