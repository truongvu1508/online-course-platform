import Order from "../../models/order.model.js";

const selectedFields =
  "_id orderNumber items total paymentMethod paymentStatus status paymentDetails cancelledAt cancelledBy createdAt updatedAt";

const courseFields = "title slug thumbnail price discount";

const getAllOrdersService = async (
  limit,
  page,
  status,
  paymentStatus,
  userId,
  orderNumber
) => {
  try {
    let result = null;
    const filter = {};

    if (status) {
      if (!["unpaid", "paid", "cancelled", "refunded"].includes(status)) {
        throw new Error("Trạng thái đơn hàng không hợp lệ");
      }
      filter.status = status;
    }

    if (paymentStatus) {
      if (
        !["pending", "completed", "failed", "refunded"].includes(paymentStatus)
      ) {
        throw new Error("Trạng thái thanh toán không hợp lệ");
      }
      filter.paymentStatus = paymentStatus;
    }

    if (userId) {
      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("User ID không hợp lệ");
      }
      filter.userId = userId;
    }

    if (orderNumber) {
      filter.orderNumber = { $regex: orderNumber, $options: "i" };
    }

    if (limit && page) {
      const offset = (page - 1) * limit;

      // filter va pagination
      const [orders, totalOrders] = await Promise.all([
        Order.find(filter)
          .select(selectedFields)
          .populate("userId", "fullName email phone")
          .populate("items.courseId", courseFields)
          .limit(limit)
          .skip(offset)
          .sort({ createdAt: -1 })
          .lean()
          .exec(),
        Order.countDocuments(filter),
      ]);

      result = {
        orders,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: Number(page),
      };
    } else {
      const orders = await Order.find(filter)
        .select(selectedFields)
        .populate("userId", "fullName email")
        .populate("items.courseId", courseFields)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      result = {
        orders,
        total: orders.length,
      };
    }

    return result;
  } catch (error) {
    console.error("Error getting all orders:", error);
    throw error;
  }
};

// GET order by id - Admin
const getOrderByIdService = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .select(selectedFields)
      .populate("userId", "fullName email phone address")
      .populate("items.courseId", courseFields)
      .populate("cancelledBy", "fullName email")
      .lean()
      .exec();

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    return order;
  } catch (error) {
    console.error("Error getting order by id:", error);
    throw error;
  }
};

// UPDATE order status - Admin
const updateOrderStatusService = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    const updateData = { status };

    // neu chuyen sang completed thi cap nhat payment status completed
    if (status === "completed" && order.paymentStatus === "pending") {
      updateData.paymentStatus = "completed";
      updateData["paymentDetails.paidAt"] = new Date();
    }

    if (status === "cancelled" || status === "refunded") {
      updateData.cancelledAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select(selectedFields)
      .populate("userId", "fullName email")
      .populate("items.courseId", courseFields)
      .lean()
      .exec();

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// UPDATE payment status - Admin
const updatePaymentStatusService = async (
  orderId,
  paymentStatus,
  transactionId,
  paymentGateway
) => {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    const updateData = { paymentStatus };

    if (transactionId) {
      updateData["paymentDetails.transactionId"] = transactionId;
    }

    if (paymentGateway) {
      updateData["paymentDetails.paymentGateway"] = paymentGateway;
    }

    // thanh toan thanh cong
    if (paymentStatus === "completed") {
      updateData["paymentDetails.paidAt"] = new Date();
      // tu dong cap nhat trang thai don hang neu dang o trang thai pending
      if (order.status === "pending") {
        updateData.status = "completed";
      }
    }

    // hoan tien
    if (paymentStatus === "refunded") {
      updateData.status = "refunded";
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select(selectedFields)
      .populate("userId", "fullName email")
      .populate("items.courseId", courseFields)
      .lean()
      .exec();

    return updatedOrder;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

// DELETE order - Admin
const deleteOrderService = async (orderId) => {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    // chi duoc xoa don hang da huy hoac da hoan tien
    if (!["cancelled", "refunded"].includes(order.status)) {
      throw new Error(
        "Chỉ có thể xóa đơn hàng có trạng thái 'cancelled' hoặc 'refunded'"
      );
    }

    const deletedOrder = await Order.deleteById(orderId)
      .select("_id orderNumber status")
      .lean()
      .exec();

    return deletedOrder;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

// GET order statistics - Admin
const getOrderStatisticsService = async (startDate, endDate) => {
  try {
    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // su dung aggregation de tinh toan thong ke
    const [totalOrders, statusStats, paymentStats, revenueStats] =
      await Promise.all([
        Order.countDocuments(filter),

        Order.aggregate([
          { $match: filter },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        Order.aggregate([
          { $match: filter },
          { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
        ]),

        // doanh thu tu cac don hang da thanh toan
        Order.aggregate([
          { $match: { ...filter, paymentStatus: "completed" } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$total" },
              averageOrderValue: { $avg: "$total" },
              completedOrders: { $sum: 1 },
            },
          },
        ]),
      ]);

    // Format response
    const statistics = {
      totalOrders,
      ordersByStatus: statusStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      ordersByPaymentStatus: paymentStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      revenue: revenueStats[0] || {
        totalRevenue: 0,
        averageOrderValue: 0,
        completedOrders: 0,
      },
    };

    return statistics;
  } catch (error) {
    console.error("Error getting order statistics:", error);
    throw error;
  }
};

export {
  getAllOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  updatePaymentStatusService,
  deleteOrderService,
  getOrderStatisticsService,
};
