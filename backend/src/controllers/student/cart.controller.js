import {
  getCartService,
  addToCartService,
  removeFromCartService,
  clearCartService,
} from "../../services/student/cart.service.js";

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await getCartService(userId);

    return res.status(200).json({
      success: true,
      message: "Lấy giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server, không thể lấy giỏ hàng",
    });
  }
};

// POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    // Validate courseId
    if (!courseId || !courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID khóa học không hợp lệ",
      });
    }

    const cart = await addToCartService(userId, courseId);

    return res.status(200).json({
      success: true,
      message: "Thêm vào giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi server, không thể thêm vào giỏ hàng",
    });
  }
};

// DELETE /api/cart/remove/:courseId
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    // Validate courseId
    if (!courseId || !courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID khóa học không hợp lệ",
      });
    }

    const cart = await removeFromCartService(userId, courseId);

    return res.status(200).json({
      success: true,
      message: "Xóa khỏi giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi server, không thể xóa khỏi giỏ hàng",
    });
  }
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await clearCartService(userId);

    return res.status(200).json({
      success: true,
      message: "Xóa toàn bộ giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server, không thể xóa giỏ hàng",
    });
  }
};

export { getCart, addToCart, removeFromCart, clearCart };
