import {
  verifyVNPayCallback,
  processVNPayCallback,
  getPaymentResult,
} from "../../services/student/payment.service.js";

//GET /api/payment/vnpay-callback
const handleVNPayCallback = async (req, res) => {
  try {
    const callbackData = req.query;

    if (!callbackData.vnp_TxnRef || !callbackData.vnp_ResponseCode) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu callback không hợp lệ",
      });
    }

    const isValidSignature = verifyVNPayCallback(callbackData);
    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: "Chữ ký không hợp lệ",
      });
    }

    const order = await processVNPayCallback(callbackData);

    const isSuccess = order.paymentStatus === "completed";
    const redirectUrl = `${process.env.FRONTEND_URL}/khoa-hoc-cua-toi`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error handling VNPay callback:", error);

    const redirectUrl = `${process.env.FRONTEND_URL}/payment/result?status=error`;
    return res.redirect(redirectUrl);
  }
};

//GET /api/payment/result/:orderNumber
const getPaymentResultByOrderNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: "Order number không hợp lệ",
      });
    }

    const order = await getPaymentResult(orderNumber);

    return res.status(200).json({
      success: true,
      message: "Lấy kết quả thanh toán thành công",
      data: order,
    });
  } catch (error) {
    console.error("Error getting payment result:", error);

    return res
      .status(error.message.includes("Không tìm thấy") ? 404 : 500)
      .json({
        success: false,
        message:
          error.message || "Lỗi server, không thể lấy kết quả thanh toán",
      });
  }
};

//POST /api/payment/verify
const verifyPaymentStatus = async (req, res) => {
  try {
    const { orderNumber } = req.body;
    const userId = req.user._id;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: "Order number không hợp lệ",
      });
    }

    const order = await getPaymentResult(orderNumber);

    if (order.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập đơn hàng này",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xác thực trạng thái thanh toán thành công",
      data: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status,
        total: order.total,
        paymentDetails: order.paymentDetails,
      },
    });
  } catch (error) {
    console.error("Error verifying payment status:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server, không thể xác thực thanh toán",
    });
  }
};

export {
  handleVNPayCallback,
  getPaymentResultByOrderNumber,
  verifyPaymentStatus,
};
