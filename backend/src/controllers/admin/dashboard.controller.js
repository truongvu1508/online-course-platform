import User from "../../models/users.model.js";
import Course from "../../models/course.model.js";
import Category from "../../models/category.model.js";
import Order from "../../models/order.model.js";
import Enrollment from "../../models/enrollment.model.js";

// GET /admin/dashboard/stats
const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });

    const totalCourses = await Course.countDocuments();

    const totalCategories = await Category.countDocuments();

    const totalOrders = await Order.countDocuments({ status: "paid" });

    const revenueResult = await Order.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      message: "Lấy thống kê thành công",
      data: {
        totalStudents,
        totalCourses,
        totalCategories,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /admin/dashboard/revenue-chart
const getRevenueChart = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: "$_id",
          revenue: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    const chartData = [];
    for (let i = 1; i <= 12; i++) {
      const data = revenueData.find((d) => d.month === i);
      chartData.push({
        month: `Tháng ${i}`,
        revenue: data?.revenue || 0,
        orderCount: data?.orderCount || 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /admin/dashboard/student-chart
const getStudentChart = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const studentData = await Enrollment.aggregate([
      {
        $match: {
          enrolledAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$enrolledAt" },
          enrollmentCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: "$_id",
          enrollmentCount: 1,
          _id: 0,
        },
      },
    ]);

    const chartData = [];
    for (let i = 1; i <= 12; i++) {
      const data = studentData.find((d) => d.month === i);
      chartData.push({
        month: `Tháng ${i}`,
        enrollmentCount: data?.enrollmentCount || 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getStats, getRevenueChart, getStudentChart };
