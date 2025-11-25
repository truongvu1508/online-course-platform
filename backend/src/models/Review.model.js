import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User là bắt buộc"],
    },

    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: [true, "Enrollment là bắt buộc"],
    },

    rating: {
      type: Number,
      required: [true, "Đánh giá sao là bắt buộc"],
      min: [1, "Đánh giá tối thiểu là 1 sao"],
      max: [5, "Đánh giá tối đa là 5 sao"],
    },

    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Bình luận không được quá 1000 ký tự"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reviewSchema.index({ userId: 1, enrollmentId: 1 }, { unique: true });

reviewSchema.index({ enrollmentId: 1, createdAt: -1 });

reviewSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
