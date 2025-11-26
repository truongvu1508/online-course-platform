import { UpdateCourseProgressService } from "../../services/student/progress.service.js";

const UpdateCourseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { enrollmentId, lectureId } = req.body;
    const progress = await UpdateCourseProgressService(
      userId,
      enrollmentId,
      lectureId
    );
    return res.status(200).json({
      success: true,
      message: "Cập nhật tiến độ khóa học thành công",
      data: progress,
    });
  } catch (error) {
    console.error("Error updating course progress:", error);
    return res.status(400).json({
      success: false,
      message:
        error.message || "Lỗi server, không thể cập nhật tiến độ khóa học",
    });
  }
};

export { UpdateCourseProgress };
