/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Select, Spin } from "antd";
import {
  getStatsService,
  getRevenueChartService,
  getStudentChartService,
} from "../../../services/admin/dashboard.service";
import { formatVND } from "../../../utils/formatters";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());
  const [studentYear, setStudentYear] = useState(new Date().getFullYear());

  const [revenueChartLoading, setRevenueChartLoading] = useState(false);
  const [studentChartLoading, setStudentChartLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadRevenueChart();
  }, [revenueYear]);

  useEffect(() => {
    loadStudentChart();
  }, [studentYear]);

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getStatsService();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Load stats error:", error);
      showNotification("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const loadRevenueChart = async () => {
    try {
      setRevenueChartLoading(true);
      setRevenueData([]);

      const revenueRes = await getRevenueChartService(revenueYear);
      setRevenueData(revenueRes.success ? revenueRes.data : []);
    } catch (error) {
      console.error("Load revenue chart error:", error);
      setRevenueData([]);
    } finally {
      setRevenueChartLoading(false);
    }
  };

  const loadStudentChart = async () => {
    try {
      setStudentChartLoading(true);
      setStudentData([]);

      const studentRes = await getStudentChartService(studentYear);
      setStudentData(studentRes.success ? studentRes.data : []);
    } catch (error) {
      console.error("Load student chart error:", error);
      setStudentData([]);
    } finally {
      setStudentChartLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Tổng học viên</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalStudents}
              </p>
            </div>
            <PersonIcon
              sx={{ width: 50, height: 50 }}
              className="text-primary"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Tổng khóa học</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalCourses}
              </p>
            </div>
            <AutoStoriesIcon
              sx={{ width: 50, height: 50 }}
              className="text-primary"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Tổng danh mục</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalCategories}
              </p>
            </div>
            <CollectionsBookmarkIcon
              sx={{ width: 50, height: 50 }}
              className="text-primary"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalOrders}
              </p>
            </div>
            <ShoppingCartIcon
              sx={{ width: 50, height: 50 }}
              className="text-primary"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <p className="text-gray-500 text-sm mb-1">Tổng doanh thu</p>
        <p className="text-2xl font-bold text-primary">
          {formatVND(stats.totalRevenue)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 text-lg">
              Doanh thu theo tháng
            </h3>
            <Select
              value={revenueYear}
              options={yearOptions.map((y) => ({ label: y, value: y }))}
              onChange={(value) => setRevenueYear(Number(value))}
            />
          </div>

          {revenueChartLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <Spin />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => value.toLocaleString("vi-VN") + " ₫"}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#512DA8"
                  name="Doanh thu"
                  strokeWidth={2}
                  dot={{ fill: "#512DA8", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 text-lg">
              Đăng ký học viên theo tháng
            </h3>
            <Select
              value={studentYear}
              options={yearOptions.map((y) => ({ label: y, value: y }))}
              onChange={(value) => setStudentYear(Number(value))}
            />
          </div>

          {studentChartLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <Spin />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="enrollmentCount"
                  fill="#512DA8"
                  name="Số học viên"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
