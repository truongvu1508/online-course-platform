import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <p>© 2025 CodeLearn Admin Panel. All rights reserved.</p>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-primary transition-colors">
            Hỗ trợ
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-primary transition-colors">
            Tài liệu
          </a>
          <span className="text-gray-300">|</span>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
