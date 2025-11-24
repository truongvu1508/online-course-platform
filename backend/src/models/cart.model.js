import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID người dùng là bắt buộc"],
      unique: true, // Mỗi user chỉ có 1 giỏ hàng
    },
    items: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// tinh tong tien gio hang
cartSchema.methods.calculateTotal = async function () {
  const Course = mongoose.model("Course");
  let total = 0;

  for (const item of this.items) {
    const course = await Course.findById(item.courseId).select(
      "price discount"
    );
    if (course) {
      const finalPrice = course.price * (1 - course.discount / 100);
      total += finalPrice;
    }
  }

  this.totalPrice = total;
  return total;
};

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
