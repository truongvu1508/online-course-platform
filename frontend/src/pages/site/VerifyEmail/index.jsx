import { App, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  resendVerificationCodeService,
  verifyEmailService,
} from "../../../services/auth.service";
import { colors } from "../../../utils/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const VerifyEmailPage = () => {
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    // focus on the first cell
    inputRefs.current[0]?.focus();

    if (!email) {
      notification.warning({
        message: "Thiếu thông tin!",
        description: "Vui lòng đăng ký trước khi xác thực email",
      });
      navigate("/dang-ky-tai-khoan");
    }
  }, [email, navigate, notification]);

  const maskEmail = (email) => {
    if (!email) {
      return "";
    }
    const [username, domain] = email.split("@");
    if (username.length <= 3) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.slice(0, 3)}***@${domain}`;
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // only number
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // auto move to the next cell
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // focus on the last cell
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      notification.warning({
        message: "Vui lòng nhập đủ 6 số",
        duration: 3,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await verifyEmailService(verificationCode);

      if (res.success) {
        notification.success({
          message: "Xác thực thành công",
          description: res.message || "Tài khoản của bạn đã được kích hoạt",
          duration: 3,
        });

        setTimeout(() => navigate("/dang-nhap"), 1000);
      } else {
        notification.error({
          message: "Xác thực thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lạii",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Verify error:", error);

      notification.error({
        message: "Xác thực thất bại",
        description: error.message || "Mã xác thực không đúng",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      setResendLoading(true);

      const res = await resendVerificationCodeService(email);
      if (res.success) {
        notification.success({
          message: "Đã gửi lại mã",
          description: res.message || "Vui lòng kiểm tra email của bạn",
          duration: 3,
        });

        setCountdown(60); // Đếm ngược 60 giây
        setCode(["", "", "", "", "", ""]); // Reset code
        inputRefs.current[0]?.focus(); // Focus vào ô đầu
      } else {
        notification.error({
          message: "Gửi lại mã thất bại",
          description: res.message || "Có lỗi xảy ra, vui lòng thử lại",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Resend error:", error);

      notification.error({
        message: "Gửi lại mã thất bại",
        description: error.message || "Có lỗi xảy ra",
        duration: 5,
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center p-[20px] bg-white">
      <div className="w-[500px] p-[40px] rounded-[16px] bg-white shadow-xl shadow-[rgba(30, 64, 175, 0.3)]">
        <div className="text-center mb-[30px]">
          <div className="w-[64px] h-[64px] bg-[#EFF6FF] rounded-[50%] flex items-center justify-center mx-auto mb-[20px]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#512DA8"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          <h2 className="text-primary text-3xl font-[700] text-center mb-3">
            Xác Thực Email
          </h2>
          <p className="text-center text-sm text-gray-400">
            Chúng tôi đã gửi mã xác thực 6 số đến email
            <br />
            <strong className="text-primary">{maskEmail(email)}</strong>
            <br />
            Vui lòng nhập mã để xác thực tài khoản.
          </p>
        </div>

        <div className="flex gap-3 justify-center mb-[30px]">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-[56px] h-[64px] text-2xl font-[600] text-center border-2 border-[#E2E8F0] rounded-[12px] text-gray-900 ${
                digit ? "bg-[#F8FAFC]" : "bg-white"
              }`}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = "0 0 0 3px rgba(30, 64, 175, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E2E8F0";
                e.target.style.boxShadow = "none";
              }}
            />
          ))}
        </div>

        <Button
          type="primary"
          loading={loading}
          onClick={handleVerify}
          className="custom-button-antd w-full mb-5"
        >
          Xác Thực Email
        </Button>

        <div className="text-center">
          <span className="text-sm text-span-300">Không nhận được mã? </span>
          <Button
            type="link"
            loading={resendLoading}
            disabled={countdown > 0}
            onClick={handleResendCode}
            className={`font-[600] p-0 h-auto hover:!text-secondary ${
              countdown > 0 ? "text-gray-300" : "text-primary"
            }`}
          >
            {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi Lại Mã"}
          </Button>
        </div>

        <div className="text-center mt-[24px]">
          <Link
            to={"/dang-nhap"}
            className="text-sm text-primary hover:text-secondary flex justify-center gap-1"
          >
            <ArrowBackIcon />
            Quay Lại Đăng Nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
