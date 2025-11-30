import CodeIcon from "@mui/icons-material/Code";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { colors } from "../../../utils/colors";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { App } from "antd";
import Skeleton from "@mui/material/Skeleton";

const Header = () => {
  const { user, setUser, appLoading } = useContext(AuthContext);
  const { message } = App.useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/khoa-hoc", label: "Khóa học" },
    { path: "/gioi-thieu", label: "Giới thiệu" },
    { path: "/lien-he", label: "Liên hệ" },
  ];

  const getRoleDisplayName = (role) => {
    const roleMap = {
      ADMIN: "Quản trị viên",
      USER: "Người dùng",
      STUDENT: "Học viên",
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      ADMIN: "#dc2626",
      TEACHER: "#2563eb",
      STUDENT: "#311B92",
    };
    return roleColors[role] || "#6b7280";
  };

  const getRoleBackground = (role) => {
    const roleBackgrounds = {
      ADMIN: "#fee2e2",
      TEACHER: "#dbeafe",
      STUDENT: "#D1C4E9",
    };
    return roleBackgrounds[role] || "#f3f4f6";
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={"/"} className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <CodeIcon className="text-white text-2xl" />
            </div>
            <span className="text-xl font-bold text-primary">CodeLearn</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `link-menu text-gray-600 hover:text-primary text-base font-bold transition-colors ${
                    isActive ? "active" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="actions flex items-center gap-3">
            <Tooltip title="Giỏ hàng" placement="bottom">
              <IconButton aria-label="cart">
                <Badge
                  badgeContent={0}
                  showZero={true}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{
                    "& .MuiBadge-badge": {
                      border: "2px solid #fff",
                      padding: "0 4px",
                      backgroundColor: colors.primary.DEFAULT,
                      color: "#fff",
                    },
                  }}
                >
                  <ShoppingCartIcon className="text-primary" />
                </Badge>
              </IconButton>
            </Tooltip>
            {appLoading ? (
              <Box>
                <Tooltip title="Đang tải...">
                  <IconButton size="small" disabled>
                    <Skeleton
                      variant="circular"
                      width={32}
                      height={32}
                      animation="wave"
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : user?.id ? (
              <div>
                <Box>
                  <Tooltip title="Quản lý tài khoản">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <Avatar
                        src={
                          user.avatar ||
                          "https://res.cloudinary.com/dopxef4b6/image/upload/v1758810804/DuxProject/users/avatars/j0rmvon92t1dhujbanxh.png"
                        }
                        sx={{
                          width: 32,
                          height: 32,
                          border: "2px solid #fff",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiMenuItem-root": {
                          fontSize: "14px",
                        },
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleClose}>
                    <div className="flex items-center justify-center">
                      <Avatar
                        src={
                          user.avatar ||
                          "https://res.cloudinary.com/dopxef4b6/image/upload/v1758810804/DuxProject/users/avatars/j0rmvon92t1dhujbanxh.png"
                        }
                        sx={{
                          width: 32,
                          height: 32,
                          border: "2px solid #fff",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      />
                      <div className="flex flex-col">
                        <h3 className="text-sm">{user.fullName}</h3>
                        <span className="text-xs">{user.email}</span>
                        <span
                          className="text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block w-fit"
                          style={{
                            color: getRoleColor(user.role),
                            backgroundColor: getRoleBackground(user.role),
                          }}
                        >
                          {getRoleDisplayName(user.role)}
                        </span>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose} className="text-sm">
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    Thông tin tài khoản
                  </MenuItem>

                  {user.role === "ADMIN" ? (
                    <>
                      <MenuItem onClick={() => navigate("/admin")}>
                        <ListItemIcon>
                          <AdminPanelSettingsIcon fontSize="small" />
                        </ListItemIcon>
                        Trang quản trị
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <MenuBookIcon fontSize="small" />
                        </ListItemIcon>
                        Khóa học của tôi
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <LocalMallIcon fontSize="small" />
                        </ListItemIcon>
                        Đơn hàng của tôi
                      </MenuItem>
                    </>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <Link to={"/dang-nhap"}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.primary.DEFAULT,
                    "&:hover": {
                      backgroundColor: colors.secondary,
                    },
                  }}
                >
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
