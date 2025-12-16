/* eslint-disable no-unused-vars */
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
import ModalCreateLecture from "../Lecture/ModalCreateLecture";
import ModalUpdateLecture from "../Lecture/ModalUpdateLecture";
import { deleteLectureService } from "../../../services/admin/lecture.service";

const CurriculumCourse = ({ curriculum, fetchCourseDetail, courseId }) => {
  const [isModalCreateChapterOpen, setIsModalCreateChapterOpen] =
    useState(false);
  const [isModalUpdateChapterOpen, setIsModalUpdateChapterOpen] =
    useState(false);
  const [dataUpdateChapter, setDataUpdateChapter] = useState(null);

  const [isModalCreateLectureOpen, setIsModalCreateLectureOpen] =
    useState(false);
  const [isModalUpdateLectureOpen, setIsModalUpdateLectureOpen] =
    useState(false);
  const [dataUpdateLecture, setDataUpdateLecture] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
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

  const handleDeleteLecture = async (id) => {
    try {
      await deleteLectureService(id);
      message.success("Xóa bài giảng thành công");
      await fetchCourseDetail();
    } catch (error) {
      message.error("Xóa bài giảng thất bại");
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
            onClick={() => setIsModalCreateChapterOpen(true)}
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
                          setIsModalUpdateChapterOpen(true);
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
                          <div className="flex items-center gap-2">
                            <Button
                              size="small"
                              type="link"
                              icon={<EditOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDataUpdateLecture(lecture);
                                setIsModalUpdateLectureOpen(true);
                              }}
                            >
                              Sửa
                            </Button>
                            <Popconfirm
                              placement="topRight"
                              title="Xác nhận xóa?"
                              description={`Bạn có chắc muốn xóa bài giảng "${lecture.title}"?`}
                              onConfirm={(e) => {
                                e.stopPropagation();
                                handleDeleteLecture(lecture._id);
                              }}
                              okText="Xóa"
                              cancelText="Hủy"
                              okButtonProps={{ danger: true }}
                            >
                              <Button
                                size="small"
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                              >
                                Xóa
                              </Button>
                            </Popconfirm>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-primary italic py-2">
                      Chưa có bài giảng
                    </p>
                  )}

                  <Button
                    type="dashed"
                    onClick={() => {
                      setSelectedChapterId(section._id);
                      setIsModalCreateLectureOpen(true);
                    }}
                    className="mt-2"
                  >
                    Thêm bài giảng
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>

      <ModalCreateChapter
        courseId={courseId}
        isModalCreateChapterOpen={isModalCreateChapterOpen}
        setIsModalCreateChapterOpen={setIsModalCreateChapterOpen}
        fetchCourseDetail={fetchCourseDetail}
      />

      <ModalUpdateChapter
        courseId={courseId}
        isModalUpdateChapterOpen={isModalUpdateChapterOpen}
        setIsModalUpdateChapterOpen={setIsModalUpdateChapterOpen}
        fetchCourseDetail={fetchCourseDetail}
        dataUpdateChapter={dataUpdateChapter}
        setDataUpdateChapter={setDataUpdateChapter}
      />

      <ModalCreateLecture
        courseId={courseId}
        chapterId={selectedChapterId}
        isModalCreateLectureOpen={isModalCreateLectureOpen}
        setIsModalCreateLectureOpen={setIsModalCreateLectureOpen}
        fetchCourseDetail={fetchCourseDetail}
      />

      <ModalUpdateLecture
        courseId={courseId}
        chapterId={selectedChapterId}
        isModalUpdateLectureOpen={isModalUpdateLectureOpen}
        setIsModalUpdateLectureOpen={setIsModalUpdateLectureOpen}
        fetchCourseDetail={fetchCourseDetail}
        dataUpdateLecture={dataUpdateLecture}
        setDataUpdateLecture={setDataUpdateLecture}
      />
    </>
  );
};

export default CurriculumCourse;
