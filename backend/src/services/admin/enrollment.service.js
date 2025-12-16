import Enrollment from "../../models/enrollment.model.js";

const enrollmentFields =
  "_id userId courseId orderId enrolledAt expiresAt progress status";

const getEnrollmentCourseService = async (courseId, limit, page) => {
  try {
    const filter = { courseId };

    if (limit && page) {
      const offset = (page - 1) * limit;

      const [enrollments, totalEnrollments] = await Promise.all([
        Enrollment.find(filter)
          .select(enrollmentFields)
          .sort({ enrolledAt: -1 })
          .skip(offset)
          .limit(limit)
          .populate("courseId", "title slug thumbnail price discount")
          .exec(),
        Enrollment.countDocuments(filter),
      ]);

      return {
        enrollments,
        total: totalEnrollments,
        totalPages: Math.ceil(totalEnrollments / limit),
        currentPage: Number(page),
      };
    } else {
      const enrollments = await Enrollment.find(filter)
        .select(enrollmentFields)
        .sort({ enrolledAt: -1 })
        .populate("userId", "email fullName avatar role")
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

export { getEnrollmentCourseService };
