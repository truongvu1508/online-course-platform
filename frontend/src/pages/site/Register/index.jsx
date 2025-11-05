import { App, Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerService } from "../../../services/auth.service";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await registerService(
        values.email.trim(),
        values.fullName.trim(),
        values.password
      );

      if (res.success) {
        notification.success({
          message: "Đăng ký thành công",
          description:
            res.message || "Vui lòng kiểm tra email để xác thực tài khoản",
          duration: 5,
        });

        form.resetFields();
        setTimeout(
          () =>
            navigate("/xac-thuc-tai-khoan", {
              state: { email: values.email.trim() },
            }),
          1500
        );
      } else {
        notification.error({
          message: "Đăng ký thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch (error) {
      console.error("Register error:", error);

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
  return (
    <div className="min-h-[100vh] flex items-center justify-center p-[20px]">
      <div className="w-[600px] p-[40px] rounded-[16px] bg-white shadow-xl shadow-[rgba(30, 64, 175, 0.3)]">
        <h2 className="text-primary text-3xl font-[700] text-center">
          Tạo Tài Khoản
        </h2>
        <p className="text-center text-sm text-gray-400">
          Điền thông tin để bắt đầu
        </p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="font-[500] text-gray-600">Họ và tên</span>}
            name="fullName"
            rules={[
              { required: true, message: "Không được để trống họ và tên!" },
            ]}
          >
            <Input
              placeholder="Nhập họ và tên"
              className="rounded-[8px] px-[10px] py-[12px] text-sm border border-gray-300 hover:border-primary focus:border-primary"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-[500] text-gray-600">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Không được để trống email!" },
              { type: "email", message: "Vui lòng nhập đúng định dạng email!" },
            ]}
          >
            <Input
              placeholder="Nhập địa chỉ email"
              className="rounded-[8px] px-[10px] py-[12px] text-sm border border-gray-300 hover:border-primary focus:border-primary"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-[500] text-gray-600">Mật khẩu</span>}
            name="password"
            rules={[
              { required: true, message: "Không được để trống mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              className="rounded-[8px] px-[10px] py-[12px] text-sm border border-gray-300 hover:border-primary focus:border-primary"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-[500] text-gray-600">
                Xác nhận mật khẩu
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu"
              className="rounded-[8px] px-[10px] py-[12px] text-sm border border-gray-300 hover:border-primary focus:border-primary"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="custom-button-antd w-full mt-5"
            >
              Đăng Ký
            </Button>
          </Form.Item>

          <div className="text-center mt-[20px]">
            <span className="text-sm text-gray-500">
              Đã có tài khoản?{" "}
              <Link
                to={"/dang-nhap"}
                className="text-primary font-[600] hover:text-secondary"
              >
                Đăng Nhập
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
