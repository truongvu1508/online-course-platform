import { handleUserError } from "../../utils/error.util.js";
import {
  deleteFromCloudinaryService,
  uploadToCloudinaryService,
} from "../../services/public/file.service.js";
import { extractPublicIdFromUrl } from "../../utils/cloudinary.helper.js";
import {
  getUserByIdService,
  updateUserService,
} from "../../services/admin/user.service.js";

// GET /users/:id
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate ID format
    if (!userId || !userId.toString().match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const user = await getUserByIdService(userId);

    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy user với id: ${userId}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /student/user
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, phone, address, password } = req.body;

    const currentUser = await getUserByIdService(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    let userDataUpdate = {};

    if (fullName !== undefined) userDataUpdate.fullName = fullName;
    if (phone !== undefined) userDataUpdate.phone = phone;
    if (password !== undefined) userDataUpdate.password = password;
    if (address !== undefined) userDataUpdate.address = address;

    // check upload file
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinaryService(
          req.file.buffer,
          "CodeLearns/users/avatars"
        );

        // delete file from cloudinary by publicID
        if (currentUser.avatar) {
          const oldPublicId = extractPublicIdFromUrl(currentUser.avatar);
          if (oldPublicId) {
            try {
              await deleteFromCloudinaryService(oldPublicId);
              console.log("Deleted old avatar:", oldPublicId);
            } catch (deleteFileError) {
              console.error("Error delete old avatar:", deleteFileError);
            }
          }
        }

        userDataUpdate.avatar = uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Lỗi upload avatar: " + uploadError.message,
        });
      }
    }

    if (Object.keys(userDataUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const updatedUser = await updateUserService(userId, userDataUpdate);

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Cập nhật thông tin tài khoản thành công",
    });
  } catch (error) {
    const { statusCode, message } = handleUserError(error);

    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

export { getProfile, updateProfile };
