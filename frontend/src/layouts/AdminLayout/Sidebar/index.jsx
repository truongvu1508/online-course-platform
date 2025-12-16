import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PersonIcon from "@mui/icons-material/Person";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { colors } from "../../../utils/colors";
import { App } from "antd";
import { AuthContext } from "../../../contexts/auth.context";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  const { setUser } = useContext(AuthContext);
  const { message } = App.useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <AnalyticsIcon />,
      path: "/admin",
    },
    {
      title: "Danh mục",
      icon: <CollectionsBookmarkIcon />,
      path: "/admin/danh-muc-khoa-hoc",
    },
    {
      title: "Khóa học",
      icon: <AutoStoriesIcon />,
      path: "/admin/khoa-hoc",
    },
    {
      title: "Đơn hàng",
      icon: <ShoppingCartIcon />,
      path: "/admin/don-hang",
    },
    {
      title: "Người dùng",
      icon: <PersonIcon />,
      path: "/admin/nguoi-dung",
    },
  ];

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
    <aside className="w-64 bg-white text-gray-800 border-r border-gray-200 flex-shrink-0 flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quản trị
        </h2>
        <List component="nav" disablePadding>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  borderRadius: "8px",
                  mb: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: colors.primary[100],
                    color: colors.primary.DEFAULT,
                    "& .MuiListItemIcon-root": {
                      color: colors.primary.DEFAULT,
                    },
                    "&:hover": {
                      backgroundColor: colors.primary[200],
                    },
                  },
                  "&:hover": {
                    backgroundColor: colors.primary[50],
                    color: colors.primary.DEFAULT,
                    "& .MuiListItemIcon-root": {
                      color: colors.primary.DEFAULT,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? colors.primary.DEFAULT : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </div>
      <div className="w-full flex justify-center mb-3">
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="error"
          size="large"
          startIcon={<LogoutIcon />}
        >
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
