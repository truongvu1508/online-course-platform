import { Table, Tag } from "antd";
import React from "react";
import { formatDateTime } from "../../../utils/formatters";
import LinearProgress from "@mui/material/LinearProgress";

const EnrollmentCourse = (props) => {
  const {
    enrollment,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    total,
    loadingEnrollment,
  } = props;

  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: ["userId", "avatar"],
      key: "avatar",
      width: "10%",
      render: (avatar) => (
        <img
          src={avatar}
          alt="avatar"
          className="w-12 h-12 object-cover rounded-full"
        />
      ),
    },
    {
      title: "Họ tên",
      dataIndex: ["userId", "fullName"],
      key: "fullName",
      width: "20%",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: ["userId", "email"],
      key: "email",
      width: "22%",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      width: "15%",
      render: (date) => (
        <span className="text-gray-600">{formatDateTime(date)}</span>
      ),
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      width: "12%",
      align: "center",
      render: (progress) => (
        <div className="flex items-center gap-2">
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: 100,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#e0e0e0",
            }}
          />
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      align: "center",
      render: (status) => {
        const statusConfig = {
          active: { color: "green", text: "Đang học" },
          completed: { color: "blue", text: "Hoàn thành" },
          expired: { color: "red", text: "Hết hạn" },
          suspended: { color: "orange", text: "Tạm ngưng" },
        };

        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };

        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Danh sách học viên
      </h2>
      <Table
        columns={columns}
        dataSource={enrollment}
        loading={loadingEnrollment}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} học viên`,
        }}
        onChange={handleTableChange}
        className="rounded-lg overflow-hidden shadow-sm"
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default EnrollmentCourse;
