import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { colors } from "../../../../utils/colors";
import CourseCard from "../../../../components/site/CourseCard";
import Button from "@mui/material/Button";

const CourseSections = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const courses = [{}, {}, {}, {}];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    // API
    // - 0: Moi nhat
    // - 1: Ban chay
    // - 2: Danh gia cao
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="container">
        <h1 className="text-center text-3xl font-bold text-primary">
          Các Khóa Học
        </h1>
        <div className="flex justify-center w-full mt-3">
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
            <Tab label="Mới nhất" />
            <Tab label="Bán chạy" />
            <Tab label="Đánh giá cao" />
          </Tabs>
        </div>
        <div className="grid grid-cols-4 gap-5 mt-5">
          {courses.map((course, index) => (
            <div className="col-span-1" key={index}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: colors.primary.DEFAULT,
              marginTop: "20px",
              marginBottom: "50px",
              fontWeight: 600,
              "&:hover": { backgroundColor: colors.secondary },
            }}
          >
            Xem tất cả
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CourseSections;
