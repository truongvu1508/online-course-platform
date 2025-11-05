import { App, Button, Divider, Form, Input } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth.context";
import { loginService } from "../../../services/auth.service";
import { colors } from "../../../utils/colors";

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await loginService(
        values.email.trim(),
        values.password.trim()
      );

      if (res.success) {
        notification.success({
          message: res.message || "Đăng nhập thành công",
          description: res.message || "Chào mừng bạn quay trở lại",
        });

        // save access_token to localStorage
        if (res.data.access_token) {
          localStorage.setItem("access_token", res.data.access_token);
        }

        // save info user to context
        setUser(res.data.user);

        form.resetFields();
        setTimeout(() => navigate("/"));
      } else {
        notification.error({
          message: "Đăng nhập thất bại",
          description: res.message || "Tên đăng nhập hoặc mật khẩu không đúng",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      notification.error({
        message: "Đăng nhập thất bại",
        description: error.message || "Không thể kết nối đến server",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(30, 64, 175, 0.3)",
          padding: "40px",
          width: "600px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: colors.primary,
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          Chào Mừng Trở Lại
        </h2>
        <p
          style={{
            color: "#64748B",
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "14px",
          }}
        >
          Đăng nhập để tiếp tục sử dụng website
        </p>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={
              <span style={{ color: "#1E293B", fontWeight: "500" }}>Email</span>
            }
            name="email"
            rules={[
              { required: true, message: "Vui lòng điền email!" },
              { type: "email", message: "Vui lòng nhập đúng định dạng email!" },
            ]}
          >
            <Input
              placeholder="Nhập email"
              disabled={loading}
              className="rounded-[8px] px-[10px] py-[12px] text-sm border border-gray-300 hover:border-primary focus:border-primary"
            />
          </Form.Item>
          <Form.Item
            label={
              <span style={{ color: "#1E293B", fontWeight: "500" }}>
                Mật khẩu
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Vui lòng điền mật khẩu!" },
              { min: 6, message: "Mật khẩu phải từ 6 ký tự!" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              disabled={loading}
              className="rounded-[8px] px-[10px] py-[12px] text-sm border border-gray-300 hover:border-primary focus:border-primary"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="custom-button-antd w-full"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
        <Divider className="!text-primary !my-[24px] !text-sm">Hoặc</Divider>
        <Button
          // loading={googleLoading}
          className="w-full h-[44px] mt-5 rounded-[8px] text-sm font-[500] border border-gray-200 flex items-center justify-center"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z"
              fill="#4285F4"
            />
            <path
              d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
              fill="#EA4335"
            />
          </svg>
          Tiếp tục với Google
        </Button>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span style={{ color: "#64748B", fontSize: "14px" }}>
            Bạn chưa có tài khoản?{" "}
            <Link
              to={"/dang-ky-tai-khoan"}
              className="text-primary font-[600] hover:text-secondary"
            >
              Đăng Ký Tài Khoản
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
