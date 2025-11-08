import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";
import {
  comparePasswordMethod,
  hashPasswordMiddleware,
} from "../middleware/user.middleware.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Vui lòng nhập đúng định dạng email",
      ],
    },

    password: {
      type: String,
      default: process.env.PASSWORD_DEFAULT,
      minlength: [6, "Mật khẩu phải từ 6 ký tự"],
      select: false,
    },

    fullName: {
      type: String,
      required: [true, "Họ tên là bắt buộc"],
      trim: true,
      maxlength: [100, "Họ tên không được quá 100 ký tự"],
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Vui lòng nhập đúng định dạng số điện thoại"],
    },

    address: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    dateOfBirth: {
      type: Date,
    },

    role: {
      type: String,
      required: [true, "Vai trò là bắt buộc"],
      enum: {
        values: ["STUDENT", "ADMIN"],
      },
      default: "STUDENT",
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
    },

    lastVerificationSent: {
      type: Date,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// hash password before save collection
userSchema.pre("save", hashPasswordMiddleware);

// compare password
userSchema.methods.comparePassword = comparePasswordMethod;

// Override all methods
userSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const User = mongoose.model("User", userSchema);

export default User;
