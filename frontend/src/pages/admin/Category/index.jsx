import { useState, useEffect } from "react";
import { getAllCategoryService } from "../../../services/admin/category.service";
import TableCategory from "../../../components/admin/Category/TableCategory";
import ModalCreateCategory from "../../../components/admin/Category/ModalCreateCategory";
import ModalUpdateCategory from "../../../components/admin/Category/ModalUpdateCategory";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const CategoryAdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [dataCategories, setDataCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadCategory();
  }, [currentPage, pageSize, searchText]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const res = await getAllCategoryService(
        currentPage,
        pageSize,
        searchText
      );
      if (res.data) {
        setDataCategories(res.data);
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
            Danh sách danh mục
          </h1>
          <Button
            onClick={() => {
              setIsModalCreateOpen(true);
            }}
            type="primary"
            size="large"
            className="rounded-lg"
          >
            Tạo mới danh mục
          </Button>
        </div>

        <div style={{ width: 300 }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên danh mục"
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
      <TableCategory
        dataCategories={dataCategories}
        loading={loading}
        loadCategory={loadCategory}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        setDataUpdate={setDataUpdate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
      />
      <ModalCreateCategory
        loadCategory={loadCategory}
        isModalCreateOpen={isModalCreateOpen}
        setIsModalCreateOpen={setIsModalCreateOpen}
      />
      <ModalUpdateCategory
        loadCategory={loadCategory}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default CategoryAdminPage;
