import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const lectureSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: [true, "ID của chương là bắt buộc"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "ID của khóa học là bắt buộc"],
    },
    title: {
      type: String,
      required: [true, "Tiêu đề của bài giảng là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề của bài giảng không được quá 200 ký tự"],
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: [true, "Thứ tự của bài giảng là bắt buộc"],
      min: [1, "Thứ tự của bài giảng phải từ 1"],
    },
    videoUrl: {
      type: String,
      required: [true, "URL của bài giảng là bắt buộc"],
    },
    videoDuration: {
      type: Number,
      required: [true, "Thời lượng của video là bắt buộc"],
      min: [0, "Thời lượng của video không được âm"],
    },
    // noi dung bo sung
    content: {
      type: String,
      default: "",
    },
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// index
lectureSchema.index({ chapterId: 1, order: 1 });
lectureSchema.index({ courseId: 1 });
lectureSchema.index({ isFree: 1 });

lectureSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
