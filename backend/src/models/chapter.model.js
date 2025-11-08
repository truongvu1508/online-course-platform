import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const chapterSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "ID khóa học là bắt buộc"],
    },
    title: {
      type: String,
      required: [true, "Tiêu đề chương là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề chương không được quá 200 ký tự"],
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: [true, "Thứ tự của chương là bắt buộc"],
      min: [1, "Thứ tự của chương phải từ 1"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// index
chapterSchema.index({ courseId: 1, order: 1 });

chapterSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
