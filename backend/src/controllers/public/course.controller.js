import {
  getCourseBestSellersService,
  getCourseNewestService,
  getCoursesRatingService,
  getCourseBySlugService,
  getAllPublicCoursesService,
} from "../../services/public/course.service.js";

// GET /api/public/courses
const getPublicCourses = async (req, res) => {
  try {
    let { limit, page } = req.query;

    // Validation
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

    const result = await getAllPublicCoursesService(limit, page, req.query);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách khóa học thành công",
      pagination:
        limit && page
          ? {
              total: result.total,
              page: result.currentPage,
              limit: result.pageSize,
              totalPages: result.totalPages,
            }
          : {
              total: result.total,
            },
      data: result.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/public/courses/:slug
const getPublicCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Validate slug
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug không hợp lệ",
      });
    }

    const course = await getCourseBySlugService(slug);

    if (course) {
      return res.status(200).json({
        success: true,
        data: course,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy khóa học với slug: ${slug}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/public/courses/best-sellers
const getPublicCourseBestSellers = async (req, res) => {
  try {
    const bestsellerCourses = await getCourseBestSellersService();
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách khóa học bán chạy thành công",
      data: bestsellerCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/public/courses/newest
const getPublicCourseNewest = async (req, res) => {
  try {
    const newestCourses = await getCourseNewestService();
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách khóa học mới nhất thành công",
      data: newestCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/public/courses/rating
const getPublicCoursesRating = async (req, res) => {
  try {
    const courseRatings = await getCoursesRatingService();
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách khóa học được đánh giá cao thành công",
      data: courseRatings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getPublicCourses,
  getPublicCourseBySlug,
  getPublicCourseBestSellers,
  getPublicCourseNewest,
  getPublicCoursesRating,
};
