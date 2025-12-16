import Course from "../../models/course.model.js";
import aqp from "api-query-params";
import {
  processPartialSearch,
  COURSE_SEARCHABLE_FIELDS,
  COURSE_EXACT_MATCH_FIELDS,
} from "../../utils/query.helper.js";
import Chapter from "../../models/chapter.model.js";
import Lecture from "../../models/lecture.model.js";

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
        COURSE_SEARCHABLE_FIELDS,
        COURSE_EXACT_MATCH_FIELDS
      );

      const [courses, totalCourses] = await Promise.all([
        Course.find(processedFilter)
          .select(selectedFields)
          .populate("instructorId", "fullName avatar")
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
      .lean();

    if (!course) {
      return null;
    }

    const chapters = await Chapter.find({ courseId: course._id })
      .sort({ order: 1 })
      .lean();

    const lectures = await Lecture.find({ courseId: course._id })
      .sort({ order: 1 })
      .lean();

    const chaptersWithLectures = chapters.map((chapter) => ({
      ...chapter,
      lectures: lectures
        .filter(
          (lecture) => lecture.chapterId.toString() === chapter._id.toString()
        )
        .map((lecture) => ({
          _id: lecture._id,
          title: lecture.title,
          description: lecture.description,
          order: lecture.order,
          videoDuration: lecture.videoDuration,
          videoUrl: lecture.videoUrl,
          content: lecture.content,
          isFree: lecture.isFree,
        })),
    }));

    return {
      ...course,
      curriculum: chaptersWithLectures,
    };
  } catch (error) {
    throw new Error(error);
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

// public service
const publicSelectedFields =
  "_id title slug shortDescription thumbnail previewVideo instructorId categoryId level language price discount finalPrice totalLectures totalDuration totalStudents totalReviews averageRating publishedAt";

const getAllPublicCoursesService = async (limit, page, queryString) => {
  try {
    let result = null;

    if (limit && page) {
      const { filter } = aqp(queryString);

      delete filter.page;
      let offset = (page - 1) * limit;

      const processedFilter = processPartialSearch(
        filter,
        COURSE_SEARCHABLE_FIELDS,
        COURSE_EXACT_MATCH_FIELDS
      );

      processedFilter.status = "published";
      processedFilter.isPublished = true;

      const [courses, totalCourses] = await Promise.all([
        Course.find(processedFilter)
          .select(publicSelectedFields)
          .populate("instructorId", "fullName avatar")
          .populate("categoryId", "name slug")
          .limit(limit)
          .skip(offset)
          .sort({ publishedAt: -1 })
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
      const courses = await Course.find({
        status: "published",
        isPublished: true,
      })
        .select(publicSelectedFields)
        .populate("instructorId", "fullName avatar")
        .populate("categoryId", "name slug")
        .sort({ publishedAt: -1 })
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

const getCourseBySlugService = async (slug) => {
  try {
    const course = await Course.findOne({
      slug: slug,
      status: "published",
      isPublished: true,
    })
      .select(
        "_id title slug description shortDescription thumbnail previewVideo instructorId categoryId level language price discount finalPrice requirements whatYouWillLearn targetAudience totalLectures totalDuration totalStudents totalReviews averageRating publishedAt"
      )
      .populate("instructorId", "fullName avatar")
      .populate("categoryId", "name slug description")
      .exec();

    return course;
  } catch (error) {
    throw new Error("Không thể tải thông tin khóa học");
  }
};

const getCourseBestSellersService = async () => {
  try {
    const bestsellerCourses = await Course.find({
      status: "published",
      isPublished: true,
    })
      .select(publicSelectedFields)
      .sort({ totalStudents: -1 })
      .limit(4)
      .exec();

    return bestsellerCourses;
  } catch (error) {
    throw new Error("Không thể tải các khóa học bán chạy");
  }
};

const getCourseNewestService = async () => {
  try {
    const newestCourses = await Course.find({
      status: "published",
      isPublished: true,
    })
      .select(publicSelectedFields)
      .sort({ createdAt: -1 })
      .limit(4)
      .exec();

    return newestCourses;
  } catch (error) {
    throw new Error("Không thể tải các khóa học mới nhất");
  }
};

const getCoursesRatingService = async () => {
  try {
    const ratingCourses = await Course.find({
      status: "published",
      isPublished: true,
      averageRating: { $gte: 4.5 },
    })
      .select(publicSelectedFields)
      .sort({ averageRating: -1 })
      .limit(4)
      .exec();

    return ratingCourses;
  } catch (error) {
    throw new Error("Không thể tải các khóa học nổi bật");
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
  getAllPublicCoursesService,
  getCourseBySlugService,
  getCoursesRatingService,
};
