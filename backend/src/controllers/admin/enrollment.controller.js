import { getEnrollmentCourseService } from "../../services/admin/enrollment.service.js";

// GET /api/enrollments/course/:id
const getEnrollmentCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    let { limit, page } = req.query;

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

    const result = await getEnrollmentCourseService(courseId, limit, page);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách enrollment thành công",
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
      data: result.enrollments,
    });
  } catch (error) {
    console.error("Error getting enrollments:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "Lỗi server, không thể lấy danh sách enrollment",
    });
  }
};

export { getEnrollmentCourse };
