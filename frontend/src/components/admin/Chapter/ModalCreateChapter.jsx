import { App, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { createChapterService } from "../../../services/admin/chapter.service";

const ModalCreateChapter = (props) => {
  const {
    isModalCreateChapterOpen,
    setIsModalCreateChapterOpen,
    fetchCourseDetail,
    courseId,
  } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message, notification } = App.useApp();

  const handleCreateChapter = async (values) => {
    try {
      setLoading(true);

      const dataCreate = { ...values, courseId: courseId };

      const res = await createChapterService(dataCreate);

      if (res.success) {
        message.success("Tạo mới chương học thành công");

        handleCloseAndResetModal();
        await fetchCourseDetail();
      } else {
        notification.error({
          message: "Tạo mới chương học thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.log("Create Chapter Error:", error);

      const errorMessage = error.message || "Không thể kết nối đến server";

      notification.error({
        message: "Tạo mới chương học thất bại",
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
    setIsModalCreateChapterOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div className="text-lg font-semibold text-gray-800">
          Tạo mới chương học
        </div>
      }
      open={isModalCreateChapterOpen}
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
          onFinish={handleCreateChapter}
          className="space-y-1"
        >
          <Form.Item
            name="title"
            label={<span className="font-medium text-gray-700">Tiêu đề</span>}
            rules={[{ required: true, message: "Không được để trống tiêu đề" }]}
            className="mb-4"
          >
            <Input
              placeholder="Nhập tiêu đề của chương học"
              disabled={loading}
              className="h-10 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-medium text-gray-700">Mô tả</span>}
            rules={[{ required: true, message: "Không được để trống mô tả" }]}
            className="mb-4"
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả của chương học"
              disabled={loading}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalCreateChapter;
