import { handleChapterError } from "../../utils/error.util.js";
import {
  createChapterService,
  deleteChapterByIdService,
  getAllChaptersService,
  getChapterByIdService,
  updateChapterService,
} from "../../services/admin/chapter.service.js";

// GET /chapters
const getChapters = async (req, res) => {
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

    const result = await getAllChaptersService(limit, page, req.query);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách chương thành công",
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
      data: result.chapters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /chapters/:id
const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const chapter = await getChapterByIdService(id);

    if (chapter) {
      return res.status(200).json({
        success: true,
        data: chapter,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy chương với id: ${id}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /chapters
const createChapter = async (req, res) => {
  try {
    const { courseId, title, description, order } = req.body;

    if (!courseId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
    }

    let chapterData = {
      courseId,
      title,
      description,
    };

    // them order khi cung cap
    if (order !== undefined) {
      chapterData.order = order;
    }

    const newChapter = await createChapterService(chapterData);

    return res.status(201).json({
      success: true,
      data: newChapter,
      message: "Tạo chương thành công",
    });
  } catch (error) {
    const { statusCode, message } = handleChapterError(error);

    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

// PUT /chapters/id
const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, title, description, order } = req.body;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const currentChapter = await getChapterByIdService(id);
    if (!currentChapter) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy chương học với id: ${id}`,
      });
    }

    let chapterDataUpdate = {};
    if (courseId !== undefined) chapterDataUpdate.courseId = courseId;
    if (title !== undefined) chapterDataUpdate.title = title;
    if (description !== undefined) chapterDataUpdate.description = description;
    if (order !== undefined) chapterDataUpdate.order = order;

    if (Object.keys(chapterDataUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const updatedChapter = await updateChapterService(id, chapterDataUpdate);
    return res.status(200).json({
      success: true,
      data: updatedChapter,
      message: "Cập nhật chương thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /chapters/id
const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const currentChapter = await getChapterByIdService(id);
    if (!currentChapter) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy chương với id: ${id}`,
      });
    }

    const deletedChapter = await deleteChapterByIdService(id);

    return res.status(200).json({
      success: true,
      data: deletedChapter,
      message: "Xóa chương thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
};
