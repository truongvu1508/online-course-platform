import CodeIcon from "@mui/icons-material/Code";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { Link } from "react-router-dom";
import { Tag } from "antd";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex shadow-lg bg-white">
      <div className="w-64 flex-shrink-0 flex items-center justify-center p-4 bg-primary">
        <Link to={"/"} className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-lg">
            <CodeIcon className="text-primary text-2xl" />
          </div>
          <span className="text-xl font-bold text-white">CodeLearn</span>
        </Link>
      </div>
      <div className="flex-1 p-4 flex items-center justify-end space-x-1">
        <p className="text-sm">
          Xin chào{" "}
          <span className="text-primary font-bold">{user.fullName}</span> -{" "}
        </p>
        <Tag color="purple">{user.role}</Tag>
      </div>
    </div>
  );
};

export default Header;
