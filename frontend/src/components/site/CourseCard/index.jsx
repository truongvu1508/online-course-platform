import { FaStar } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";
import { FaBookOpenReader, FaUserGraduate } from "react-icons/fa6";
import { formatDuration, formatVND } from "../../../utils/formatters";
import ReactStars from "react-stars";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/khoa-hoc/${course.slug}`);
  };

  return (
    <div
      className="course-card bg-white rounded-md hover:shadow-primary shadow-ms hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="w-full h-50 overflow-hidden rounded-t-md relative">
        {/* {isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            MỚI
          </div>
        )}
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            -{discountPercent}%
          </div>
        )} */}
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
          {course.discount} %
        </div>
        <img
          className="w-full h-full object-cover border border-gray-200 transition-transform duration-300 hover:scale-110"
          src={course.thumbnail}
          alt=""
        />
      </div>
      <div className="px-3 py-2">
        <h3 className="text-lg font-[600] text-primary hover:text-primary-700 transition-colors duration-200">
          {course.title}
        </h3>
        <h4 className="text-sm text-primary-400 truncate">
          {course.shortDescription}
        </h4>
        <div className="flex justify-between mt-2">
          <p className="text-gray-500 text-base">CodeLearn</p>
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center gap-1">
              <ReactStars
                count={5}
                value={course.averageRating}
                size={24}
                half={true}
                edit={false}
              />{" "}
              <span className="text-primary font-semibold">
                {course.averageRating}
              </span>
            </div>
            <p className="text-gray-500">({course.totalReviews})</p>
          </div>
        </div>
        <div className="flex items-center justify-center text-sm gap-4 py-4 border-b border-primary">
          <div className="flex items-center gap-2">
            <FaUserGraduate className="text-primary" />
            <p className="text-sm">
              <span className="font-[500]">{course.totalStudents}</span> học
              viên
            </p>
          </div>
          <div className="h-4 w-px bg-gray-500/40"></div>
          <div className="flex items-center gap-2">
            <CiClock1 className="text-primary" />
            <p className="text-sm">
              <span className="font-[500]">
                {formatDuration(course.totalDuration)}
              </span>
            </p>
          </div>
          <div className="h-4 w-px bg-gray-500/40"></div>
          <div className="flex items-center gap-2">
            <FaBookOpenReader className="text-primary" />
            <p className="text-sm">
              <span className="font-[500]">{course.totalLectures}</span> bài
              giảng
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <p className="text-lg font-[600] text-primary">
            {formatVND(course.finalPrice)}
          </p>
          <p className="text-base line-through text-gray-500">
            {formatVND(course.price)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
