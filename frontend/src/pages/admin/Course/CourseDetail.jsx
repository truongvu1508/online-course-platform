/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseByIdService } from "../../../services/admin/course.service";
import { colors } from "../../../utils/colors";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import DetailCourse from "../../../components/admin/Course/DetailCourse";
import CurriculumCourse from "../../../components/admin/Course/CurriculumCourse";
import EnrollmentCourse from "../../../components/admin/Course/EnrollmentCourse";
import { App, Spin } from "antd";
import { getEnrollmentCourse } from "../../../services/admin/enrollment.service";

const CourseDetailAdminPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const { notification } = App.useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCourseDetail();
  }, []);

  useEffect(() => {
    fetchEnrollmentCourse();
  }, [currentPage, pageSize]);

  const fetchCourseDetail = async () => {
    try {
      setLoadingEnrollment(true);

      const res = await getCourseByIdService(id);

      if (res.success) {
        setCourse(res.data);
      } else {
        console.log(res.message);
        notification.error({
          message: "Không thể lấy thông tin chi tiết khóa học",
          description: res.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Không thể lấy thông tin chi tiết khóa học",
        description: error,
      });
    } finally {
      setLoadingEnrollment(false);
    }
  };

  const fetchEnrollmentCourse = async () => {
    try {
      setLoading(true);

      const res = await getEnrollmentCourse(id, currentPage, pageSize);

      if (res.success) {
        setEnrollment(res.data);
        setCurrentPage(res.pagination.page);
        setPageSize(res.pagination.limit);
        setTotal(res.pagination.total);
      } else {
        notification.error({
          message: "Không thể lấy thông tin chi tiết khóa học",
          description: res.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Không thể lấy thông tin chi tiết khóa học",
        description: error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      );
    }

    switch (selectedTab) {
      case 0:
        return (
          <DetailCourse
            course={course}
            courseId={id}
            fetchCourseDetail={fetchCourseDetail}
          />
        );
      case 1:
        return (
          <CurriculumCourse
            courseId={id}
            curriculum={course.curriculum}
            fetchCourseDetail={fetchCourseDetail}
          />
        );
      case 2:
        return (
          <EnrollmentCourse
            loadingEnrollment={loadingEnrollment}
            enrollment={enrollment}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            total={total}
          />
        );
      default:
        return null;
    }
  };

  console.log(">>> check course:", course);

  return (
    <div>
      <div className="flex justify-center w-full">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: colors.primary.DEFAULT,
            },
            "& .MuiTab-root": {
              color: "#6B7280",
              fontWeight: 600,
              fontSize: "16px",
              textTransform: "none",
              minWidth: 120,
              "&:hover": {
                color: colors.primary.DEFAULT,
                fontWeight: 600,
              },
              "&.Mui-selected": {
                color: colors.primary.DEFAULT,
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab label="Thông tin khóa học" />
          <Tab label="Chương trình giảng dạy" />
          <Tab label="Học viên" />
        </Tabs>
      </div>

      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default CourseDetailAdminPage;
