import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";
import Order from "../../models/order.model.js";

const initiateVNPayPayment = async (order) => {
  try {
    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TMNCODE,
      secureSecret: process.env.VNP_HASHSECRET,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: order.total * 100,
      vnp_IpAddr: "127.0.0.1",
      vnp_TxnRef: order.orderNumber,
      vnp_OrderInfo: `Thanh toan don hang ${order.orderNumber}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `${process.env.BASE_URL}/api/payment/vnpay-callback`,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });

    return paymentUrl;
  } catch (error) {
    console.error("Error initiating VNPay payment:", error);
    throw new Error("Lỗi khởi tạo VNPay: " + error.message);
  }
};

const verifyVNPayCallback = (queryParams) => {
  try {
    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TMNCODE,
      secureSecret: process.env.VNP_HASHSECRET,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const verify = vnpay.verifyReturnUrl(queryParams);
    return verify.isVerified;
  } catch (error) {
    console.error("Error verifying VNPay signature:", error);
    return false;
  }
};

const processVNPayCallback = async (callbackData) => {
  try {
    const {
      vnp_ResponseCode,
      vnp_TxnRef,
      vnp_TransactionNo,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_PayDate,
      vnp_TransactionStatus,
    } = callbackData;

    const order = await Order.findOne({ orderNumber: vnp_TxnRef });
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.paymentStatus === "completed") {
      throw new Error("Đơn hàng đã được thanh toán trước đó");
    }

    if (vnp_ResponseCode === "00") {
      order.paymentStatus = "completed";
      order.status = "paid";
      order.paymentDetails = {
        transactionId: vnp_TransactionNo,
        paymentGateway: "vnpay",
        paidAt: new Date(),
        bankCode: vnp_BankCode,
        bankTranNo: vnp_BankTranNo,
        cardType: vnp_CardType,
        payDate: vnp_PayDate,
        responseCode: vnp_ResponseCode,
        transactionStatus: vnp_TransactionStatus,
      };
    } else {
      order.paymentStatus = "failed";
      order.status = "unpaid";
      order.paymentDetails = {
        responseCode: vnp_ResponseCode,
        transactionStatus: vnp_TransactionStatus,
        paymentGateway: "vnpay",
        failedAt: new Date(),
      };
    }

    await order.save();
    return order;
  } catch (error) {
    console.error("Error processing VNPay callback:", error);
    throw error;
  }
};

const getPaymentResult = async (orderNumber) => {
  try {
    const order = await Order.findOne({ orderNumber })
      .select(
        "_id orderNumber total paymentStatus status paymentDetails createdAt"
      )
      .populate("userId", "fullName email")
      .populate("items.courseId", "title slug thumbnail")
      .exec();

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    return order;
  } catch (error) {
    console.error("Error getting payment result:", error);
    throw error;
  }
};

export {
  initiateVNPayPayment,
  verifyVNPayCallback,
  processVNPayCallback,
  getPaymentResult,
};
