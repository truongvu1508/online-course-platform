import { App, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { updateCategoryByIdService } from "../../../services/admin/category.service";

const ModalUpdateCategory = (props) => {
  const {
    loadCategory,
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    dataUpdate,
    setDataUpdate,
  } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  console.log(dataUpdate);

  useEffect(() => {
    if (dataUpdate && isModalUpdateOpen) {
      form.setFieldsValue({
        name: dataUpdate.name,
        slug: dataUpdate.slug,
        description: dataUpdate.description,
      });
    }
  }, [dataUpdate, isModalUpdateOpen, form]);

  const handleUpdateCategory = async (values) => {
    try {
      setLoading(true);
      const res = await updateCategoryByIdService(dataUpdate._id, values);

      if (res.success) {
        message.success("Cập nhật danh mục thành công");
        handleCloseAndResetModal();
        await loadCategory();
      } else {
        notification.error({
          message: "Cập nhật danh mục thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.message || "Không thể kết nối đến server";
      notification.error({
        message: "Cập nhật danh mục thất bại",
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
    setDataUpdate(null);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Cập nhật danh mục"
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
            onFinish={handleUpdateCategory}
            className="space-y-1"
          >
            <Form.Item
              name="name"
              label={
                <span className="font-medium text-gray-700">Tên danh mục</span>
              }
              rules={[
                { required: true, message: "Không được để trống tên danh mục" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Nhập tên danh mục"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>
            <Form.Item
              name="slug"
              label={<span className="font-medium text-gray-700">Slug</span>}
              rules={[{ required: true, message: "Không được để trống slug" }]}
              className="mb-4"
            >
              <Input
                placeholder="Nhập slug"
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
              <Input
                placeholder="Nhập mô tả"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateCategory;
