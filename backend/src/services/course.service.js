import Course from "../models/course.model.js";
import aqp from "api-query-params";
import {
  processPartialSearch,
  COURSE_SEARCHABLE_FIELDS,
} from "../utils/query.helper.js";

const selectedFields =
  "_id title slug description shortDescription thumbnail previewVideo instructorId categoryId level language price discount finalPrice requirements totalLectures totalDuration totalStudents totalReviews averageRating status isPublished publishedAt createdAt updatedAt";

const getAllCoursesService = async (limit, page, queryString) => {
  try {
    let result = null;

    if (limit && page) {
      const { filter } = aqp(queryString);

      delete filter.page;
      let offset = (page - 1) * limit;
      const processedFilter = processPartialSearch(
        filter,
        COURSE_SEARCHABLE_FIELDS
      );

      const [courses, totalCourses] = await Promise.all([
        Course.find(processedFilter)
          .select(selectedFields)
          .populate("instructorId", "fullName email avatar")
          .populate("categoryId", "name slug")
          .limit(limit)
          .skip(offset)
          .sort({ createdAt: -1 })
          .exec(),
        Course.countDocuments(processedFilter),
      ]);

      result = {
        courses,
        total: totalCourses,
        totalPages: Math.ceil(totalCourses / limit),
        currentPage: Number(page),
        pageSize: Number(limit),
      };
    } else {
      const courses = await Course.find({})
        .select(selectedFields)
        .populate("instructorId", "fullName email avatar")
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 })
        .exec();
      result = {
        courses,
        total: courses.length,
      };
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const getCourseByIdService = async (courseId) => {
  try {
    const course = await Course.findById(courseId)
      .select(selectedFields)
      .populate("instructorId", "fullName email avatar")
      .populate("categoryId", "name slug description")
      .exec();

    return course;
  } catch (error) {
    throw new Error("Không thể tải thông tin khóa học");
  }
};

const createCourseService = async (courseData) => {
  const createFields =
    "_id title slug thumbnail instructorId categoryId level language price discount finalPrice status isPublished createdAt";
  try {
    const newCourse = await Course.create(courseData);

    // Populate sau khi tạo để trả về đầy đủ thông tin
    const populatedCourse = await Course.findById(newCourse._id)
      .select(createFields)
      .populate("instructorId", "fullName email avatar")
      .populate("categoryId", "name slug")
      .exec();

    return populatedCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

const updateCourseService = async (courseId, courseDataUpdate) => {
  const updateFields =
    "_id title slug thumbnail previewVideo instructorId categoryId level language price discount finalPrice status isPublished updatedAt";
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: courseDataUpdate },
      { new: true, runValidators: true }
    )
      .select(updateFields)
      .populate("instructorId", "fullName email avatar")
      .populate("categoryId", "name slug")
      .exec();

    return updatedCourse;
  } catch (error) {
    console.error("Error updating course:", error);
    throw new Error("Lỗi server, không thể cập nhật khóa học");
  }
};

const deleteCourseByIdService = async (courseId) => {
  try {
    const courseDelete = await Course.deleteById({ _id: courseId });
    return courseDelete;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw new Error("Lỗi server, không thể xóa khóa học");
  }
};

const getCourseBestSellersService = async () => {
  try {
    const bestsellers = await Course.find({
      status: "published",
      isPublished: true,
    })
      .sort({ totalStudents: -1 })
      .limit(6)
      .exec();

    return bestsellers;
  } catch (error) {
    throw new Error("Không thể tải các khóa học bán chạy");
  }
};

const getCourseNewestService = async () => {
  try {
    const newest = await Course.find({ status: "published", isPublished: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .exec();

    return newest;
  } catch (error) {
    throw new Error("Không thể tải các khóa học mới nhất");
  }
};

export {
  getAllCoursesService,
  getCourseByIdService,
  getCourseBestSellersService,
  getCourseNewestService,
  createCourseService,
  updateCourseService,
  deleteCourseByIdService,
};
