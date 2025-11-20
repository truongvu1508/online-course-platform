import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "Mã đơn hàng là bắt buộc"],
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID học viên là bắt buộc"],
    },
    items: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        courseName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: [true, "Tổng tiền là bắt buộc"],
      min: [0, "Tổng tiền không được âm"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["vnpay", "momo", "bank_transfer"],
        message: "Phương thức thanh toán không hợp lệ",
      },
      required: [true, "Phương thức thanh toán là bắt buộc"],
    },
    // trang thai thanh toan
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "completed", "failed", "refunded"],
        message: "Trạng thái thanh toán không hợp lệ",
      },
      default: "pending",
    },
    paymentDetails: {
      transactionId: {
        type: String,
        default: null,
      },
      paymentGateway: {
        type: String,
        default: null,
      },
      paidAt: {
        type: Date,
        default: null,
      },
    },
    // trang thai don hang
    status: {
      type: String,
      enum: {
        values: ["pending", "completed", "cancelled", "refunded"],
        message: "Invalid order status",
      },
      default: "pending",
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

orderSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Order = mongoose.model("Order", orderSchema);
export default Order;
