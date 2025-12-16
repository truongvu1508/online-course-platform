import { App, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { updateChapterService } from "../../../services/admin/chapter.service";

const ModalUpdateChapter = (props) => {
  const {
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    dataUpdateChapter,
    setDataUpdateChapter,
    fetchCourseDetail,
  } = props;
  const [loading, setLoading] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdateChapter && isModalUpdateOpen) {
      form.setFieldsValue({
        title: dataUpdateChapter.title,
        description: dataUpdateChapter.description,
      });
    }
  }, [dataUpdateChapter, isModalUpdateOpen, form]);

  const handleUpdateChapter = async (values) => {
    try {
      setLoading(true);
      const res = await updateChapterService(dataUpdateChapter._id, values);

      if (res.success) {
        message.success("Cập nhật chương học thành công");
        handleCloseAndResetModal();
        await fetchCourseDetail();
      } else {
        notification.error({
          message: "Cập nhật chương học thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.message || "Không thể kết nối đến server";
      notification.error({
        message: "Cập nhật chương học thất bại",
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
    setIsModalUpdateOpen(false);
    setDataUpdateChapter(null);
    form.resetFields();
  };
  return (
    <Modal
      title={
        <div className="text-lg font-semibold text-gray-800">
          Cập nhật chương học
        </div>
      }
      open={isModalUpdateOpen}
      onOk={handleModalOk}
      onCancel={handleCloseAndResetModal}
      okText="Cập nhật"
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
          onFinish={handleUpdateChapter}
          className="space-y-1"
        >
          <Form.Item
            name="title"
            label={<span className="font-medium text-gray-700">Tiêu đề</span>}
            rules={[{ required: true, message: "Không được để trống tiêu đề" }]}
            className="mb-4"
          >
            <Input
              placeholder="Nhập tiêu đề"
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

export default ModalUpdateChapter;
