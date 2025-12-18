import { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { getAllCoursesPublic } from "../../../services/public/course.service";
import { App } from "antd";
import CourseCard from "../../../components/site/CourseCard";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Pagination } from "antd";
import ReactStars from "react-stars";
import { getAllCategoryPublic } from "../../../services/public/category.service";

const CoursesPage = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState(false);
  const { message, notification } = App.useApp();
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);

  const COURSE_RATINGS = [
    { value: 5, label: "5.0" },
    { value: 4.5, label: "4.5 trở lên" },
    { value: 4, label: "4.0 trở lên" },
    { value: 3.5, label: "3.5 trở lên" },
    { value: 3, label: "3.0 trở lên" },
  ];

  const COURSE_LEVELS = [
    { value: "beginner", label: "Người mới bắt đầu" },
    { value: "intermediate", label: "Trung cấp" },
    { value: "advanced", label: "Nâng cao" },
  ];

  const COURSE_DURATIONS = [
    { value: "0-5", label: "0-5 giờ" },
    { value: "5-10", label: "5-10 giờ" },
    { value: "10-20", label: "10-20 giờ" },
    { value: "over-20", label: "20+ giờ" },
  ];

  useEffect(() => {
    fetchCategoriesPublic();
  }, []);

  useEffect(() => {
    fetchCoursesPublic();
  }, [
    currentPage,
    pageSize,
    selectedCategories,
    selectedRating,
    selectedDuration,
    selectedLevels,
  ]);

  // Kiểm tra có filter active không
  useEffect(() => {
    const hasActiveFilters =
      selectedRating !== "" ||
      selectedDuration !== "" ||
      selectedCategories.length > 0 ||
      selectedLevels.length > 0;
    setActiveFilters(hasActiveFilters);
  }, [selectedRating, selectedDuration, selectedCategories, selectedLevels]);

  const fetchCategoriesPublic = async () => {
    try {
      const res = await getAllCategoryPublic();

      if (res.success) {
        setCategories(res.data);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải danh mục khóa học",
        description: error,
      });
    }
  };

  const fetchCoursesPublic = async () => {
    try {
      setLoading(true);

      const filterRating = selectedRating || null;
      const filterDuration = selectedDuration || null;

      // chuyen categories thanh chuoi categoryIds
      const filterCategory =
        selectedCategories.length > 0 ? selectedCategories.join(",") : null;

      // chuyen levels thanh chuoi categoryIds
      const filterLevel =
        selectedLevels.length > 0 ? selectedLevels.join(",") : null;

      const res = await getAllCoursesPublic(
        currentPage,
        pageSize,
        filterRating,
        filterDuration,
        filterCategory,
        filterLevel
      );

      if (res.success) {
        setCourses(res.data);
        setCurrentPage(res.pagination.page);
        setPageSize(res.pagination.limit);
        setTotal(res.pagination.total);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log("Lỗi khi tải danh sách khóa học:", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangePagination = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const clearAllFilters = () => {
    setSelectedRating("");
    setSelectedDuration("");
    setSelectedCategories([]);
    setSelectedLevels([]);
    setCurrentPage(1);
  };

  return (
    <section className="container min-h-[90vh] fade-in-up p-10">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Bộ lọc</h2>
            {activeFilters && (
              <Button variant="outlined" size="small" onClick={clearAllFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3 className="font-medium text-lg">Đánh giá</h3>
            </AccordionSummary>
            <AccordionDetails>
              <RadioGroup
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {COURSE_RATINGS.map((courseRating) => (
                  <FormControlLabel
                    value={courseRating.value}
                    control={<Radio />}
                    label={
                      <div className="flex items-center gap-1">
                        <ReactStars
                          count={5}
                          value={courseRating.value}
                          size={24}
                          half={true}
                          edit={false}
                        />
                        <span className="ml-1 text-sm">
                          {courseRating.label}
                        </span>
                      </div>
                    }
                    key={courseRating.value}
                  />
                ))}
              </RadioGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3 className="font-medium text-lg">Thời lượng</h3>
            </AccordionSummary>
            <AccordionDetails>
              <RadioGroup
                value={selectedDuration}
                onChange={(e) => {
                  setSelectedDuration(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {COURSE_DURATIONS.map((courseDuration) => (
                  <FormControlLabel
                    value={courseDuration.value}
                    control={<Radio />}
                    label={courseDuration.label}
                    key={courseDuration.value}
                  />
                ))}
              </RadioGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3 className="font-medium text-lg">Danh mục</h3>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {categories.map((category) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(category._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([
                              ...selectedCategories,
                              category._id,
                            ]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter(
                                (d) => d !== category._id
                              )
                            );
                          }
                          setCurrentPage(1);
                        }}
                      />
                    }
                    label={category.name}
                    key={category._id}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3 className="font-medium text-lg">Cấp độ</h3>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {COURSE_LEVELS.map((courseLevel) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedLevels.includes(courseLevel.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLevels([
                              ...selectedLevels,
                              courseLevel.value,
                            ]);
                          } else {
                            setSelectedLevels(
                              selectedLevels.filter(
                                (d) => d !== courseLevel.value
                              )
                            );
                          }
                          setCurrentPage(1);
                        }}
                      />
                    }
                    label={courseLevel.label}
                    key={courseLevel.value}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </aside>

        <main className="col-span-9">
          {loading ? (
            <>
              <div className="flex items-center justify-center h-full">
                <CircularProgress />
              </div>
            </>
          ) : courses.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                {courses.map((course) => (
                  <CourseCard course={course} key={course.id} />
                ))}
              </div>
              <div className="flex justify-end mt-5">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  showSizeChanger={true}
                  total={total}
                  showTotal={(total, range) => {
                    return (
                      <div>
                        {range[0]} - {range[1]} trên{" "}
                        <span className="text-primary font-bold">{total}</span>{" "}
                        khóa học
                      </div>
                    );
                  }}
                  onChange={onChangePagination}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col justify-center items-center h-full">
                <p className="text-xl text-gray-500 mb-4">
                  Không tìm thấy khóa học phù hợp
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
};

export default CoursesPage;
