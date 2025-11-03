export const handleUserError = (error) => {
  if (error.code === 11000) {
    const duplicatedField = Object.keys(error.keyValue)[0];
    const duplicatedValue = error.keyValue[duplicatedField];

    const fieldMessages = {
      username: `Username '${duplicatedValue}' đã tồn tại`,
      email: `Email '${duplicatedValue}' đã tồn tại`,
      phone: `Số điện thoại '${duplicatedValue}' đã tồn tại`,
    };

    return {
      statusCode: 400,
      message:
        fieldMessages[duplicatedField] ||
        `${duplicatedField} '${duplicatedValue}' đã tồn tại`,
    };
  }

  return {
    statusCode: 500,
    message: error.message || "Lỗi server",
  };
};
