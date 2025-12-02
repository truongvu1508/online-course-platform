import { Space, Table, Tag, Button, Popconfirm, message, Input } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { deleteUserByIdService } from "../../../services/admin/user.service";
import { useState } from "react";

const TableUser = (props) => {
  const {
    dataUsers,
    loading,
    loadUser,
    setIsModalUpdateOpen,
    setDataUpdate,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    total,
  } = props;
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, record, item) => {
        return <>{item + 1 + (currentPage - 1) * pageSize}</>;
      },
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      align: "center",
      render: (avatar) => (
        <img
          src={avatar || "/default-avatar.png"}
          alt="avatar"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ),
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      render: (phone) => phone || "---",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 100,
      align: "center",
      render: (role) => {
        const colors = {
          ADMIN: "red",
          STUDENT: "purple",
        };
        return <Tag color={colors[role] || "default"}>{role}</Tag>;
      },
    },
    {
      title: "Đăng nhập cuối",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 150,
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : "---"),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            description={`Bạn có chắc muốn xóa user "${record.fullName}"?`}
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Khóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setDataUpdate(record);
    setIsModalUpdateOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserByIdService(id);
      message.success("Xóa user thành công");
      await loadUser();
    } catch (error) {
      message.error("Xóa user thất bại");
      console.error(error);
    }
  };

  const onChange = (pagination) => {
    // change current page
    if (pagination && pagination.current) {
      if (pagination.current !== currentPage) {
        setCurrentPage(+pagination.current);
      }
    }
    // change page size
    if (pagination && pagination.pageSize) {
      if (pagination.pageSize !== pageSize) {
        setPageSize(+pagination.pageSize);
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên, email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        dataSource={dataUsers}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} trên{" "}
                <span className="text-primary font-bold">{total}</span> người
                dùng
              </div>
            );
          },
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default TableUser;
