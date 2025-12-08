import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/site/Home";
import CoursesPage from "../pages/site/Courses";
import AboutPage from "../pages/site/About";
import ContactPage from "../pages/site/Contact";
import LoginPage from "../pages/site/Login";
import RegisterPage from "../pages/site/Register";
import VerifyEmailPage from "../pages/site/VerifyEmail";
import AdminLayout from "../layouts/AdminLayout";
import DashboardPage from "../pages/admin/Dashboard";
import CourseAdminPage from "../pages/admin/Course";
import OrderAdminPage from "../pages/admin/Order";
import StudentAdminPage from "../pages/admin/Student";
import CategoryAdminPage from "../pages/admin/Category";
import UserAdminPage from "../pages/admin/User";
import ProtectedRoute from "./ProtectedRoute";
import CourseDetailPage from "../pages/site/CourseDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "khoa-hoc", element: <CoursesPage /> },
      { path: "khoa-hoc/:slug", element: <CourseDetailPage /> },
      { path: "gioi-thieu", element: <AboutPage /> },
      { path: "lien-he", element: <ContactPage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "danh-muc-khoa-hoc", element: <CategoryAdminPage /> },
      { path: "khoa-hoc", element: <CourseAdminPage /> },
      { path: "don-hang", element: <OrderAdminPage /> },
      { path: "hoc-vien", element: <StudentAdminPage /> },
      { path: "nguoi-dung", element: <UserAdminPage /> },
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
