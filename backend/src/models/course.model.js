import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề khóa học là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề khóa học không được quá 200 ký tự"],
    },
    slug: {
      type: String,
      required: [true, "Slug là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Mô tả khóa học là bắt buộc"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Mô tả ngắn không được quá 500 ký tự"],
    },
    thumbnail: {
      type: String,
      default: null,
    },
    previewVideo: {
      type: String,
      default: null,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Người tạo khóa học là bắt buộc"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Danh mục khóa học là bắt buộc"],
    },
    level: {
      type: String,
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message: "Trình độ phải là người mới bắt đầu, trung cấp hoặc nâng cao",
      },
      default: "beginner",
    },
    language: {
      type: String,
      enum: {
        values: ["vi", "en"],
        message: "Ngôn ngữ của khóa học là tiếng việt hoặc tiếng anh",
      },
      default: "vi",
    },
    price: {
      type: Number,
      required: [true, "Giá của khóa học là bắt buộc"],
      min: [0, "Giá không được âm"],
      default: 0,
    },
    discount: {
      type: Number,
      min: [0, "Giảm giá không được âm"],
      max: [100, "Giảm giá không được quá 100%"],
      default: 0,
    },
    // Yeu cau can co de hoc vien co the tham gia
    requirements: {
      type: [String],
      default: [],
    },
    // tong bai giang
    totalLectures: {
      type: Number,
      default: 0,
      min: 0,
    },
    // tong thoi luong cua ca khoa hoc
    totalDuration: {
      type: Number,
      default: 0,
      min: 0,
    },
    // tong hoc vien da dang ky
    totalStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    // tong danh gia
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    // danh gia trung binh
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Đánh giá không được âm"],
      max: [5, "Đánh giá không được hơn 5"],
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "published", "archived"],
        message: "Trạng thái phải là bản nháp, đã xuất bản hoặc đã lưu trữ",
      },
      default: "draft",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true }, // Cho JSON.stringify() và res.json() de virtual finalPrice xuat hien khi lay duoi dang json
    toObject: { virtuals: true }, // Cho .toObject()
  }
);

// index
courseSchema.index({ slug: 1 });
courseSchema.index({ categoryId: 1 });
courseSchema.index({ instructorId: 1 });
courseSchema.index({ status: 1, isPublished: 1 });
courseSchema.index({ averageRating: -1 });
courseSchema.index({ totalStudents: -1 });

// hien thi them finalPrice khi truy xuat data course
courseSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

courseSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Course = mongoose.model("Course", courseSchema);
export default Course;
