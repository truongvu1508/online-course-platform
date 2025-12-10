import mongoose from "mongoose";
import Course from "../../models/course.model.js";
import Enroll from "../../models/enrollment.model.js";
import Order from "../../models/order.model.js";
import Chapter from "../../models/chapter.model.js";
import Lecture from "../../models/lecture.model.js";

const enrollmentFields =
  "_id userId courseId orderId enrolledAt expiresAt progress status";

const createEnrollmentService = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).exec();
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.status !== "paid" || order.paymentStatus !== "completed") {
      throw new Error(
        `Không thể tạo enroll. Trạng thái đơn hàng hiện tại: ${order.status}`
      );
    }

    const enrollments = [];
    const courseIdsToUpdate = [];

    for (let item of order.items) {
      const exists = await Enroll.findOne({
        userId: order.userId,
        courseId: item.courseId,
      }).session(session);

      if (!exists) {
        const newEnroll = await Enroll.create(
          [
            {
              userId: order.userId,
              courseId: item.courseId,
              orderId: order._id,
              enrolledAt: new Date(),
              expiresAt: null,
              progress: 0,
              status: "active",
            },
          ],
          { session }
        );

        courseIdsToUpdate.push(item.courseId);

        const enrollment = await Enroll.findById(newEnroll[0]._id)
          .session(session)
          .select(enrollmentFields)
          .populate("userId", "fullName email")
          .populate("courseId", "title description slug thumbnail");

        enrollments.push(enrollment);
      }
    }

    if (courseIdsToUpdate.length > 0) {
      await Course.updateMany(
        { _id: { $in: courseIdsToUpdate } },
        { $inc: { totalStudents: 1 } },
        { session }
      );
    }

    await session.commitTransaction();
    return enrollments;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating enrollments:", error);
    throw error;
  } finally {
    session.endSession();
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

    const chapters = await Chapter.find({ courseId: enrollment.courseId._id })
      .sort({ order: 1 })
      .lean();

    const lectures = await Lecture.find({ courseId: enrollment.courseId._id })
      .sort({ order: 1 })
      .lean();

    const chaptersWithLectures = chapters.map((chapter) => ({
      ...chapter,
      lectures: lectures
        .filter(
          (lecture) => lecture.chapterId.toString() === chapter._id.toString()
        )
        .map((lecture) => ({
          _id: lecture._id,
          title: lecture.title,
          description: lecture.description,
          order: lecture.order,
          videoDuration: lecture.videoDuration,
          videoUrl: lecture.videoUrl,
          content: lecture.content,
          isFree: lecture.isFree,
        })),
    }));

    //chuyen tu document sang object
    const enrollmentData = enrollment.toObject();

    return {
      ...enrollmentData,
      courseId: {
        ...enrollmentData.courseId,
        curriculum: chaptersWithLectures,
      },
    };
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
