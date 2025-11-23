import Enroll from "../../models/enrollment.model.js";
import Order from "../../models/order.model.js";

const enrollmentFields =
  "_id userId courseId orderId enrolledAt expiresAt progress status";

const createEnrollmentService = async (orderId) => {
  try {
    const order = await Order.findById(orderId).exec();
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.status !== "completed" || order.paymentStatus !== "completed") {
      throw new Error(
        `Không thể tạo enroll. Trạng thái đơn hàng hiện tại: ${order.status}`
      );
    }

    const enrollments = [];

    for (let item of order.items) {
      const exists = await Enroll.findOne({
        userId: order.userId,
        courseId: item.courseId,
      }).exec();

      if (!exists) {
        const newEnroll = await Enroll.create({
          userId: order.userId,
          courseId: item.courseId,
          orderId: order._id,
          enrolledAt: new Date(),
          expiresAt: null,
          progress: 0,
          status: "active",
        });

        const enrollment = await Enroll.findById(newEnroll._id)
          .select(enrollmentFields)
          .populate("userId", "fullName email")
          .populate("courseId", "title description slug thumbnail")
          .exec();

        enrollments.push(enrollment);
      }
    }

    return enrollments;
  } catch (error) {
    console.error("Error creating enrollments:", error);
    throw error;
  }
};

const getEnrollmentByStudentService = async (userId, limit, page) => {
  try {
    const filter = { userId };

    if (limit && page) {
      const offset = (page - 1) * limit;

      const [enrollments, totalEnrollments] = await Promise.all([
        Enroll.find(filter)
          .select(enrollmentFields)
          .sort({ enrolledAt: -1 })
          .skip(offset)
          .limit(limit)
          .populate("courseId", "title slug thumbnail price discount")
          .exec(),
        Enroll.countDocuments(filter),
      ]);

      return {
        enrollments,
        total: totalEnrollments,
        totalPages: Math.ceil(totalEnrollments / limit),
        currentPage: Number(page),
      };
    } else {
      const enrollments = await Enroll.find(filter)
        .select(enrollmentFields)
        .sort({ enrolledAt: -1 })
        .populate("courseId", "title slug thumbnail price discount")
        .exec();

      return {
        enrollments,
        total: enrollments.length,
      };
    }
  } catch (error) {
    console.error("Error getting enrollments:", error);
    throw error;
  }
};

const getEnrollmentByIdService = async (enrollmentId, userId) => {
  try {
    const enrollment = await Enroll.findById(enrollmentId)
      .select(enrollmentFields)
      .populate("courseId", "title slug thumbnail price discount")
      .exec();

    if (!enrollment) {
      throw new Error("Không tìm thấy enrollment");
    }

    if (enrollment.userId.toString() !== userId.toString()) {
      throw new Error("Bạn không có quyền truy cập enrollment này");
    }

    return enrollment;
  } catch (error) {
    console.error("Error getting enrollment by ID:", error);
    throw error;
  }
};

export {
  createEnrollmentService,
  getEnrollmentByStudentService,
  getEnrollmentByIdService,
};
