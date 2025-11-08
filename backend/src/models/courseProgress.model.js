import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID học viên là bắt buộc"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "ID khóa học là bắt buộc"],
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound unique index
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

courseProgressSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
export default CourseProgress;
