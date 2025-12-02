import { App, Button, Form, Input, Modal, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { createUserService } from "../../../services/admin/user.service";

const ModalCreateUser = (props) => {
  const { loadUser, isModalCreateOpen, setIsModalCreateOpen } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("email", values.email.trim());
      formData.append("fullName", values.fullName);
      formData.append("phone", values.phone || "");
      formData.append("password", values.password);
      formData.append("role", values.role);

      if (values.avatar?.[0]?.originFileObj) {
        formData.append("avatar", values.avatar[0].originFileObj);
      }

      const res = await createUserService(formData);

      if (res.success) {
        message.success("Tạo mới người dùng thành công");

        handleCloseAndResetModal();
        await loadUser();
      } else {
        notification.error({
          message: "Đăng ký thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.log("Create User Error:", error);

      const errorMessage = error.message || "Không thể kết nối đến server";

      notification.error({
        message: "Đăng ký thất bại",
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
    setIsModalCreateOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title={
          <div className="text-lg font-semibold text-gray-800">
            Tạo mới người dùng
          </div>
        }
        open={isModalCreateOpen}
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
            initialValues={{
              role: "STUDENT",
            }}
            onFinish={handleCreateUser}
            className="space-y-1"
          >
            <Form.Item
              name="email"
              label={<span className="font-medium text-gray-700">Email</span>}
              rules={[
                { required: true, message: "Không được để trống email" },
                {
                  type: "email",
                  message: "Vui lòng nhập đúng định dạng email",
                },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Nhập email"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="fullName"
              label={
                <span className="font-medium text-gray-700">Họ và Tên</span>
              }
              rules={[
                { required: true, message: "Không được để trống họ và tên" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Nhập họ và tên"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <span className="font-medium text-gray-700">Số điện thoại</span>
              }
              rules={[
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải 10 chữ số!",
                },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Nhập số điện thoại"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="font-medium text-gray-700">Mật khẩu</span>
              }
              rules={[
                { required: true, message: "Không được để trống mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
              className="mb-4"
            >
              <Input.Password
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                autoComplete="new-password"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Vai trò</span>}
              name="role"
              className="mb-4"
            >
              <Select
                defaultValue="STUDENT"
                options={[
                  { value: "STUDENT", label: "Học viên" },
                  { value: "ADMIN", label: "Quản trị viên" },
                ]}
                disabled={loading}
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Ảnh đại diện</span>
              }
              className="mb-0"
            >
              <Form.Item
                name="avatar"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
                noStyle
              >
                <Upload
                  listType="picture-card"
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      message.error("Chỉ được upload file ảnh!");
                      return Upload.LIST_IGNORE;
                    }

                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error("Ảnh phải nhỏ hơn 2MB!");
                      return Upload.LIST_IGNORE;
                    }

                    return false;
                  }}
                  maxCount={1}
                  accept="image/*"
                  disabled={loading}
                  className="avatar-uploader"
                >
                  <div className="flex flex-col items-center justify-center">
                    <PlusOutlined className="text-lg mb-2" />
                    <div className="text-sm text-gray-600">Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateUser;
