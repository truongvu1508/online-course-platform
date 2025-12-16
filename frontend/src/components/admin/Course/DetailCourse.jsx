import React, { useState } from "react";
import { Button, Divider, Spin, Tag } from "antd";
import UpdateCourse from "./UpdateCourse";
import Flag from "react-world-flags";

const DetailCourse = ({ course, fetchCourseDetail }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getLevelLabel = (level) => {
    const levelMap = {
      beginner: { text: "Cơ bản", color: "blue" },
      intermediate: { text: "Trung cấp", color: "orange" },
      advanced: { text: "Trình độ cao", color: "red" },
    };
    return levelMap[level] || { text: level, color: "default" };
  };

  const getStatusCourseLabel = (status) => {
    const levelMap = {
      draft: { text: "Bản nháp", color: "default" },
      published: { text: "Đã xuất bản", color: "green" },
      archived: { text: "Đã lưu trữ", color: "orange" },
    };
    return levelMap[status] || { text: status, color: "default" };
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Thông tin khóa học
          </h2>
          <Button
            type="primary"
            size="large"
            onClick={() => setIsEditing(true)}
            className="rounded-lg"
          >
            Chỉnh sửa
          </Button>
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex gap-6">
            <div>
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-40 h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  Không có ảnh
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-2">{course.shortDescription}</p>
              <div className="flex gap-2 flex-wrap">
                {course.language === "vi" ? (
                  <div className="flex items-center gap-2">
                    <Flag code="VN" style={{ width: 30, height: 20 }} />
                    <p className="text-gray-600">Tiếng Việt</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Flag code="GB" style={{ width: 30, height: 20 }} />
                    <p className="text-gray-600">Tiếng Anh</p>
                  </div>
                )}
                <Divider type="vertical" style={{ height: 20 }} />
                <Tag color={getLevelLabel(course.level).color}>
                  {getLevelLabel(course.level).text}
                </Tag>
                <Divider type="vertical" style={{ height: 20 }} />
                <Tag color={getStatusCourseLabel(course.status).color}>
                  {getStatusCourseLabel(course.status).text}
                </Tag>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Slug</label>
            <p className="text-gray-600">{course.slug}</p>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <p className="text-gray-600">{course.categoryId?.name || "N/A"}</p>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Giá gốc (VNĐ)
            </label>
            <p className="text-gray-600">
              {course.price?.toLocaleString("vi-VN")}
            </p>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Giảm giá (%)
            </label>
            <p className="text-gray-600">{course.discount}%</p>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Giá bán (VNĐ)
            </label>
            <p className="text-lg font-bold text-green-600">
              {course.finalPrice?.toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-2">
              Link video xem trước
            </label>
            {course.previewVideo ? (
              <a
                href={course.previewVideo}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {course.previewVideo}
              </a>
            ) : (
              <p className="text-gray-600">Chưa có video xem trước</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-2">
              Mô tả ngắn
            </label>
            <p className="text-gray-600">{course.shortDescription || "N/A"}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <p className="text-gray-600 whitespace-pre-wrap">
              {course.description}
            </p>
          </div>

          {course.requirements && course.requirements.length > 0 && (
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-2">
                Yêu cầu
              </label>
              <ul className="list-disc list-inside text-gray-600">
                {course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <UpdateCourse
      course={course}
      onCancel={() => setIsEditing(false)}
      onSuccess={() => {
        setIsEditing(false);
        fetchCourseDetail();
      }}
    />
  );
};

export default DetailCourse;
