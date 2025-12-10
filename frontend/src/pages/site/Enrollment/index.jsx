import React, { useEffect, useState } from "react";
import { getEnrollmentService } from "../../../services/student/enrollment.service";
import { App } from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { formatDate, formatVND } from "../../../utils/formatters";

const EnrollmentPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEnrollment();
  }, []);

  const fetchEnrollment = async () => {
    try {
      setLoading(true);

      const res = await getEnrollmentService();
      console.log(res);

      if (res.success) {
        setEnrollments(res.data);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        label: "Đang học",
        bgColor: "bg-green-500",
        textColor: "text-green-500",
      },
      completed: {
        label: "Hoàn thành",
        bgColor: "bg-blue-500",
        textColor: "text-blue-500",
      },
      expired: {
        label: "Đã hết hạn",
        bgColor: "bg-gray-500",
        textColor: "text-gray-500",
      },
    };
    return (
      configs[status] || {
        label: status,
        bgColor: "bg-primary",
        textColor: "text-primary",
      }
    );
  };

  const handleNavigateToLearning = (slug, enrollmentId) => {
    navigate(`/hoc-tap/${slug}?enrollment=${enrollmentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <section className="min-h-screen fade-in-up">
      <div className="bg-secondary py-5">
        <div className="container">
          <h1 className="text-3xl font-bold text-white mb-2">
            Khóa học của tôi
          </h1>
          <p className="text-primary-200">
            Quản lý và tiếp tục học tập các khóa học đã đăng ký
          </p>
        </div>
      </div>
      <div className="container py-10">
        {enrollments?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaFileVideo className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-500 mb-6">
              Bạn chưa đăng ký khóa học nào. Hãy khám phá và đăng ký các khóa
              học phù hợp với bạn!
            </p>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/khoa-hoc")}
            >
              Khám phá khóa học
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments?.map((enrollment) => (
              <div
                key={enrollment._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-primary transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="flex gap-6 p-4">
                  <div>
                    <img
                      src={enrollment.courseId.thumbnail}
                      alt={enrollment.courseId.title}
                      className="w-64 h-40 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between mb-3">
                      <h3 className="text-xl font-semibold text-primary line-clamp-2">
                        {enrollment.courseId.title}
                      </h3>
                      <div
                        className={`${
                          getStatusConfig(enrollment.status).bgColor
                        } text-white px-3 py-1 rounded-full text-xs font-semibold`}
                      >
                        {getStatusConfig(enrollment.status).label}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Tiến độ học tập
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={enrollment.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#e0e0e0",
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Ngày đăng ký:</span>
                        <span className="font-medium text-gray-800">
                          {formatDate(enrollment.enrolledAt)}
                        </span>
                      </div>

                      {enrollment.expiresAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaClock className="text-primary" />
                          <span>Hết hạn:</span>
                          <span className="font-medium text-gray-800">
                            {formatDate(enrollment.expiresAt)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Giá:</span>
                        <span className="font-bold text-primary text-xl">
                          {formatVND(enrollment.courseId.finalPrice)}
                        </span>
                      </div>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToLearning(
                            enrollment.courseId.slug,
                            enrollment._id
                          );
                        }}
                      >
                        {enrollment.progress === 0
                          ? "Bắt đầu học"
                          : "Tiếp tục học"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EnrollmentPage;
