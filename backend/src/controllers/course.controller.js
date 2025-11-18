import { handleCourseError } from "../../src/utils/error.util.js";
import {
  deleteFromCloudinaryService,
  uploadToCloudinaryService,
} from "../services/file.service.js";
import {
  createCourseService,
  deleteCourseByIdService,
  getAllCoursesService,
  getCourseByIdService,
  getCourseBestSellersService,
  getCourseNewestService,
  updateCourseService,
  getCoursesRatingService,
  getCourseBySlugService,
  getAllPublicCoursesService,
} from "../services/course.service.js";
import { extractPublicIdFromUrl } from "../utils/cloudinary.helper.js";

// GET /courses
const getCourses = async (req, res) => {
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

    const result = await getAllCoursesService(limit, page, req.query);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách khóa học thành công",
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
      data: result.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /courses/:id
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const course = await getCourseByIdService(id);

    if (course) {
      return res.status(200).json({
        success: true,
        data: course,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy khóa học với id: ${id}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /courses
const createCourse = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      shortDescription,
      instructorId,
      categoryId,
      previewVideo,
      level,
      language,
      price,
      discount,
      requirements,
      status,
    } = req.body;

    let thumbnailURL = "";

    // Validate required fields
    if (!title || !slug || !description || !instructorId || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
    }

    // Upload thumbnail to Cloudinary
    if (req.file) {
      const uploadResult = await uploadToCloudinaryService(
        req.file.buffer,
        "CodeLearns/courses/thumbnails"
      );
      thumbnailURL = uploadResult.url;
    }

    let courseData = {
      title,
      slug,
      description,
      shortDescription,
      thumbnail: thumbnailURL,
      previewVideo: previewVideo,
      instructorId,
      categoryId,
      level: level || "beginner",
      language: language || "vi",
      price: price || 0,
      discount: discount || 0,
      requirements: requirements ? JSON.parse(requirements) : [],
      status: status || "draft",
      isPublished: status === "published",
      publishedAt: status === "published" ? new Date() : null,
    };

    const newCourse = await createCourseService(courseData);

    return res.status(201).json({
      success: true,
      data: newCourse,
      message: "Tạo khóa học thành công",
    });
  } catch (error) {
    const { statusCode, message } = handleCourseError(error);

    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

// PUT /courses/:id
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      shortDescription,
      instructorId,
      categoryId,
      previewVideo,
      level,
      language,
      price,
      discount,
      requirements,
      status,
    } = req.body;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const currentCourse = await getCourseByIdService(id);
    if (!currentCourse) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy khóa học với id: ${id}`,
      });
    }

    let courseDataUpdate = {};
    if (title !== undefined) courseDataUpdate.title = title;
    if (slug !== undefined) courseDataUpdate.slug = slug;
    if (description !== undefined) courseDataUpdate.description = description;
    if (shortDescription !== undefined)
      courseDataUpdate.shortDescription = shortDescription;
    if (instructorId !== undefined)
      courseDataUpdate.instructorId = instructorId;
    if (categoryId !== undefined) courseDataUpdate.categoryId = categoryId;
    if (level !== undefined) courseDataUpdate.level = level;
    if (language !== undefined) courseDataUpdate.language = language;
    if (price !== undefined) courseDataUpdate.price = price;
    if (discount !== undefined) courseDataUpdate.discount = discount;
    if (requirements !== undefined)
      courseDataUpdate.requirements = JSON.parse(requirements);
    if (status !== undefined) {
      courseDataUpdate.status = status;
      courseDataUpdate.isPublished = status === "published";
      if (status === "published" && !currentCourse.publishedAt) {
        courseDataUpdate.publishedAt = new Date();
      }
    }
    if (previewVideo !== undefined)
      courseDataUpdate.previewVideo = previewVideo;

    // Handle thumbnail upload
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinaryService(
          req.file.buffer,
          "CodeLearns/courses/thumbnails"
        );

        // Delete old thumbnail from cloudinary
        if (currentCourse.thumbnail) {
          const oldPublicId = extractPublicIdFromUrl(currentCourse.thumbnail);
          if (oldPublicId) {
            try {
              await deleteFromCloudinaryService(oldPublicId);
              console.log("Deleted old thumbnail:", oldPublicId);
            } catch (deleteFileError) {
              console.error("Error delete old thumbnail:", deleteFileError);
            }
          }
        }

        courseDataUpdate.thumbnail = uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Lỗi upload thumbnail: " + uploadError.message,
        });
      }
    }

    if (Object.keys(courseDataUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const updatedCourse = await updateCourseService(id, courseDataUpdate);

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Cập nhật khóa học thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /courses/:id
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const currentCourse = await getCourseByIdService(id);

    if (!currentCourse) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy khóa học với id: ${id}`,
      });
    }

    const deletedCourse = await deleteCourseByIdService(id);

    return res.status(200).json({
      success: true,
      data: deletedCourse,
      message: "Xóa khóa học thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// public routes
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
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getPublicCourses,
  getPublicCourseBySlug,
  getPublicCourseBestSellers,
  getPublicCourseNewest,
  getPublicCoursesRating,
};
