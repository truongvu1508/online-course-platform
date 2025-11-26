import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const courseProgressSchema = new mongoose.Schema(
  {
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
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
courseProgressSchema.index({ enrollmentId: 1 }, { unique: true });

courseProgressSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
export default CourseProgress;
