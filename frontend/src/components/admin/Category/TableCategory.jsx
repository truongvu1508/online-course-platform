import { Table, Space, Button, Popconfirm, message, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteCategoryByIdService } from "../../../services/admin/category.service";

const TableCategory = (props) => {
  const {
    dataCategories,
    loading,
    loadCategory,
    setIsModalUpdateOpen,
    setDataUpdate,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    total,
  } = props;

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, record, index) => {
        return index + 1 + (Number(currentPage) - 1) * Number(pageSize);
      },
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: 180,
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 180,
      sorter: (a, b) => a.slug.length - b.slug.length,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 180,
      sorter: (a, b) => a.description.length - b.description.length,
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
            description={`Bạn có chắc muốn xóa danh mục "${record.name}"?`}
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
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
      await deleteCategoryByIdService(id);
      message.success("Xóa danh mục thành công");
      await loadCategory();
    } catch (error) {
      message.error("Xóa danh mục thất bại");
      console.error(error);
    }
  };

  const onChange = (pagination) => {
    if (pagination && pagination.current) {
      if (pagination.current !== currentPage) {
        setCurrentPage(+pagination.current);
      }
    }
    if (pagination && pagination.pageSize) {
      if (pagination.pageSize !== pageSize) {
        setPageSize(+pagination.pageSize);
      }
    }
  };

  return (
    <div>
      <Table
        dataSource={dataCategories}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} trên{" "}
                <span className="text-primary font-bold">{total}</span> danh mục
              </div>
            );
          },
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default TableCategory;
