import { useEffect, useState } from "react";
import { getAllUserService } from "../../../services/admin/user.service";
import TableUser from "../../../components/admin/User/TableUser";
import ModalCreateUser from "../../../components/admin/User/ModalCreateUser";
import { Button } from "antd";
import ModalUpdateUser from "../../../components/admin/User/ModalUpdateUser";

const UserAdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  useEffect(() => {
    loadUser();
  }, [currentPage, pageSize]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await getAllUserService(currentPage, pageSize);

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
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
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
