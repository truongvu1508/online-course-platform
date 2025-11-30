import CodeIcon from "@mui/icons-material/Code";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { App } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const { message } = App.useApp();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser({
      id: "",
      email: "",
      fullName: "",
      role: "",
      avatar: "",
    });
    message.success("Đăng xuất thành công");
    navigate("/");
  };

  return (
    <div className="grid grid-cols-12 shadow-lg bg-white">
      <div className="col-span-2 flex items-center justify-center p-4 bg-primary">
        <Link to={"/"} className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-lg">
            <CodeIcon className="text-primary text-2xl" />
          </div>
          <span className="text-xl font-bold text-white">CodeLearn</span>
        </Link>
      </div>
      <div className="col-span-10 p-4 flex items-center justify-end space-x-4">
        <p className="text-sm">
          Xin chào Admin{" "}
          <span className="text-primary-600 bg-primary-200 px-2 py-0.5 rounded-lg font-medium">
            {user.fullName}
          </span>
        </p>
        <div className="h-8 w-px bg-gray-300"></div>
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="error"
          size="small"
          startIcon={<LogoutIcon />}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default Header;
