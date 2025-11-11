import Lecture from "../models/lecture.model.js";
import aqp from "api-query-params";
import {
  LECTURE_SEARCHABLE_FIELDS,
  processPartialSearch,
} from "../utils/query.helper.js";

const selectedFields =
  "_id chapterId courseId title description order videoUrl videoDuration content isFree";

const getAllLecturesService = async (limit, page, queryString) => {
  try {
    let result = null;

    if (limit && page) {
      const { filter, skip } = aqp(queryString);

      delete filter.page;
      let offset = (page - 1) * limit;
      const processedFilter = processPartialSearch(
        filter,
        LECTURE_SEARCHABLE_FIELDS
      );

      const [lectures, totalLectures] = await Promise.all([
        Lecture.find(processedFilter)
          .select(selectedFields)
          .populate("chapterId", "title description")
          .populate("courseId", "title slug description")
          .limit(limit)
          .offset(offset)
          .exec(),
      ]);

      result = {
        lectures,
        total: totalLectures,
        totalPages: Math.ceil(totalLectures / limit),
        currentPage: Number(page),
        pageSize: Number(limit),
      };
    } else {
      const lectures = await Lecture.find({})
        .select(selectedFields)
        .populate("chapterId", "title description")
        .populate("courseId", "title slug description")
        .exec();
      result = {
        lectures,
        total: lectures.length,
      };
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const getLectureByIdService = async (lectureId) => {
  try {
    const lecture = await Lecture.findById(lectureId)
      .select(selectedFields)
      .populate("chapterId", "title description")
      .populate("courseId", "title slug description")
      .exec();
    return lecture;
  } catch (error) {
    throw new Error("không thể tải thông tin ài giảng");
  }
};

const createLectureService = async (lectureData) => {
  const createFields =
    "_id chapterId courseId title description order videoUrl videoDuration content isFree";
  try {
    if (!lectureData.order) {
      const maxOrderLecture = await Lecture.findOne({
        chapterId: lectureData.chapterId,
      })
        .sort({ order: -1 })
        .select("order")
        .lean()
        .exec();

      lectureData.order = maxOrderLecture ? maxOrderLecture.order + 1 : 1;
      const newLecture = await Lecture.create(lectureData);

      const populatedLecture = await Lecture.findById(newLecture._id)
        .select(createFields)
        .populate("chapterId", "title description")
        .populate("courseId", "title slug description")
        .exec();

      return populatedLecture;
    }
  } catch (error) {
    console.error("Error creating lecture:", error);
    throw error;
  }
};

const updateLectureService = async (lectureId, lectureDataUpdate) => {
  const updateFields =
    "_id chapterId courseId title description order videoUrl videoDuration content isFree";
  try {
    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      { $set: lectureDataUpdate },
      { new: true, runValidators: true }
    )
      .select(updateFields)
      .populate("chapterId", "title description")
      .populate("courseId", "title slug description")
      .exec();

    return updatedLecture;
  } catch (error) {
    console.error("Error updating lecture:", error);
    throw new Error("Lỗi server, không thể cập nhật bài học");
  }
};

const deleteLectureByIdService = async (lectureId) => {
  try {
    const deletedLecture = await Lecture.delete({ _id: lectureId });
    return deletedLecture;
  } catch (error) {
    console.error("Error deleting lecture:", error);
    throw new Error("Lỗi server, không thể xóa bài học");
  }
};

export {
  getAllLecturesService,
  getLectureByIdService,
  createLectureService,
  updateLectureService,
  deleteLectureByIdService,
};
