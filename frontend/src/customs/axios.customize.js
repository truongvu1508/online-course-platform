import axios from "axios";

const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

// Tao instance axios voi base URL
const instance = axios.create({ baseURL: URL_BACKEND });

// Them request interceptor
instance.interceptors.request.use(
  function (config) {
    // Xu ly truoc khi gui request
    return config;
  },
  function (error) {
    // Xu ly khi co loi request
    return Promise.reject(error);
  }
);

// Them interceptor de gan token vao header
instance.interceptors.request.use(
  function (config) {
    // Kiem tra neu co access token trong localStorage
    if (
      typeof window !== "undefined" &&
      window &&
      window.localStorage &&
      window.localStorage.getItem("access_token")
    ) {
      // Gan token vao Authorization header
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("access_token");
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  // Xu ly khi response thanh cong (status code 2xx)
  function (response) {
    // Tra ve data tu response
    return response.data;
  },
  // Xu ly khi response loi (status code khac 2xx)
  function (error) {
    // Neu co error response thi tra ve data cua no
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return Promise.reject(error);
  }
);

export default instance;
