import { useEffect, useState } from "react";
import { getAllCourseService } from "../../../services/admin/course.service";
import TableCourse from "../../../components/admin/Course/TableCourse";
import ModalCreateCourse from "../../../components/admin/Course/ModalCreateCourse";
import ModalUpdateCourse from "../../../components/admin/Course/ModalUpdateCourse";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const CourseAdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [dataCourses, setDataCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);

  useEffect(() => {
    loadCourse();
  }, [currentPage, pageSize, searchText, filterCategory]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const res = await getAllCourseService(
        currentPage,
        pageSize,
        searchText,
        filterCategory
      );

      if (res.data) {
        setDataCourses(res.data);
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
            Danh sách khóa học
          </h1>
          <Button
            onClick={() => {
              setIsModalCreateOpen(true);
            }}
            type="primary"
            size="large"
            className="rounded-lg"
          >
            Tạo mới khóa học
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

      <TableCourse
        dataCourses={dataCourses}
        setDataCourses={setDataCourses}
        loading={loading}
        loadCourse={loadCourse}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        setDataUpdate={setDataUpdate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />

      <ModalCreateCourse
        loadCourse={loadCourse}
        isModalCreateOpen={isModalCreateOpen}
        setIsModalCreateOpen={setIsModalCreateOpen}
      />

      <ModalUpdateCourse
        loadCourse={loadCourse}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default CourseAdminPage;
