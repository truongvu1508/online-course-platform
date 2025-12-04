import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { createCourseService } from "../../../services/admin/course.service";
import { getAllCategoryService } from "../../../services/admin/category.service";

const ModalCreateCourse = (props) => {
  const { loadCourse, isModalCreateOpen, setIsModalCreateOpen } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (isModalCreateOpen) {
      loadCategories();
    }
  }, [isModalCreateOpen]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await getAllCategoryService(1, 100, "");
      if (res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Load categories error:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCreateCourse = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", values.title.trim());
      formData.append("slug", values.slug.trim());
      formData.append("description", values.description.trim());
      formData.append("shortDescription", values.shortDescription || "");
      formData.append("categoryId", values.categoryId);
      formData.append("level", values.level || "beginner");
      formData.append("language", values.language || "vi");
      formData.append("price", values.price || 0);
      formData.append("discount", values.discount || 0);
      formData.append("previewVideo", values.previewVideo || "");
      formData.append("status", values.status || "draft");
      formData.append(
        "requirements",
        JSON.stringify(values.requirements || [])
      );

      if (values.thumbnail?.[0]?.originFileObj) {
        formData.append("thumbnail", values.thumbnail[0].originFileObj);
      }

      const res = await createCourseService(formData);

      if (res.success) {
        message.success("Tạo mới khóa học thành công");
        handleCloseAndResetModal();
        await loadCourse();
      } else {
        notification.error({
          message: "Tạo khóa học thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.log("Create Course Error:", error);

      const errorMessage = error.message || "Không thể kết nối đến server";

      notification.error({
        message: "Tạo khóa học thất bại",
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

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  return (
    <>
      <Modal
        title={
          <div className="text-lg font-semibold text-gray-800">
            Tạo mới khóa học
          </div>
        }
        open={isModalCreateOpen}
        onOk={handleModalOk}
        onCancel={handleCloseAndResetModal}
        okText="Tạo mới"
        cancelText="Hủy bỏ"
        confirmLoading={loading}
        width={700}
        className="top-8"
        styles={{
          body: { padding: "24px 0" },
        }}
      >
        <div className="px-6 max-h-96 overflow-y-auto">
          <Form
            layout="vertical"
            form={form}
            autoComplete="off"
            initialValues={{
              language: "vi",
              price: 0,
              discount: 0,
              status: "draft",
              requirements: [],
            }}
            onFinish={handleCreateCourse}
            className="space-y-1"
          >
            <Form.Item
              name="title"
              label={
                <span className="font-medium text-gray-700">
                  Tên khóa học *
                </span>
              }
              rules={[
                { required: true, message: "Không được để trống tên khóa học" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Nhập tên khóa học"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label={<span className="font-medium text-gray-700">Slug *</span>}
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
              name="categoryId"
              label={
                <span className="font-medium text-gray-700">Danh mục *</span>
              }
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              className="mb-4"
            >
              <Select
                placeholder="Chọn danh mục"
                options={categoryOptions}
                loading={loadingCategories}
                disabled={loading || loadingCategories}
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              name="shortDescription"
              label={
                <span className="font-medium text-gray-700">Mô tả ngắn</span>
              }
              className="mb-4"
            >
              <Input.TextArea
                placeholder="Nhập mô tả ngắn"
                disabled={loading}
                rows={2}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={
                <span className="font-medium text-gray-700">
                  Mô tả chi tiết *
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Không được để trống mô tả chi tiết",
                },
              ]}
              className="mb-4"
            >
              <Input.TextArea
                placeholder="Nhập mô tả chi tiết"
                disabled={loading}
                rows={3}
              />
            </Form.Item>

            <Form.Item
              name="previewVideo"
              label={
                <span className="font-medium text-gray-700">
                  Link video xem trước
                </span>
              }
              className="mb-4"
            >
              <Input
                placeholder="Nhập link video (YouTube)"
                disabled={loading}
                className="h-10 rounded-lg"
              />
            </Form.Item>

            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                name="level"
                label={
                  <span className="font-medium text-gray-700">Cấp độ *</span>
                }
                rules={[{ required: true, message: "Vui lòng chọn cấp độ" }]}
                className="mb-4"
              >
                <Select
                  options={[
                    { value: "beginner", label: "Cơ bản" },
                    { value: "intermediate", label: "Trung cấp" },
                    { value: "advanced", label: "Trình độ cao" },
                  ]}
                  disabled={loading}
                  className="h-10"
                />
              </Form.Item>

              <Form.Item
                name="language"
                label={
                  <span className="font-medium text-gray-700">Ngôn ngữ</span>
                }
                className="mb-4"
              >
                <Select
                  options={[
                    { value: "vi", label: "Tiếng Việt" },
                    { value: "en", label: "Tiếng Anh" },
                  ]}
                  disabled={loading}
                  className="h-10"
                />
              </Form.Item>

              <Form.Item
                name="status"
                label={
                  <span className="font-medium text-gray-700">Trạng thái</span>
                }
                className="mb-4"
              >
                <Select
                  options={[
                    { value: "draft", label: "Bản nháp" },
                    { value: "published", label: "Đã xuất bản" },
                    { value: "archived", label: "Đã lưu trữ" },
                  ]}
                  disabled={loading}
                  className="h-10"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="price"
                label={
                  <span className="font-medium text-gray-700">
                    Giá gốc (VNĐ) *
                  </span>
                }
                rules={[{ required: true, message: "Không được để trống giá" }]}
                className="mb-4"
              >
                <InputNumber
                  min={0}
                  disabled={loading}
                  className="w-full h-10 rounded-lg"
                  placeholder="0"
                />
              </Form.Item>

              <Form.Item
                name="discount"
                label={
                  <span className="font-medium text-gray-700">
                    Giảm giá (%)
                  </span>
                }
                className="mb-4"
              >
                <InputNumber
                  min={0}
                  max={100}
                  disabled={loading}
                  className="w-full h-10 rounded-lg"
                  placeholder="0"
                />
              </Form.Item>
            </div>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Ảnh thumbnail</span>
              }
              className="mb-0"
            >
              <Form.Item
                name="thumbnail"
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

export default ModalCreateCourse;
