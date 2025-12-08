import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { App } from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import { PiStudentFill } from "react-icons/pi";
import { FaGlobe, FaFileVideo, FaPlayCircle } from "react-icons/fa";
import { RiTimeLine } from "react-icons/ri";
import { IoInfinite } from "react-icons/io5";
import ReactStars from "react-stars";
import Divider from "@mui/material/Divider";
import { getCourseBySlugPublic } from "../../../services/public/course.service";
import {
  formatDuration,
  formatTime,
  formatVND,
} from "../../../utils/formatters";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchCourseDetail();
    }
  }, [slug]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await getCourseBySlugPublic(slug);

      if (res.success) {
        setCourse(res.data);
      } else {
        message.error(res.message);
        navigate("/khoa-hoc");
      }
    } catch (error) {
      message.error("Không thể tải thông tin khóa học");
      navigate("/khoa-hoc");
    } finally {
      setLoading(false);
    }
  };

  const COURSE_LANGUAGES = [
    { value: "vi", label: "Tiếng Việt" },
    { value: "en", label: "Tiếng Anh" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const getLevelConfig = (level) => {
    const configs = {
      beginner: {
        label: "Người mới bắt đầu",
        bgColor: "bg-green-500",
      },
      intermediate: {
        label: "Trung cấp",
        bgColor: "bg-blue-500",
      },
      advanced: {
        label: "Nâng cao",
        bgColor: "bg-purple-500",
      },
    };
    return configs[level] || { label: level, bgColor: "bg-primary" };
  };

  console.log(course);

  return (
    <section className="min-h-screen fade-in-up">
      <div className="bg-secondary py-10 relative">
        <div className="container grid grid-cols-12">
          <div className="text-white col-span-8">
            <div
              className={`inline-block ${
                getLevelConfig(course.level).bgColor
              } text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-[16px]`}
            >
              {getLevelConfig(course.level).label}
            </div>
            <h1 className="text-3xl mb-[16px] font-semibold">{course.title}</h1>
            <p className="text-lg mb-[16px]">{course.shortDescription}</p>
            <div className="flex items-center gap-4 mb-[16px]">
              <div className="flex items-center gap-1">
                <span className="text-base text-[#FFD700] font-semibold">
                  {course.averageRating}
                </span>
                <ReactStars
                  count={5}
                  value={course.averageRating}
                  size={24}
                  half={true}
                  edit={false}
                />
                <span className="text-primary-200">
                  ({course.totalReviews} đánh giá)
                </span>
              </div>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: 30, borderColor: "#fff", alignSelf: "center" }}
              />
              <div className="flex items-center gap-1">
                <PiStudentFill className="text-lg" />
                <span>{course.totalStudents} học viên</span>
              </div>
            </div>
            <p className="text-sm mb-[16px]">
              Khóa học của{" "}
              <span className="text-primary-200 font-semibold underline cursor-pointer">
                {course.instructorId.fullName}
              </span>
            </p>
            <div className="flex items-center gap-2 text-sm">
              <FaGlobe />
              <span>
                Ngôn ngữ:{" "}
                {COURSE_LANGUAGES.map((courseLanguage) =>
                  courseLanguage.value === course.language ? (
                    <span key={courseLanguage.value}>
                      {courseLanguage.label}
                    </span>
                  ) : null
                )}
              </span>
            </div>
          </div>
          <div className="col-span-4 relative">
            <div className="absolute bg-white px-[5px] pt-[5px] pb-[20px] shadow-xl hover:shadow-primary transition-all duration-300 rounded-lg">
              <div className="">
                <img src={course.thumbnail} alt="" className="rounded-lg" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-[16px]">
                  <p className="text-2xl text-primary font-bold">
                    {formatVND(
                      course.price - (course.price * course.discount) / 100
                    )}
                  </p>
                  <p className="text-xl text-gray-500 font-bold line-through">
                    {formatVND(course.price)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 mb-[16px]">
                  <Button variant="contained" className="!w-full" size="large">
                    Thêm vào giỏ hàng
                  </Button>
                  <Button variant="outlined" className="!w-full" size="large">
                    Mua ngay
                  </Button>
                </div>
                <div>
                  <div className="flex justify-between items-center text-lg border-b-[2px] border-gray-200 py-2">
                    <div className="flex items-center gap-2 text-primary">
                      <FaFileVideo />
                      <p>Bài giảng</p>
                    </div>
                    <p className="text-primary font-semibold">
                      {course.totalLectures} bài
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-lg border-b-[2px] border-gray-200 py-2">
                    <div className="flex items-center gap-2 text-primary">
                      <RiTimeLine />
                      <p>Thời gian</p>
                    </div>
                    <p className="text-primary font-semibold">
                      {formatDuration(course.totalDuration)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-lg border-b-[2px] border-gray-200 py-2">
                    <div className="flex items-center gap-2 text-primary">
                      <IoInfinite />
                      <p>Sở hữu</p>
                    </div>
                    <p className="text-primary font-semibold">Trọn đời</p>
                  </div>
                  <div className="flex justify-between items-center text-lg border-b-[2px] border-gray-200 py-2">
                    <div className="flex items-center gap-2 text-primary">
                      <PiStudentFill />
                      <p>Học viên đã đăng ký</p>
                    </div>
                    <p className="text-primary font-semibold">
                      {course.totalStudents} học viên
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
              {course.discount} %
            </div>
          </div>
        </div>
      </div>
      <div className="container py-10">
        <div className="grid grid-cols-12 gap-9">
          <div className="col-span-8">
            <h2 className="text-2xl mb-[16px] font-semibold text-primary">
              Nội dung khóa học
            </h2>
            <div className="flex items-center gap-2 text-base mb-[16px]">
              <p>{course.curriculum.length} chương</p>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: 20, borderColor: "#ddd", alignSelf: "center" }}
              />
              <p>{course.totalLectures} bài giảng</p>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: 20, borderColor: "#ddd", alignSelf: "center" }}
              />
              <p>{formatDuration(course.totalDuration)}</p>
            </div>
            <div className="mb-[36px]">
              {course.curriculum.map((section, index) => (
                <Accordion key={section._id} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="flex justify-between w-full items-center pr-4">
                      <h3 className="font-medium text-lg">
                        {section.order}. {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.lectures.length} bài giảng
                      </p>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex flex-col gap-2">
                      {section.lectures.length > 0 ? (
                        section.lectures.map((lecture) => (
                          <div
                            key={lecture._id}
                            className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FaFileVideo className="text-primary" />
                              <span className="text-base">
                                {lecture.order}. {lecture.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-8">
                              {lecture.isFree && (
                                <div className="flex items-center justify-center gap-2 text-sm text-primary font-semibold ">
                                  <FaPlayCircle />
                                  <Link
                                    to={lecture.videoUrl}
                                    className=" hover:text-primary-300"
                                  >
                                    <span className="underline">Học thử</span>
                                  </Link>
                                </div>
                              )}
                              <span className="text-sm text-gray-600">
                                {formatTime(lecture.videoDuration)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-primary italic py-2">
                          Chưa có bài giảng
                        </p>
                      )}
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Mô tả
              </h2>

              <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line">
                {course.description}
              </p>
            </div>
          </div>
          <div className="col-span-4"></div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetailPage;
