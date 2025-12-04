import { App, Button, Popconfirm, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { deleteCourseByIdService } from "../../../services/admin/course.service";
import { getAllCategoryService } from "../../../services/admin/category.service";

const TableCourse = (props) => {
  const {
    dataCourses,
    loading,
    loadCourse,
    setIsModalUpdateOpen,
    setDataUpdate,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    total,
    filterCategory,
    setFilterCategory,
  } = props;

  const { message, notification } = App.useApp();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getAllCategoryService(1, 100, "");
      if (res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Load categories error:", error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      const res = await deleteCourseByIdService(id);

      if (res.success) {
        message.success("Xóa khóa học thành công");
        await loadCourse();
      } else {
        notification.error({
          message: "Xóa khóa học thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.log("Delete Course Error:", error);

      notification.error({
        message: "Xóa khóa học thất bại",
        description: error.message || "Không thể kết nối đến server",
        duration: 5,
      });
    }
  };

  const handleEditCourse = (record) => {
    setDataUpdate(record);
    setIsModalUpdateOpen(true);
  };

  const getLevelLabel = (level) => {
    const levelMap = {
      beginner: { text: "Cơ bản", color: "blue" },
      intermediate: { text: "Trung cấp", color: "orange" },
      advanced: { text: "Trình độ cao", color: "red" },
    };
    return levelMap[level] || { text: level, color: "default" };
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      draft: { text: "Bản nháp", color: "default" },
      published: { text: "Đã xuất bản", color: "green" },
      archived: { text: "Đã lưu trữ", color: "red" },
    };
    return statusMap[status] || { text: status, color: "default" };
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: "8%",
      render: (thumbnail) => (
        <img
          src={thumbnail}
          alt="thumbnail"
          className="w-12 h-12 object-cover rounded-lg"
        />
      ),
    },
    {
      title: "Tên khóa học",
      dataIndex: "title",
      key: "title",
      width: "18%",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Danh mục",
      dataIndex: ["categoryId", "name"],
      key: "categoryId",
      width: "12%",
      render: (text) => <span className="text-gray-600">{text}</span>,
      filters: categories.map((cat) => ({
        text: cat.name,
        value: cat._id,
      })),
      onFilter: (value, record) => {
        if (!filterCategory) return true;
        return record.categoryId?._id === filterCategory;
      },
    },
    {
      title: "Cấp độ",
      dataIndex: "level",
      key: "level",
      width: "10%",
      render: (level) => {
        const { text, color } = getLevelLabel(level);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "11%",
      render: (status) => {
        const { text, color } = getStatusLabel(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (price) => (
        <span className="text-gray-700">
          {price?.toLocaleString("vi-VN")} ₫
        </span>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      width: "8%",
      render: (discount) => (
        <span className="text-red-600 font-medium">{discount}%</span>
      ),
    },
    {
      title: "Học viên",
      dataIndex: "totalStudents",
      key: "totalStudents",
      width: "8%",
      render: (total) => <span className="font-medium">{total}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCourse(record)}
            className="rounded-lg"
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa khóa học"
            description="Bạn có chắc chắn muốn xóa khóa học này?"
            onConfirm={() => handleDeleteCourse(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              className="rounded-lg"
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination, filters) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);

    if (filters.categoryId && filters.categoryId.length > 0) {
      setFilterCategory(filters.categoryId[0]);
    } else {
      setFilterCategory(null);
    }
  };

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        dataSource={dataCourses}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} khóa học`,
        }}
        onChange={handleTableChange}
        className="rounded-lg overflow-hidden shadow-sm"
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default TableCourse;
