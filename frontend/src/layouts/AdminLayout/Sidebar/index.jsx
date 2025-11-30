import React from "react";
import { Link, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import SchoolIcon from "@mui/icons-material/School";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import { colors } from "../../../utils/colors";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/admin",
    },
    {
      title: "Danh mục",
      icon: <CategoryIcon />,
      path: "/admin/danh-muc-khoa-hoc",
    },
    {
      title: "Khóa học",
      icon: <SchoolIcon />,
      path: "/admin/khoa-hoc",
    },
    {
      title: "Đơn hàng",
      icon: <ShoppingCartIcon />,
      path: "/admin/don-hang",
    },
    {
      title: "Học viên",
      icon: <PeopleIcon />,
      path: "/admin/hoc-vien",
    },
  ];

  return (
    <aside className="col-span-2 bg-white text-gray-800 border-r border-gray-200 min-h-full">
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
    </aside>
  );
};

export default Sidebar;
