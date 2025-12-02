import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
