import { handleUserError } from "../../src/utils/error.util.js";
import {
  deleteFromCloudinaryService,
  uploadToCloudinaryService,
} from "../services/file.service.js";
import {
  createUserService,
  deleteUserByIdService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} from "../services/user.service.js";
import { extractPublicIdFromUrl } from "../utils/cloudinary.helper.js";

// GET /users
const getUsers = async (req, res) => {
  try {
    let { limit, page } = req.query;

    // Validation
    if (limit !== undefined) {
      limit = Number(limit);
      if (isNaN(limit) || limit <= 0 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: "Limit phải là số dương và không vượt quá 100",
        });
      }
    }

    if (page !== undefined) {
      page = Number(page);
      if (isNaN(page) || page <= 0) {
        return res.status(400).json({
          success: false,
          message: "Page phải là số dương",
        });
      }
    }

    const result = await getAllUsersService(limit, page, req.query);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng thành công",
      pagination:
        limit && page
          ? {
              total: result.total,
              page: result.currentPage,
              limit: limit,
              totalPages: result.totalPages,
            }
          : {
              total: result.total,
            },
      data: result.users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const user = await getUserByIdService(id);

    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy user với id: ${id}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
    if (req.file) {
      const uploadResult = await uploadToCloudinaryService(
        req.file.buffer,
        "CodeLearns/users/avatars"
      );
      avatarURL = uploadResult.url;
    }

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

// PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, fullName, phone, password, address, role } = req.body;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const currentUser = await getUserByIdService(id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy user với id: ${id}`,
      });
    }

    let userDataUpdate = {};
    if (fullName !== undefined) userDataUpdate.fullName = fullName;
    if (email !== undefined) userDataUpdate.email = email;
    if (phone !== undefined) userDataUpdate.phone = phone;
    if (password !== undefined) userDataUpdate.password = password;
    if (address !== undefined) userDataUpdate.address = address;
    if (role !== undefined) userDataUpdate.role = role;

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

    const updateUser = await updateUserService(id, userDataUpdate);

    return res.status(200).json({
      success: true,
      data: updateUser,
      message: "Cập nhật user thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const currentUser = await getUserByIdService(id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy user với id: ${id}`,
      });
    }

    const deleteUser = await deleteUserByIdService(id);

    return res.status(200).json({
      success: true,
      data: deleteUser,
      message: "Xóa user thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
