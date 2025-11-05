import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/site/Home";
import CoursesPage from "../pages/site/Courses";
import AboutPage from "../pages/site/About";
import ContactPage from "../pages/site/Contact";
import LoginPage from "../pages/site/Login";
import RegisterPage from "../pages/site/Register";
import VerifyEmailPage from "../pages/site/VerifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/khoa-hoc", element: <CoursesPage /> },
      { path: "/gioi-thieu", element: <AboutPage /> },
      { path: "/lien-he", element: <ContactPage /> },
    ],
  },
  {
    path: "/dang-nhap",
    element: <LoginPage />,
  },
  {
    path: "/dang-ky-tai-khoan",
    element: <RegisterPage />,
  },
  {
    path: "/xac-thuc-tai-khoan",
    element: <VerifyEmailPage />,
  },
]);

export default router;
