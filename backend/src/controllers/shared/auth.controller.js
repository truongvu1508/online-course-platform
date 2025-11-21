const getAccount = (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Không tìm thấy thông tin người dùng",
      });
    }
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      },
      message: "Lấy thông tin tài khoản thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
    });
  }
};

export { getAccount };
