import axios from "../../customs/axios.customize";

const loginService = async (email, password) => {
  const URL_BACKEND = "/auth/login";
  const dataLogin = { email, password };

  const response = await axios.post(URL_BACKEND, dataLogin);

  return response;
};

const registerService = async (email, fullName, password) => {
  const URL_BACKEND = "/auth/register";
  const dataRegister = { email, fullName, password };

  const response = await axios.post(URL_BACKEND, dataRegister);

  return response;
};

const verifyEmailService = async (verificationCode) => {
  const URL_BACKEND = "/auth/verify-email";
  const dataSend = { verificationCode };

  const response = await axios.post(URL_BACKEND, dataSend);

  return response;
};

const resendVerificationCodeService = async (email) => {
  const URL_BACKEND = "/auth/resend-verification";
  const dataResend = { email };

  const response = await axios.post(URL_BACKEND, dataResend);

  return response;
};

export {
  loginService,
  registerService,
  verifyEmailService,
  resendVerificationCodeService,
};
