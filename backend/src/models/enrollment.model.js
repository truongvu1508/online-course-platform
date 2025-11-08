import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID của học viên là bắt buộc"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "ID của khóa học là bắt buộc"],
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "ID đơn hàng là bắt buộc"],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null, // null neu truy cap vinh vien
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, "Tiến độ học phải từ 0"],
      max: [100, "Tiến độ học không được quá 100"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "completed", "expired", "suspended"],
        message:
          "Trạng thái phải là đang học, hoàn thành, hết hạn hoặc bị đình chỉ",
      },
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// index
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ status: 1 });

enrollmentSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
