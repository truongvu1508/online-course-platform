import Order from "../models/order.model.js";
import {
  createOrderService,
  getOrdersByStudentService,
  getOrderByIdService,
  cancelOrderService,
} from "../services/order.service.js";

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách khóa học không hợp lệ",
      });
    }

    if (
      !paymentMethod ||
      !["vnpay", "momo", "bank_transfer"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Phương thức thanh toán không hợp lệ",
      });
    }

    for (let item of items) {
      if (!item.courseId || !item.courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "ID khóa học không hợp lệ",
        });
      }
    }

    const newOrder = await createOrderService(userId, items, paymentMethod);

    return res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi server, không thể tạo đơn hàng",
    });
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    let { limit, page, status, paymentStatus } = req.query;

    if (limit !== undefined) {
      limit = Number(limit);
      if (isNaN(limit) || limit <= 0 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: "Limit phải là số dương và không vượt quá 100",
        });
      }
    }

    if (page !== undefined) {
      page = Number(page);
      if (isNaN(page) || page <= 0) {
        return res.status(400).json({
          success: false,
          message: "Page phải là số dương",
        });
      }
    }

    const result = await getOrdersByStudentService(
      userId,
      limit,
      page,
      status,
      paymentStatus
    );

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đơn hàng thành công",
      pagination:
        limit && page
          ? {
              total: result.total,
              page: result.currentPage,
              limit: limit,
              totalPages: result.totalPages,
            }
          : {
              total: result.total,
            },
      data: result.orders,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server, không thể lấy danh sách đơn hàng",
    });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    const order = await getOrderByIdService(id, userId);

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error("Error getting order by id:", error);

    if (error.message.includes("quyền")) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    return res
      .status(error.message.includes("Không tìm thấy") ? 404 : 500)
      .json({
        success: false,
        message:
          error.message || "Lỗi server, không thể lấy thông tin đơn hàng",
      });
  }
};

// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    const cancelledOrder = await cancelOrderService(id, userId);

    return res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: cancelledOrder,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);

    if (error.message.includes("quyền")) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message.includes("pending")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res
      .status(error.message.includes("Không tìm thấy") ? 404 : 500)
      .json({
        success: false,
        message: error.message || "Lỗi server, không thể hủy đơn hàng",
      });
  }
};

export { createOrder, getOrders, getOrderById, cancelOrder };
