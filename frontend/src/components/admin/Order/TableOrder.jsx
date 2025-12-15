import { Space, Table, Tag, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const TableOrder = (props) => {
  const {
    dataOrders,
    loading,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    total,
    filterStatus,
    setFilterStatus,
  } = props;

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
      title: "Mã đơn hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 200,
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.userId?.fullName}</div>
          <div className="text-gray-500 text-sm">{record.userId?.email}</div>
        </div>
      ),
    },
    {
      title: "Khóa học",
      key: "courses",
      width: 250,
      render: (_, record) => (
        <div>
          {record.items.map((item, index) => (
            <div key={index} className="mb-1">
              {item.courseName}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 130,
      align: "right",
      render: (total) => (
        <span className="font-semibold text-green-600">
          {total?.toLocaleString("vi-VN")} ₫
        </span>
      ),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Phương thức",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 120,
      align: "center",
      render: (method) => {
        const methodText = {
          vnpay: "VNPay",
          momo: "MoMo",
          cod: "COD",
        };
        return <span>{methodText[method] || method}</span>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      filters: [
        { text: "Chờ thanh toán", value: "unpaid" },
        { text: "Đã thanh toán", value: "paid" },
        { text: "Đã hủy", value: "cancelled" },
      ],
      filteredValue: filterStatus ? [filterStatus] : null,
      render: (status) => {
        const statusConfig = {
          pending: { color: "gold", text: "Chờ thanh toán" },
          paid: { color: "green", text: "Đã thanh toán" },
          cancelled: { color: "red", text: "Đã hủy" },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => new Date(date).toLocaleString("vi-VN"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  const onChange = (pagination, filters) => {
    if (filters !== undefined && "status" in filters) {
      const newFilterStatus =
        filters.status && filters.status.length > 0 ? filters.status[0] : null;

      if (newFilterStatus !== filterStatus) {
        setFilterStatus(newFilterStatus);
        setCurrentPage(1);
      }
    }

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
        dataSource={dataOrders}
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
                <span className="text-primary font-bold">{total}</span> đơn hàng
              </div>
            );
          },
        }}
        onChange={onChange}
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default TableOrder;
