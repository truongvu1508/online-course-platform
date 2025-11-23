import {
  createEnrollmentService,
  getEnrollmentByStudentService,
  getEnrollmentByIdService,
} from "../../services/student/enrollment.service.js";

// POST /api/enrollments
const createEnrollment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId || !orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    const enrollment = await createEnrollmentService(orderId);

    return res.status(201).json({
      success: true,
      message: "Tạo enrollment thành công",
      data: enrollment,
    });
  } catch (error) {
    console.error("Error creating enrollments:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi server, không thể tạo enrollment",
    });
  }
};

// GET /api/enrollments
const getEnrollments = async (req, res) => {
  try {
    const userId = req.user._id;
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

    const result = await getEnrollmentByStudentService(userId, limit, page);

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

// GET /api/enrollments/:id
const getEnrollmentById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID enrollment không hợp lệ",
      });
    }

    const enrollment = await getEnrollmentByIdService(id, userId);

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết enrollment thành công",
      data: enrollment,
    });
  } catch (error) {
    console.error("Error getting enrollment by id:", error);

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
          error.message || "Lỗi server, không thể lấy thông tin enrollment",
      });
  }
};

export { createEnrollment, getEnrollments, getEnrollmentById };
