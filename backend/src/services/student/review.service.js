import Review from "../../models/review.model.js";
import Enrollment from "../../models/enrollment.model.js";
import Course from "../../models/course.model.js";

const UpdateRatingCourse = async (courseId) => {
  try {
    const enrollments = await Enrollment.find({ courseId: courseId }).exec();
    const enrollmentIds = enrollments.map((enrollment) => enrollment._id);

    const stats = await Review.aggregate([
      {
        $match: {
          enrollmentId: { $in: enrollmentIds },
          deleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]).exec();

    let averageRating = 0;
    let totalReviews = 0;
    if (stats.length > 0) {
      averageRating = Math.round(stats[0].avgRating * 10) / 10;
      totalReviews = stats[0].totalReviews;
    }

    await Course.findByIdAndUpdate(courseId, {
      averageRating: averageRating,
      totalReviews: totalReviews,
    });
  } catch (error) {
    console.error("Error updating course rating:", error);
    throw new Error(
      "Lỗi server, không thể cập nhật average rating và total review khóa học"
    );
  }
};

const reviewFields =
  "_id userId enrollmentId rating comment createdAt updatedAt";

const createReviewService = async (userId, data) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: data.enrollmentId,
      userId: userId,
    });

    if (!enrollment) {
      throw new Error("Bạn chưa mua khóa học này");
    }

    const review = await Review.create({
      userId,
      ...data,
    });

    const populatedReview = await Review.findById(review._id)
      .select(reviewFields)
      .populate("userId", "fullName avatar")
      .populate({
        path: "enrollmentId",
        populate: { path: "courseId", select: "title slug thumbnail" },
      })
      .exec();

    await UpdateRatingCourse(enrollment.courseId);

    return populatedReview;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Lỗi server, không thể tạo đánh giá");
  }
};

const updateReviewService = async (reviewId, rating, comment) => {
  try {
    const existingReview = await Review.findById(reviewId)
      .populate({
        path: "enrollmentId",
        select: "courseId",
        populate: {
          path: "courseId",
          select: "_id",
        },
      })
      .exec();

    if (!existingReview) {
      console.error("Review not found for deletion:", reviewId);
      throw new Error("Bạn chưa đánh giá khóa học này");
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    )
      .select(reviewFields)
      .populate("userId", "fullName avatar")
      .populate({
        path: "enrollmentId",
        select: "courseId",
        populate: {
          path: "courseId",
          select: "title slug thumbnail",
        },
      });

    await UpdateRatingCourse(existingReview.enrollmentId.courseId);

    return updatedReview;
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error("Lỗi server, không thể cập nhật đánh giá");
  }
};

const deleteReviewService = async (reviewId) => {
  try {
    const existingReview = await Review.findById(reviewId)
      .populate({
        path: "enrollmentId",
        select: "courseId",
        populate: {
          path: "courseId",
          select: "_id",
        },
      })
      .exec();

    if (!existingReview) {
      console.error("Review not found for deletion:", reviewId);
      throw new Error("Bạn chưa đánh giá khóa học này");
    }
    const deletedReview = await Review.deleteById(reviewId);
    await UpdateRatingCourse(existingReview.enrollmentId.courseId);
    return deletedReview;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Lỗi server, không thể xóa đánh giá");
  }
};

export { createReviewService, updateReviewService, deleteReviewService };
