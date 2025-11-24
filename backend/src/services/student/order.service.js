import Order from "../../models/order.model.js";
import Course from "../../models/course.model.js";
import { generateOrderNumber } from "../../utils/order.helper.js";
import Enrollment from "../../models/enrollment.model.js";

const selectedFields =
  "_id orderNumber items total paymentMethod paymentStatus status paymentDetails cancelledAt cancelledBy createdAt updatedAt";

const courseFields = "title slug thumbnail price discount";

const createOrderService = async (userId, items, paymentMethod) => {
  try {
    const courseIds = items.map((item) => item.courseId);
    const uniqueCourseIds = [...new Set(courseIds)];

    if (courseIds.length !== uniqueCourseIds.length) {
      throw new Error("Không thể thêm cùng một khóa học nhiều lần");
    }

    const existingEnrollments = await Enrollment.find({
      userId,
      courseId: { $in: uniqueCourseIds },
    }).select("courseId");

    if (existingEnrollments.length > 0) {
      const enrolledCourseIds = existingEnrollments.map((e) =>
        e.courseId.toString()
      );
      const duplicates = uniqueCourseIds.filter((id) =>
        enrolledCourseIds.includes(id)
      );

      throw new Error(
        `Bạn đã sở hữu các khóa học này: ${duplicates.join(", ")}`
      );
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const course = await Course.findById(item.courseId).select(
        "title price discount status isPublished"
      );

      if (!course) {
        throw new Error(`Khóa học với ID ${item.courseId} không tồn tại`);
      }

      if (!course.isPublished || course.status !== "published") {
        throw new Error(`Khóa học "${course.title}" chưa được công bố`);
      }

      const finalPrice = course.price * (1 - course.discount / 100);

      orderItems.push({
        courseId: course._id,
        courseName: course.title,
        price: finalPrice,
      });

      totalAmount += finalPrice;
    }

    const orderNumber = await generateOrderNumber();

    const newOrder = await Order.create({
      orderNumber,
      userId,
      items: orderItems,
      total: totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      status: "unpaid",
    });

    const populatedOrder = await Order.findById(newOrder._id)
      .select(selectedFields)
      .populate("userId", "fullName email")
      .populate("items.courseId", courseFields)
      .exec();

    return populatedOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const getOrdersByStudentService = async (
  userId,
  limit,
  page,
  status,
  paymentStatus
) => {
  try {
    let result = null;

    const filter = { userId };

    if (status) {
      if (!["pending", "completed", "cancelled", "refunded"].includes(status)) {
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

    if (limit && page) {
      const offset = (page - 1) * limit;

      const [orders, totalOrders] = await Promise.all([
        Order.find(filter)
          .select(selectedFields)
          .populate("userId", "fullName")
          .populate("items.courseId", courseFields)
          .limit(limit)
          .skip(offset)
          .sort({ createdAt: -1 })
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
        .populate("userId", "fullName")
        .sort({ createdAt: -1 })
        .exec();

      result = {
        orders,
        total: orders.length,
      };
    }

    return result;
  } catch (error) {
    console.error("Error getting orders by user:", error);
    throw error;
  }
};

const getOrderByIdService = async (orderId, userId) => {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.userId.toString() !== userId.toString()) {
      throw new Error("Bạn không có quyền truy cập đơn hàng này");
    }

    const fullOrder = await Order.findById(orderId)
      .select(selectedFields)
      .populate("userId", "fullName email phone address")
      .populate("items.courseId", courseFields)
      .exec();

    return fullOrder;
  } catch (error) {
    console.error("Error getting order by id:", error);
    throw error;
  }
};

const cancelOrderService = async (orderId, userId) => {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.userId.toString() !== userId.toString()) {
      throw new Error("Bạn không có quyền hủy đơn hàng này");
    }

    // chi duoc huy khi don hang o trang thai unpaid
    if (order.status !== "unpaid") {
      throw new Error(
        `Chỉ có thể hủy đơn hàng có trạng thái 'unpaid'. Trạng thái hiện tại: ${order.status}`
      );
    }

    // cap nhat trang thai don hang va trang thai thanh toan
    const cancelledOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "cancelled",
        paymentStatus: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: userId,
      },
      { new: true, runValidators: true }
    )
      .select(selectedFields)
      .populate("userId", "fullName email")
      .populate("items.courseId", courseFields)
      .exec();

    return cancelledOrder;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export {
  createOrderService,
  getOrdersByStudentService,
  getOrderByIdService,
  cancelOrderService,
};
