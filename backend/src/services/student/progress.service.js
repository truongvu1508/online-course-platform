import CourseProgress from "../../models/courseProgress.model.js";
import Enrollment from "../../models/enrollment.model.js";
import Lecture from "../../models/lecture.model.js";

const UpdateCourseProgressService = async (userId, enrollmentId, lectureId) => {
  try {
    const enrollment = await Enrollment.findOne({ _id: enrollmentId });
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    if (!enrollment.userId.equals(userId)) {
      throw new Error("Bạn không có quyền cập nhật tiến độ của enrollment này");
    }

    if (enrollment.status !== "active") {
      throw new Error("Cannot update progress for inactive enrollment");
    }

    const existingProgress = await CourseProgress.findOne({ enrollmentId });
    if (
      existingProgress &&
      existingProgress.completedLectures.some((id) => id.equals(lectureId))
    ) {
      throw new Error("Bài giảng này đã được hoàn thành");
    }

    const totalLectures = await Lecture.countDocuments({
      courseId: enrollment.courseId,
    });

    const progress = await CourseProgress.findOneAndUpdate(
      { enrollmentId },
      { $addToSet: { completedLectures: lectureId } },
      { new: true, upsert: true }
    ).populate("enrollmentId", "userId courseId");
    const completedCount = progress.completedLectures.length;

    const progressPercentage = Math.floor(
      (completedCount / totalLectures) * 100
    );
    enrollment.progress = progressPercentage;

    if (progressPercentage === 100) {
      enrollment.status = "completed";
    }
    await enrollment.save();
    return {
      CourseProgress: progress,
      enrollmentProgress: enrollment.progress,
    };
  } catch (error) {
    console.error("Error updating course progress:", error);
    throw error;
  }
};

export { UpdateCourseProgressService };
