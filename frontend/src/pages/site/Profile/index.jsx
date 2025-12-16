import React, { useEffect, useState } from "react";
import { App, Button, Form, Input, Upload, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  getProfileService,
  updateProfileService,
} from "../../../services/student/user.service";
import CircularProgress from "@mui/material/CircularProgress";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);

      const res = await getProfileService();

      if (res.success) {
        setUser(res.data);
        setPreviewImage(res.data.avatar);
        form.setFieldsValue({
          email: res.data.email,
          fullName: res.data.fullName,
          phone: res.data.phone,
        });
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin cá nhân",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // chi them vao formdata nhung truong can cap nhat
      if (values.email && values.email !== user.email) {
        formData.append("email", values.email.trim());
      }
      if (values.fullName && values.fullName !== user.fullName) {
        formData.append("fullName", values.fullName);
      }
      if (values.phone !== undefined && values.phone !== user.phone) {
        formData.append("phone", values.phone || "");
      }

      // chi them mat khau vao formdata neu duoc cung cap
      if (values.password) {
        formData.append("password", values.password);
      }

      // them avatar neu co thay doi
      if (values.avatar?.[0]?.originFileObj) {
        formData.append("avatar", values.avatar[0].originFileObj);
      }

      const res = await updateProfileService(formData);

      if (res.success) {
        message.success("Cập nhật thông tin thành công");
        setIsEditing(false);
        await getProfile();
        form.setFieldValue("password", "");
      } else {
        notification.error({
          message: "Cập nhật thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.log("Update Profile Error:", error);

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

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(user?.avatar);
    form.setFieldsValue({
      email: user?.email,
      fullName: user?.fullName,
      phone: user?.phone,
      password: "",
    });
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
      setPreviewImage(user?.avatar || null);
    }
  };

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

  if (loading && !user) {
    return (
      <div className="w-[80%] mx-auto mt-8 flex justify-center items-center h-96">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-[80%] mx-auto">
      <div className="my-5 bg-white rounded-lg shadow-sm">
        <div className="border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Thông tin cá nhân
          </h1>
          {!isEditing ? (
            <Button
              type="primary"
              onClick={() => setIsEditing(true)}
              className="h-10"
            >
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                className="h-10"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={loading}
                className="h-10"
              >
                Lưu thay đổi
              </Button>
            </div>
          )}
        </div>

        <div className="px-8 py-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            disabled={!isEditing}
          >
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1">
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt={user.fullName}
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-md"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                        {user.fullName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <Form.Item
                      name="avatar"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e?.fileList;
                      }}
                      className="mb-0"
                    >
                      <Upload
                        listType="text"
                        maxCount={1}
                        beforeUpload={beforeUpload}
                        onChange={handleFileChange}
                        disabled={loading}
                      >
                        <Button
                          className="px-4 py-2 rounded-lg"
                          disabled={loading}
                        >
                          <PlusOutlined className="mr-2" />
                          Thay đổi ảnh đại diện
                        </Button>
                      </Upload>
                    </Form.Item>
                  )}
                  <p className="text-lg mt-2">{user.fullName}</p>
                  <div className="mt-6 w-full">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500 mb-1">Vai trò</p>
                      <p className="text-base font-semibold text-gray-700">
                        {user.role === "STUDENT" ? "Học viên" : "Quản trị viên"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="space-y-4">
                  <Form.Item
                    name="email"
                    label={
                      <span className="font-medium text-gray-700">Email</span>
                    }
                    rules={[
                      { required: true, message: "Không được để trống email" },
                      {
                        type: "email",
                        message: "Vui lòng nhập đúng định dạng email",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập email"
                      disabled={!isEditing || loading}
                      className="h-11 rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    name="fullName"
                    label={
                      <span className="font-medium text-gray-700">
                        Họ và Tên
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Không được để trống họ và tên",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập họ và tên"
                      disabled={!isEditing || loading}
                      className="h-11 rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label={
                      <span className="font-medium text-gray-700">
                        Số điện thoại
                      </span>
                    }
                    rules={[
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại phải 10 chữ số!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      disabled={!isEditing || loading}
                      className="h-11 rounded-lg"
                    />
                  </Form.Item>

                  {isEditing && (
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
                      rules={[
                        {
                          min: 6,
                          message: "Mật khẩu phải có ít nhất 6 ký tự",
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        autoComplete="new-password"
                        disabled={loading}
                        className="h-11 rounded-lg"
                      />
                    </Form.Item>
                  )}

                  {user.lastLoginAt && (
                    <div className="mt-6 pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        Đăng nhập lần cuối:{" "}
                        <span className="font-medium text-gray-700">
                          {new Date(user.lastLoginAt).toLocaleString("vi-VN")}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
