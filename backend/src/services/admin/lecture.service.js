import Lecture from "../../models/lecture.model.js";
import Course from "../../models/course.model.js";
import aqp from "api-query-params";
import {
  LECTURE_SEARCHABLE_FIELDS,
  processPartialSearch,
} from "../../utils/query.helper.js";
import mongoose from "mongoose";

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
  const session = await mongoose.startSession();
  session.startTransaction();

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
    }

    const newLecture = await Lecture.create([lectureData], { session });

    await Course.findByIdAndUpdate(
      lectureData.courseId,
      {
        $inc: {
          totalLectures: 1,
          totalDuration: lectureData.videoDuration || 0,
        },
      },
      { session }
    );

    await session.commitTransaction();

    const populatedLecture = await Lecture.findById(newLecture[0]._id)
      .select(createFields)
      .populate("chapterId", "title description")
      .populate("courseId", "title slug description")
      .exec();

    return populatedLecture;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating lecture:", error);
    throw error;
  } finally {
    session.endSession();
  }
};

const updateLectureService = async (lectureId, lectureDataUpdate) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const updateFields =
    "_id chapterId courseId title description order videoUrl videoDuration content isFree";
  try {
    const oldLecture = await Lecture.findById(lectureId).session(session);
    if (!oldLecture) throw new Error("Không tìm thấy bài giảng");

    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      { $set: lectureDataUpdate },
      { new: true, runValidators: true, session }
    );

    if (
      lectureDataUpdate.videoDuration &&
      lectureDataUpdate.videoDuration !== oldLecture.videoDuration
    ) {
      const durationDiff =
        lectureDataUpdate.videoDuration - oldLecture.videoDuration;

      await Course.findByIdAndUpdate(
        oldLecture.courseId,
        { $inc: { totalDuration: durationDiff } },
        { session }
      );
    }

    await session.commitTransaction();

    const populatedLecture = await Lecture.findById(updatedLecture._id)
      .select(updateFields)
      .populate("chapterId", "title description")
      .populate("courseId", "title slug description")
      .exec();

    return populatedLecture;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating lecture:", error);
    throw new Error("Lỗi server, không thể cập nhật bài học");
  } finally {
    session.endSession();
  }
};

const deleteLectureByIdService = async (lectureId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const lecture = await Lecture.findById(lectureId).session(session);
    if (!lecture) throw new Error("Không tìm thấy bài giảng");

    const deletedLecture = await Lecture.delete(
      { _id: lectureId },
      { session }
    );

    await Course.findByIdAndUpdate(
      lecture.courseId,
      {
        $inc: {
          totalLectures: -1,
          totalDuration: -lecture.videoDuration,
        },
      },
      { session }
    );

    await session.commitTransaction();
    return deletedLecture;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error deleting lecture:", error);
    throw new Error("Lỗi server, không thể xóa bài học");
  } finally {
    session.endSession();
  }
};

export {
  getAllLecturesService,
  getLectureByIdService,
  createLectureService,
  updateLectureService,
  deleteLectureByIdService,
};
