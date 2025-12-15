import Chapter from "../../models/chapter.model.js";
import aqp from "api-query-params";
import {
  CHAPTER_SEARCHABLE_FIELDS,
  processPartialSearch,
} from "../../utils/query.helper.js";

const selectedFields =
  "_id courseId title description order createdAt updatedAt";

const getAllChaptersService = async (limit, page, queryString) => {
  try {
    let result = null;

    if (limit && page) {
      const { filter, skip } = aqp(queryString);

      delete filter.page;
      let offset = (page - 1) * limit;

      const courseIdFilter = filter.courseId;
      delete filter.courseId;

      const processedFilter = processPartialSearch(
        filter,
        CHAPTER_SEARCHABLE_FIELDS
      );

      // object id nen exact match
      if (courseIdFilter) {
        processedFilter.courseId = courseIdFilter;
      }

      const [chapters, totalChapters] = await Promise.all([
        Chapter.find(processedFilter)
          .select(selectedFields)
          .populate("courseId", "title slug description")
          .limit(limit)
          .skip(offset)
          .sort({ createdAt: -1 })
          .exec(),
        Chapter.countDocuments(processedFilter),
      ]);

      result = {
        chapters,
        total: totalChapters,
        totalPages: Math.ceil(totalChapters / limit),
        currentPage: Number(page),
        pageSize: Number(limit),
      };
    } else {
      const chapters = await Chapter.find({})
        .select(selectedFields)
        .populate("courseId", "title slug description")
        .sort({ createdAt: -1 })
        .exec();

      result = {
        chapters,
        total: chapters.length,
      };
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const getChapterByIdService = async (chapterId) => {
  try {
    const chapter = await Chapter.findById(chapterId)
      .select(selectedFields)
      .populate("courseId", "title slug description")
      .exec();
    return chapter;
  } catch (error) {
    throw new Error("không thể tải thông tin chương");
  }
};

const createChapterService = async (chapterData) => {
  const createFields = "_id courseId title description order createdAt ";
  try {
    if (!chapterData.order) {
      const maxOrderChapter = await Chapter.findOne({
        courseId: chapterData.courseId,
      })
        .sort({ order: -1 })
        .select("order")
        .lean() // tra ve object thay vi document
        .exec();

      chapterData.order = maxOrderChapter ? maxOrderChapter.order + 1 : 1;
    }
    const newChapter = await Chapter.create(chapterData);

    const populatedChapter = await Chapter.findById(newChapter._id)
      .select(createFields)
      .populate("courseId", "title slug description")
      .exec();

    return populatedChapter;
  } catch (error) {
    console.error("Error creating chapter:", error);
    throw error;
  }
};

const updateChapterService = async (chapterId, chapterDataUpdate) => {
  const updateFields = "_id courseId title description order updatedAt ";
  try {
    const updatedChapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { $set: chapterDataUpdate },
      { new: true, runValidators: true }
    )
      .select(updateFields)
      .populate("courseId", "title slug description")
      .exec();

    return updatedChapter;
  } catch (error) {
    console.error("Error updating chapter:", error);
    throw new Error("Lỗi server, không thể cập nhật chương bài học");
  }
};

const deleteChapterByIdService = async (chapterId) => {
  try {
    const deletedChapter = await Chapter.delete({ _id: chapterId });
    return deletedChapter;
  } catch (error) {
    console.error("Error deleting chapter:", error);
    throw new Error("Lỗi server, không thể xóa chương");
  }
};

export {
  getAllChaptersService,
  getChapterByIdService,
  createChapterService,
  updateChapterService,
  deleteChapterByIdService,
};
