import User from "../models/users.model.js";
import aqp from "api-query-params";
import {
  processPartialSearch,
  USER_SEARCHABLE_FIELDS,
} from "../utils/query.helper.js";

const selectedFields = "_id email fullName phone avatar role lastLoginAt";

const getAllUsersService = async (limit, page, queryString) => {
  try {
    let result = null;

    if (limit && page) {
      const { filter, skip } = aqp(queryString);

      delete filter.page;
      let offset = (page - 1) * limit;
      const processedFilter = processPartialSearch(
        filter,
        USER_SEARCHABLE_FIELDS
      );

      const [users, totalUsers] = await Promise.all([
        User.find(processedFilter)
          .select(selectedFields)
          .limit(limit)
          .skip(offset)
          .exec(),
        User.countDocuments(processedFilter),
      ]);

      result = {
        users,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: Number(page),
        pageSize: Number(limit),
      };
    } else {
      const users = await User.find({}).select(selectedFields).exec();
      result = {
        users,
        total: users.length,
      };

      console.log(result);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const getUserByIdService = async (userId) => {
  try {
    const user = await User.findById(userId).select(selectedFields).exec();

    return user;
  } catch (error) {
    throw new Error("Không thể tải thông tin user");
  }
};

const createUserService = async (userData) => {
  const { fullName, email, phone, password, address, role, avatar } = userData;

  try {
    const newUser = await User.create({
      email,
      fullName,
      phone,
      password,
      address,
      role,
      avatar,
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateUserService = async (userId, userDataUpdate) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userDataUpdate },
      { new: true, upsert: false }
    ).select(selectedFields);

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Lỗi server, không thể cập nhật user");
  }
};

const deleteUserByIdService = async (userId) => {
  try {
    const userDelete = await User.deleteById({ _id: userId });
    return userDelete;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Lỗi server, không thể xóa user");
  }
};

export {
  getAllUsersService,
  createUserService,
  getUserByIdService,
  updateUserService,
  deleteUserByIdService,
};
