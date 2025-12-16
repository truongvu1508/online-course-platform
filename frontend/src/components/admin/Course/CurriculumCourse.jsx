import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { App, Button, Popconfirm } from "antd";
import { formatTime } from "../../../utils/formatters";
import { FaFileVideo } from "react-icons/fa";
import AccordionDetails from "@mui/material/AccordionDetails";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ModalCreateChapter from "../Chapter/ModalCreateChapter";
import ModalUpdateChapter from "../Chapter/ModalUpdateChapter";
import { deleteChapterService } from "../../../services/admin/chapter.service";

const CurriculumCourse = ({ curriculum, fetchCourseDetail, courseId }) => {
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdateChapter, setDataUpdateChapter] = useState(null);
  const { message } = App.useApp();

  const handleDeleteChapter = async (id) => {
    try {
      await deleteChapterService(id);
      message.success("Xóa chương học thành công");
      await fetchCourseDetail();
    } catch (error) {
      message.error("Xóa chương học thất bại");
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Chương trình giảng dạy
          </h2>
          <Button
            type="primary"
            size="large"
            className="rounded-lg"
            onClick={() => setIsModalCreateOpen(true)}
          >
            Thêm chương học
          </Button>
        </div>
        <div>
          {curriculum.map((section, index) => (
            <Accordion key={section._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="flex justify-between w-full items-center pr-4">
                  <h3 className="font-medium text-primary text-lg">
                    {section.order}. {section.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">
                      {section.lectures.length} bài giảng
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDataUpdateChapter(section);
                          setIsModalUpdateOpen(true);
                        }}
                      >
                        Sửa
                      </Button>
                      <Popconfirm
                        title="Xác nhận xóa?"
                        description={`Bạn có chắc muốn xóa chương "${section.title}"?`}
                        onConfirm={(e) => {
                          e.stopPropagation();
                          handleDeleteChapter(section._id);
                        }}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                          Xóa
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col gap-2">
                  {section.lectures.length > 0 ? (
                    section.lectures.map((lecture) => (
                      <div
                        key={lecture._id}
                        className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FaFileVideo className="text-primary" />
                          <span className="text-base">
                            {lecture.order}. {lecture.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="text-sm text-gray-600">
                            {formatTime(lecture.videoDuration)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-primary italic py-2">
                      Chưa có bài giảng
                    </p>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>

      <ModalCreateChapter
        courseId={courseId}
        isModalCreateOpen={isModalCreateOpen}
        setIsModalCreateOpen={setIsModalCreateOpen}
        fetchCourseDetail={fetchCourseDetail}
      />

      <ModalUpdateChapter
        courseId={courseId}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        fetchCourseDetail={fetchCourseDetail}
        dataUpdateChapter={dataUpdateChapter}
        setDataUpdateChapter={setDataUpdateChapter}
      />
    </>
  );
};

export default CurriculumCourse;
