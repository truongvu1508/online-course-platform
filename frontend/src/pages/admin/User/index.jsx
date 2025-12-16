/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getAllUserService } from "../../../services/admin/user.service";
import TableUser from "../../../components/admin/User/TableUser";
import ModalCreateUser from "../../../components/admin/User/ModalCreateUser";
import { Button, Input } from "antd";
import ModalUpdateUser from "../../../components/admin/User/ModalUpdateUser";
import { SearchOutlined } from "@ant-design/icons";

const UserAdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState(null);

  useEffect(() => {
    loadUser();
  }, [currentPage, pageSize, searchText, filterRole]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await getAllUserService(
        currentPage,
        pageSize,
        searchText,
        filterRole
      );

      if (res.data) {
        setDataUsers(res.data);
        setCurrentPage(res.pagination.page);
        setPageSize(res.pagination.limit);
        setTotal(res.pagination.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Danh sách người dùng
          </h1>
          <Button
            onClick={() => {
              setIsModalCreateOpen(true);
            }}
            type="primary"
            size="large"
            className="rounded-lg"
          >
            Tạo mới người dùng
          </Button>
        </div>

        <div style={{ width: 300 }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => {
              if (e.target.value === "") {
                handleSearch("");
              }
            }}
          />
        </div>
      </div>

      <TableUser
        dataUsers={dataUsers}
        loading={loading}
        loadUser={loadUser}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        setDataUpdate={setDataUpdate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
      />

      <ModalCreateUser
        loadUser={loadUser}
        isModalCreateOpen={isModalCreateOpen}
        setIsModalCreateOpen={setIsModalCreateOpen}
      />

      <ModalUpdateUser
        loadUser={loadUser}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default UserAdminPage;
