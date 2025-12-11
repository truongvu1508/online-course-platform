/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useSearchParams } from "react-router-dom";
import { App } from "antd";
import { getEnrollmentByIdService } from "../../../services/student/enrollment.service";
import LinearProgress from "@mui/material/LinearProgress";
import { formatDate, formatTime } from "../../../utils/formatters";
import Divider from "@mui/material/Divider";
import { FaCheckCircle, FaFileVideo } from "react-icons/fa";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import YouTube from "react-youtube";
import { updateEnrollmentProgress } from "../../../services/student/progress.service";
import Button from "@mui/material/Button";

const EnrollmentDetailPage = () => {
  const { message } = App.useApp();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCompletedLecture, setLoadingCompletedLecture] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const enrollmentId = searchParams.get("enrollment");
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    if (enrollmentId) {
      fetchEnrollmentDetail();
    } else {
      message.error("Không tìm thấy thông tin đăng ký");
      navigate("/khoa-hoc-cua-toi");
    }
  }, [enrollmentId]);

  const fetchEnrollmentDetail = async () => {
    try {
      setLoading(true);

      const res = await getEnrollmentByIdService(enrollmentId);

      if (res.success) {
        setEnrollment(res.data);
      } else {
        message.error(res.message);
        navigate("khoa-hoc-cua-toi");
      }
    } catch (error) {
      message.error("Không thể tải thông tin khóa học");
      navigate("khoa-hoc-cua-toi");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async (lectureId) => {
    try {
      setLoadingCompletedLecture(true);
      const res = await updateEnrollmentProgress(enrollmentId, lectureId);

      if (res.success) {
        message.success("Đã đánh dấu hoàn thành bài giảng");
        await fetchEnrollmentDetail();
      } else {
        message.warning(res.message);
      }
    } catch (error) {
      message.error("Không thể cập nhật tiến độ");
    } finally {
      setLoadingCompletedLecture(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        label: "Đang học",
        bgColor: "bg-green-500",
      },
      completed: {
        label: "Hoàn thành",
        bgColor: "bg-blue-500",
      },
      expired: {
        label: "Đã hết hạn",
        bgColor: "bg-gray-500",
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

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeOpts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!enrollment) {
    return null;
  }

  const course = enrollment.courseId;
  console.log(course);

  return (
    <section className="min-h-screen fade-in-up">
      <div className="bg-secondary py-5">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="">Tiếp tục học nào</p>
            </div>
            <div
              className={`${
                getStatusConfig(enrollment.status).bgColor
              } text-white px-4 py-2 rounded-full text-sm font-semibold`}
            >
              {getStatusConfig(enrollment.status).label}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-primary">
                Tiến độ học tập
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-gray-600">Ngày đăng ký</p>
                <p className="font-semibold text-primary">
                  {formatDate(enrollment.enrolledAt)}
                </p>
              </div>
              <span className="text-2xl font-bold text-primary">
                {enrollment.progress}%
              </span>
            </div>
            <LinearProgress
              variant="determinate"
              value={enrollment.progress}
              sx={{ height: 12, borderRadius: 6, backgroundColor: "#e0e0e0" }}
            />
          </div>
        </div>
      </div>
      <div className="container py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="relative w-full aspect-video bg-black">
              {currentVideo ? (
                <YouTube
                  videoId={getYouTubeVideoId(currentVideo.videoUrl)}
                  opts={youtubeOpts}
                  className="absolute top-0 left-0 w-full h-full"
                />
              ) : (
                <img
                  className="w-full"
                  src={course.thumbnail}
                  alt={course.title}
                />
              )}
            </div>
            {currentVideo && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-primary">
                    {currentVideo.title}
                  </h2>
                  <span className="text-sm text-gray-600">
                    {formatTime(currentVideo.videoDuration)}
                  </span>
                </div>
                {currentVideo.content && (
                  <p className="text-gray-700 mb-4 whitespace-pre-line">
                    {currentVideo.content}
                  </p>
                )}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    currentVideo.isCompleted ? <FaCheckCircle /> : null
                  }
                  onClick={() => handleCompleteLesson(currentVideo._id)}
                  disabled={currentVideo.isCompleted}
                  className="!w-full"
                  loading={loadingCompletedLecture}
                >
                  {currentVideo.isCompleted
                    ? "Đã hoàn thành"
                    : "Đánh dấu hoàn thành"}
                </Button>
              </div>
            )}
          </div>
          <div className="col-span-4">
            <div className="rounded-lg shadow-md overflow-hidden">
              <div className="bg-white border-b border-primary text-primary p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold mb-2">
                  Nội dung khóa học
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span>{course.curriculum.length} chương</span>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      height: 20,
                      borderColor: "#ddd",
                      alignSelf: "center",
                    }}
                  />
                  <span>
                    {course.curriculum.reduce(
                      (total, section) => total + section.lectures.length,
                      0
                    )}{" "}
                    bài
                  </span>
                </div>
              </div>
              <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                {course.curriculum.map((section, index) => (
                  <Accordion key={section._id} defaultExpanded={index === 0}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ padding: "12px 16px" }}
                    >
                      <div className="w-full">
                        <h4 className="font-semibold text-base text-primary">
                          {section.order}. {section.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Hoàn thành{" "}
                          {
                            section.lectures.filter(
                              (lecture) => lecture.isCompleted
                            ).length
                          }
                          /{section.lectures.length} bài giảng
                        </p>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: 0 }}>
                      <div>
                        {section.lectures.length > 0 ? (
                          section.lectures.map((lecture) => (
                            <div
                              key={lecture._id}
                              className={`flex items-center justify-between py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                                currentVideo?._id === lecture._id
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                              onClick={() => setCurrentVideo(lecture)}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {lecture.isCompleted ? (
                                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                ) : (
                                  <FaFileVideo className="text-primary flex-shrink-0" />
                                )}
                                <span className="text-sm line-clamp-2">
                                  {lecture.order}. {lecture.title}
                                </span>
                              </div>
                              <span className="text-xs text-gray-600 ml-2 flex-shrink-0">
                                {formatTime(lecture.videoDuration)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm italic py-3 px-4">
                            Chưa có bài giảng
                          </p>
                        )}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnrollmentDetailPage;
