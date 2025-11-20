import {
  getAllOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  updatePaymentStatusService,
  deleteOrderService,
  getOrderStatisticsService,
} from "../../services/admin/order.service.js";

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    let { limit, page, status, paymentStatus, userId, orderNumber } = req.query;

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

    const result = await getAllOrdersService(
      limit,
      page,
      status,
      paymentStatus,
      userId,
      orderNumber
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
    console.error("Error getting all orders:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server, không thể lấy danh sách đơn hàng",
    });
  }
};

// GET /api/admin/orders/:id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    const order = await getOrderByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error("Error getting order by id:", error);
    return res
      .status(error.message.includes("Không tìm thấy") ? 404 : 500)
      .json({
        success: false,
        message:
          error.message || "Lỗi server, không thể lấy thông tin đơn hàng",
      });
  }
};

// PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái đơn hàng là bắt buộc",
      });
    }

    if (!["pending", "completed", "cancelled", "refunded"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái đơn hàng không hợp lệ",
      });
    }

    const updatedOrder = await updateOrderStatusService(id, status);

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(error.message.includes("Không tìm thấy") ? 404 : 500)
      .json({
        success: false,
        message: error.message || "Lỗi server, không thể cập nhật trạng thái",
      });
  }
};

// PUT /api/admin/orders/:id/payment-status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId, paymentGateway } = req.body;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái thanh toán là bắt buộc",
      });
    }

    if (
      !["pending", "completed", "failed", "refunded"].includes(paymentStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái thanh toán không hợp lệ",
      });
    }

    const updatedOrder = await updatePaymentStatusService(
      id,
      paymentStatus,
      transactionId,
      paymentGateway
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thanh toán thành công",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res
      .status(error.message.includes("Không tìm thấy") ? 404 : 500)
      .json({
        success: false,
        message:
          error.message ||
          "Lỗi server, không thể cập nhật trạng thái thanh toán",
      });
  }
};

// DELETE /api/admin/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    const deletedOrder = await deleteOrderService(id);

    return res.status(200).json({
      success: true,
      message: "Xóa đơn hàng thành công",
      data: deletedOrder,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res
      .status(error.message.includes("Không tìm thấy") ? 404 : 500)
      .json({
        success: false,
        message: error.message || "Lỗi server, không thể xóa đơn hàng",
      });
  }
};

// GET /api/admin/orders/statistics
const getOrderStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const statistics = await getOrderStatisticsService(startDate, endDate);

    return res.status(200).json({
      success: true,
      message: "Lấy thống kê đơn hàng thành công",
      data: statistics,
    });
  } catch (error) {
    console.error("Error getting order statistics:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server, không thể lấy thống kê",
    });
  }
};

export {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  getOrderStatistics,
};
