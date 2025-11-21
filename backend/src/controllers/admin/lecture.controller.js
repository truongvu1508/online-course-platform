import { handleLectureError } from "../../utils/error.util.js";
import {
  createLectureService,
  deleteLectureByIdService,
  getAllLecturesService,
  getLectureByIdService,
  updateLectureService,
} from "../../services/admin/lecture.service.js";

// GET/lectures
const getLectures = async (req, res) => {
  try {
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

    const result = await getAllLecturesService(limit, page, req.query);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách bài học thành công",
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
      data: result.lectures,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /lectures/id
const getLectureById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const lecture = await getLectureByIdService(id);

    if (lecture) {
      return res.status(200).json({
        success: true,
        data: lecture,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy bài học với id: ${id}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /lecture
const createLecture = async (req, res) => {
  try {
    const {
      chapterId,
      courseId,
      title,
      description,
      order,
      videoUrl,
      videoDuration,
      content,
      isFree,
    } = req.body;

    if (
      !chapterId ||
      !courseId ||
      !title ||
      !description ||
      !videoUrl ||
      !videoDuration ||
      !content
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
    }

    let lectureData = {
      chapterId,
      courseId,
      title,
      description,
      videoUrl,
      videoDuration,
      content,
      isFree,
    };

    if (order !== undefined) {
      lectureData.order = order;
    }

    const newLecture = await createLectureService(lectureData);

    return res.status(201).json({
      success: true,
      data: newLecture,
      message: "Tạo bài học thành công",
    });
  } catch (error) {
    const { statusCode, message } = handleLectureError(error);

    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

// PUT /lectures/id
const updateLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      chapterId,
      courseId,
      title,
      description,
      order,
      videoUrl,
      videoDuration,
      content,
      isFree,
    } = req.body;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const currentLecture = await getLectureByIdService(id);
    if (!currentLecture) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy bài học với id: ${id}`,
      });
    }

    let lectureDataUpdate = {};
    if (chapterId !== undefined) lectureDataUpdate.chapterId = chapterId;
    if (courseId !== undefined) lectureDataUpdate.courseId = courseId;
    if (title !== undefined) lectureDataUpdate.title = title;
    if (description !== undefined) lectureDataUpdate.description = description;
    if (order !== undefined) lectureDataUpdate.order = order;
    if (videoUrl !== undefined) lectureDataUpdate.videoUrl = videoUrl;
    if (videoDuration !== undefined)
      lectureDataUpdate.videoDuration = videoDuration;
    if (content !== undefined) lectureDataUpdate.content = content;
    if (isFree !== undefined) lectureDataUpdate.isFree = isFree;

    if (Object.keys(lectureDataUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const updatedLecture = await updateLectureService(id, lectureDataUpdate);
    return res.status(200).json({
      success: true,
      data: updatedLecture,
      message: "Cập nhật bài học thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /lectures/id
const deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const currentLecture = await getLectureByIdService(id);
    if (!currentLecture) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy bài học với id: ${id}`,
      });
    }

    const deletedLecture = await deleteLectureByIdService(id);

    return res.status(200).json({
      success: true,
      data: deletedLecture,
      message: "Xóa bài học thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getLectures,
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture,
};
