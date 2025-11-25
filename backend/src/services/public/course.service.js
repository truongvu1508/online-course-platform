import Course from "../../models/course.model.js";
import aqp from "api-query-params";
import {
  processPartialSearch,
  COURSE_SEARCHABLE_FIELDS,
  COURSE_EXACT_MATCH_FIELDS,
} from "../../utils/query.helper.js";
import Lecture from "../../models/lecture.model.js";
import Chapter from "../../models/chapter.model.js";
import Review from "../../models/review.model.js";
import Enrollment from "../../models/enrollment.model.js";

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
        .map((lecture) => {
          if (lecture.isFree) {
            return {
              _id: lecture._id,
              title: lecture.title,
              description: lecture.description,
              order: lecture.order,
              videoDuration: lecture.videoDuration,
              videoUrl: lecture.videoUrl,
              content: lecture.content,
              isFree: true,
            };
          }

          return {
            _id: lecture._id,
            title: lecture.title,
            order: lecture.order,
            videoDuration: lecture.videoDuration,
            isFree: false,
          };
        }),
    }));

    return {
      ...course,
      curriculum: chaptersWithLectures,
    };
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

const getCourseReviewsService = async (courseId, limit, page) => {
  try {
    let result = null;

    const enrollments = await Enrollment.find({ courseId: courseId }).select(
      "_id"
    );
    const enrollmentIds = enrollments.map((enrollment) => enrollment._id);

    if (enrollmentIds.length === 0) {
      return {
        reviews: [],
        total: 0,
        totalPages: Math.ceil(0 / (limit || 10)),
        currentPage: Number(page) || 1,
        pageSize: Number(limit) || 10,
      };
    }

    if (limit && page) {
      let offset = (page - 1) * limit;

      const [reviews, totalReviews] = await Promise.all([
        Review.find({ enrollmentId: { $in: enrollmentIds } })
          .select("_id userId rating comment createdAt")
          .populate("userId", "fullName avatar")
          .limit(limit)
          .skip(offset)
          .sort({ createdAt: -1 })
          .exec(),

        Review.countDocuments({ enrollmentId: { $in: enrollmentIds } }),
      ]);

      result = {
        reviews,
        total: totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
        currentPage: Number(page),
        pageSize: Number(limit),
      };
    } else {
      const reviews = await Review.find({
        enrollmentId: { $in: enrollmentIds },
      })
        .select("_id userId rating comment createdAt")
        .populate("userId", "fullName avatar")
        .sort({ createdAt: -1 })
        .exec();

      result = {
        reviews,
        total: reviews.length,
      };
    }

    return result;
  } catch (error) {
    console.error("Error in getCourseReviewsService:", error);
    throw new Error("Không thể tải đánh giá khóa học");
  }
};

export {
  getCourseBestSellersService,
  getCourseNewestService,
  getAllPublicCoursesService,
  getCourseBySlugService,
  getCoursesRatingService,
  getCourseReviewsService,
};
