import { FaStar } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";
import { FaBookOpenReader, FaUserGraduate } from "react-icons/fa6";
import { formatVND } from "../../../utils/formatters";

const CourseCard = () => {
  return (
    <div className="course-card bg-white rounded-md shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
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
          -30%
        </div>
        <img
          className="w-full h-full object-cover border border-gray-200 transition-transform duration-300 hover:scale-110"
          src="https://res.cloudinary.com/dopxef4b6/image/upload/v1747145315/ipumjmcyj43ytnshlutv.webp"
          alt=""
        />
      </div>
      <div className="px-3 py-2">
        <h3 className="text-lg font-[600] text-primary hover:text-primary-700 transition-colors duration-200">
          Tên Khóa Học
        </h3>
        <h4 className="text-sm text-primary-400 truncate">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto,
          nemo.
        </h4>
        <div className="flex justify-between mt-2">
          <p className="text-gray-500 text-base">CodeLearn</p>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < 3 ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaStar className="text-gray-300" />
                  )}
                </span>
              ))}
            </div>
            <p className="text-gray-500">(5)</p>
          </div>
        </div>
        <div className="flex items-center justify-center text-sm gap-4 py-4 border-b border-primary">
          <div className="flex items-center gap-2">
            <FaUserGraduate className="text-primary" />
            <p className="text-sm">
              <span className="font-[500]">0</span> học viên
            </p>
          </div>
          <div className="h-4 w-px bg-gray-500/40"></div>
          <div className="flex items-center gap-2">
            <CiClock1 className="text-primary" />
            <p className="text-sm">
              <span className="font-[500]">0</span>
            </p>
          </div>
          <div className="h-4 w-px bg-gray-500/40"></div>
          <div className="flex items-center gap-2">
            <FaBookOpenReader className="text-primary" />
            <p className="text-sm">
              <span className="font-[500]">0</span> bài giảng
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <p className="text-lg font-[600] text-primary">
            {formatVND(5000000)}
          </p>
          <p className="text-base line-through text-gray-500">
            {formatVND(5000000)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
