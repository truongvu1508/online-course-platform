import Cart from "../../models/cart.model.js";
import Course from "../../models/course.model.js";
import Enrollment from "../../models/enrollment.model.js";

const courseFields = "title slug thumbnail price discount status isPublished";

const getCartService = async (userId) => {
  try {
    let cart = await Cart.findOne({ userId })
      .populate("items.courseId", courseFields)
      .exec();

    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalPrice: 0 });
    }

    await cart.calculateTotal();
    await cart.save();

    return cart;
  } catch (error) {
    console.error("Error getting cart:", error);
    throw error;
  }
};

const addToCartService = async (userId, courseId) => {
  try {
    const course = await Course.findById(courseId).select(
      "title status isPublished"
    );

    if (!course) {
      throw new Error("Khóa học không tồn tại");
    }

    if (!course.isPublished || course.status !== "published") {
      throw new Error(`Khóa học "${course.title}" chưa được công bố`);
    }

    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      throw new Error("Bạn đã sở hữu khóa học này");
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalPrice: 0 });
    }

    // kiem tra khoa hoc da co trong gio hang chua
    const existingItem = cart.items.find(
      (item) => item.courseId.toString() === courseId.toString()
    );

    if (existingItem) {
      throw new Error("Khóa học đã có trong giỏ hàng");
    }

    cart.items.push({ courseId, addedAt: new Date() });
    await cart.calculateTotal();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.courseId", courseFields)
      .exec();

    return updatedCart;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

const removeFromCartService = async (userId, courseId) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Giỏ hàng không tồn tại");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.courseId.toString() === courseId.toString()
    );

    if (itemIndex === -1) {
      throw new Error("Khóa học không có trong giỏ hàng");
    }

    cart.items.splice(itemIndex, 1);
    await cart.calculateTotal();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.courseId", courseFields)
      .exec();

    return updatedCart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

const clearCartService = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Giỏ hàng không tồn tại");
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return cart;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

export {
  getCartService,
  addToCartService,
  removeFromCartService,
  clearCartService,
};
