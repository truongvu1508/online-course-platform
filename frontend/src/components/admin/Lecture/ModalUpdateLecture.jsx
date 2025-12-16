import { App, Form, Input, InputNumber, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { updateLectureService } from "../../../services/admin/lecture.service";

const ModalUpdateLecture = (props) => {
  const {
    isModalUpdateLectureOpen,
    setIsModalUpdateLectureOpen,
    dataUpdateLecture,
    setDataUpdateLecture,
    fetchCourseDetail,
  } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataUpdateLecture && isModalUpdateLectureOpen) {
      form.setFieldsValue({
        title: dataUpdateLecture.title,
        videoUrl: dataUpdateLecture.videoUrl,
        videoDuration: dataUpdateLecture.videoDuration,
        isFree: dataUpdateLecture.isFree,
      });
    }
  }, [dataUpdateLecture, isModalUpdateLectureOpen, form]);

  const handleUpdateLecture = async (values) => {
    try {
      setLoading(true);
      const res = await updateLectureService(dataUpdateLecture._id, values);

      if (res.success) {
        message.success("Cập nhật bài giảng thành công");
        handleCloseAndResetModal();
        await fetchCourseDetail();
      } else {
        notification.error({
          message: "Cập nhật bài giảng thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.message || "Không thể kết nối đến server";
      notification.error({
        message: "Cập nhật bài giảng thất bại",
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
    setIsModalUpdateLectureOpen(false);
    setDataUpdateLecture(null);
    form.resetFields();
  };
  return (
    <Modal
      title={
        <div className="text-lg font-semibold text-gray-800">
          Tạo mới bài giảng
        </div>
      }
      open={isModalUpdateLectureOpen}
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
          onFinish={handleUpdateLecture}
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

export default ModalUpdateLecture;
