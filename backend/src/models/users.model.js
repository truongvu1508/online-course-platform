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
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      default: process.env.PASSWORD_DEFAULT,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,11}$/, "Please enter a valid phone number"],
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
      required: [true, "Role is required"],
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
