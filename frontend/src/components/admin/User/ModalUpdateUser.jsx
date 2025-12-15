import { App, Button, Form, Input, Modal, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { updateUserByIdService } from "../../../services/admin/user.service";

const ModalUpdateUser = (props) => {
  const {
    loadUser,
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    dataUpdate,
    setDataUpdate,
  } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  console.log(dataUpdate);

  useEffect(() => {
    if (dataUpdate && isModalUpdateOpen) {
      form.setFieldsValue({
        email: dataUpdate.email,
        fullName: dataUpdate.fullName,
        phone: dataUpdate.phone,
        role: dataUpdate.role,
      });
      // Set preview image to existing avatar
      setPreviewImage(dataUpdate.avatar || null);
    }
  }, [dataUpdate, isModalUpdateOpen, form]);

  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // chi them vao formdata nhung truong can cap nhat
      if (values.email && values.email !== dataUpdate.email) {
        formData.append("email", values.email.trim());
      }
      if (values.fullName && values.fullName !== dataUpdate.fullName) {
        formData.append("fullName", values.fullName);
      }
      if (values.phone !== undefined && values.phone !== dataUpdate.phone) {
        formData.append("phone", values.phone || "");
      }
      if (values.role && values.role !== dataUpdate.role) {
        formData.append("role", values.role);
      }

      // chi them mat khau vao formdata neu duoc cung cap
      if (values.password) {
        formData.append("password", values.password);
      }

      if (values.avatar?.[0]?.originFileObj) {
        formData.append("avatar", values.avatar[0].originFileObj);
      }

      const res = await updateUserByIdService(dataUpdate._id, formData);

      if (res.success) {
        message.success("Cập nhật người dùng thành công");
        handleCloseAndResetModal();
        await loadUser();
      } else {
        notification.error({
          message: "Cập nhật thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.log("Update User Error:", error);

      const errorMessage = error.message || "Không thể kết nối đến server";

      notification.error({
        message: "Cập nhật thất bại",
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
    setPreviewImage(null);
    form.resetFields();
  };

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(dataUpdate?.avatar || null);
    }
  };

  // validate dinh dang va kich thuoc
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên file ảnh!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  console.log(previewImage);

  return (
    <>
      <Modal
        title={
          <div className="text-lg font-semibold text-gray-800">
            Cập nhật người dùng
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
            onFinish={handleUpdateUser}
            className="space-y-1"
          >
            <div className="mb-6 flex flex-col items-center">
              <div className="mb-4">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-semibold">
                    {dataUpdate?.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>

              <Form.Item
                name="avatar"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
                className="mb-0 text-center"
              >
                <Upload
                  listType="text"
                  maxCount={1}
                  beforeUpload={beforeUpload}
                  onChange={handleFileChange}
                  disabled={loading}
                >
                  <Button className="px-4 py-2 rounded-lg " disabled={loading}>
                    <PlusOutlined className="mr-2" />
                    Chọn ảnh đại diện
                  </Button>
                </Upload>
              </Form.Item>
            </div>

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
                <span className="font-medium text-gray-700">
                  Mật khẩu mới{" "}
                  <span className="text-gray-500 font-normal">
                    (Để trống nếu không đổi)
                  </span>
                </span>
              }
              rules={[{ min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }]}
              className="mb-4"
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                autoComplete="new-password"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Vai trò</span>}
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
              className="mb-4"
            >
              <Select
                options={[
                  { value: "STUDENT", label: "Học viên" },
                  { value: "ADMIN", label: "Quản trị viên" },
                ]}
                disabled={loading}
                className="h-10"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateUser;
