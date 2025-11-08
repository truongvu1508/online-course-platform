import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Tên danh mục là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên danh mục không được quá 100 ký tự."],
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
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ order: 1 });

categorySchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Category = mongoose.model("Category", categorySchema);
export default Category;
