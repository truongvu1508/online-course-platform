import { handleUserError } from "../../src/utils/error.util.js";
import { createUserService } from "../services/user.service.js";

// POST /users
const createUser = async (req, res) => {
  try {
    const { email, fullName, phone, password, address, role } = req.body;
    console.log(req.body);

    let avatarURL = "";

    if (!email || !fullName || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    // upload avatar to Cloudinary
    // if (req.file) {
    //   const uploadResult = await uploadToCloudinaryService(
    //     req.file.buffer,
    //     "DuxProject/users/avatars"
    //   );
    //   avatarURL = uploadResult.url;
    // }

    let userData = {
      email,
      fullName,
      phone,
      password,
      address,
      role,
      avatar: avatarURL,
    };

    const newUser = await createUserService(userData);

    return res.status(201).json({
      success: true,
      data: newUser,
      message: "Tạo user thành công",
    });
  } catch (error) {
    const { statusCode, message } = handleUserError(error);

    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

export { createUser };
