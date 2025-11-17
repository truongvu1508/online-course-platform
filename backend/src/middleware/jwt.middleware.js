import passport from "passport";

const checkValidJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("JWT Authentication Error:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi xác thực. Vui lòng thử lại sau.",
      });
    }

    if (!user) {
      let message = "Token không hợp lệ";

      if (info?.message === "No auth token") {
        message = "Thiếu token xác thực. Vui lòng đăng nhập.";
      } else if (info?.name === "TokenExpiredError") {
        message = "Token đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (info?.name === "JsonWebTokenError") {
        message = "Token không hợp lệ.";
      } else if (info?.message) {
        message = info.message;
      }

      return res.status(401).json({
        success: false,
        message: message,
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export { checkValidJWT };
