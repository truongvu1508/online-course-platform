import {
  createReviewService,
  updateReviewService,
  deleteReviewService,
} from "../../services/student/review.service.js";

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;

    const review = await createReviewService(userId, data);

    return res.status(201).json({
      success: true,
      message: "Tạo đánh giá thành công",
      data: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi server, không thể tạo đánh giá",
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.Id;
    let { rating, comment } = req.body;

    const updatedReview = await updateReviewService(reviewId, rating, comment);

    return res.status(200).json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi server, không thể cập nhật đánh giá",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.Id;

    const deletedReview = await deleteReviewService(reviewId);

    return res.status(200).json({
      success: true,
      message: "Xóa đánh giá thành công",
      data: deletedReview,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi server, không thể xóa đánh giá",
    });
  }
};

export { createReview, updateReview, deleteReview };
