import { App, Form, Input, InputNumber, Modal, Select } from "antd";
import React, { useState } from "react";
import { createLectureService } from "../../../services/admin/lecture.service";

const ModalCreateLecture = (props) => {
  const {
    isModalCreateLectureOpen,
    setIsModalCreateLectureOpen,
    fetchCourseDetail,
    courseId,
    chapterId,
  } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message, notification } = App.useApp();

  const handleCreateLecture = async (values) => {
    try {
      setLoading(true);

      const dataCreate = {
        ...values,
        courseId: courseId,
        chapterId: chapterId,
      };

      const res = await createLectureService(dataCreate);

      if (res.success) {
        message.success("Tạo mới bài giảng thành công");

        handleCloseAndResetModal();
        await fetchCourseDetail();
      } else {
        notification.error({
          message: "Tạo mới bài giảng thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.log("Create Lecture Error:", error);

      const errorMessage = error.message || "Không thể kết nối đến server";

      notification.error({
        message: "Tạo mới bài giảng thất bại",
        description: errorMessage,
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleCloseAndResetModal = () => {
    setIsModalCreateLectureOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div className="text-lg font-semibold text-gray-800">
          Tạo mới bài giảng
        </div>
      }
      open={isModalCreateLectureOpen}
      onOk={handleModalOk}
      onCancel={handleCloseAndResetModal}
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      confirmLoading={loading}
      width={600}
      className="top-8"
      styles={{
        body: { padding: "24px 0" },
      }}
    >
      <div className="px-6">
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          onFinish={handleCreateLecture}
          className="space-y-1"
        >
          <Form.Item
            name="title"
            label={<span className="font-medium text-gray-700">Tiêu đề</span>}
            rules={[{ required: true, message: "Không được để trống tiêu đề" }]}
            className="mb-4"
          >
            <Input
              placeholder="Nhập tiêu đề của bài giảng"
              disabled={loading}
              className="h-10 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="videoUrl"
            label={<span className="font-medium text-gray-700">Đường dẫn</span>}
            rules={[
              {
                required: true,
                message: "Không được để trống đường dẫn bài giảng",
              },
            ]}
            className="mb-4"
          >
            <Input
              placeholder="Nhập đường dẫn của bài giảng"
              disabled={loading}
              className="h-10 rounded-lg"
            />
          </Form.Item>
          <div className="grid grid-cols-2">
            <Form.Item
              name="videoDuration"
              label={
                <span className="font-medium text-gray-700">
                  Thời lượng (s)
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Không được để trống thời lượng bài giảng",
                },
              ]}
              className="mb-4"
            >
              <InputNumber
                min={0}
                placeholder="0"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>
            <Form.Item
              label={
                <span className="font-medium text-gray-700">Truy cập</span>
              }
              name="isFree"
              className="mb-4"
            >
              <Select
                defaultValue="Trả phí"
                options={[
                  { value: false, label: "Trả phí" },
                  { value: true, label: "Miễn phí" },
                ]}
                disabled={loading}
                className="h-10"
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalCreateLecture;
