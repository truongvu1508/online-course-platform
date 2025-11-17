const checkAdminRole = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Cần có quyền quản trị viên.",
    });
  }
  next();
};

const checkStudentRole = (req, res, next) => {
  if (req.user?.role !== "STUDENT") {
    return res.status(403).json({
      success: false,
      message: "Cần có quyền học viên.",
    });
  }
  next();
};

export { checkAdminRole, checkStudentRole };
