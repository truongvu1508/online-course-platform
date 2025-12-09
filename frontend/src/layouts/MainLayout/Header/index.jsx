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
import { CartContext } from "../../../contexts/cart.context";
import Popover from "@mui/material/Popover";
import { formatVND } from "../../../utils/formatters";
import { removeCourseFromCarte } from "../../../services/student/cart.service";
import { orderFromCartService } from "../../../services/student/order.service";

const Header = () => {
  const { user, setUser, appLoading } = useContext(AuthContext);
  const { refreshCart, cartInfo } = useContext(CartContext);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { message } = App.useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const cartOpen = Boolean(cartAnchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCartOpen = (event) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleRemoveCourseFromCart = async (courseId) => {
    try {
      setLoadingCart(true);
      const res = await removeCourseFromCarte(courseId);

      if (res.success) {
        message.success(res.message);
        refreshCart();
      } else {
        message.warning(res.message);
      }
    } catch (error) {
      message.error("Không thể xóa khóa học khỏi giỏ hàng");
      console.log(error);
    } finally {
      setLoadingCart(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoadingPayment(true);
      const res = await orderFromCartService();

      if (res.success) {
        message.success(res.message);
        window.location.href = res.data.paymentInfo;
      } else {
        message.warning(res.message);
      }
    } catch (error) {
      message.error("Thanh toán thất bại");
      console.log(error);
    } finally {
      setLoadingPayment(false);
    }
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
              <IconButton
                aria-label="cart"
                onClick={handleCartOpen}
                aria-owns={cartOpen ? "mouse-open-cart" : undefined}
                aria-haspopup="true"
              >
                <Badge
                  badgeContent={cartInfo ? cartInfo.items.length : 0}
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
            <Popover
              id="mouse-open-cart"
              open={cartOpen}
              anchorEl={cartAnchorEl}
              onClose={handleCartClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              {cartInfo ? (
                cartInfo.items.length === 0 ? (
                  <div className="p-5 text-primary">
                    <p className="italic">
                      Chưa có khóa học nào trong giỏ hàng
                    </p>
                  </div>
                ) : (
                  <div className="p-5 w-[300px] mb-3 ">
                    <div>
                      {cartInfo.items.map((cartItem) => (
                        <div
                          key={cartItem.courseId._id}
                          className="border-b border-gray-300 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-[150px] relative">
                              <img
                                src={cartItem.courseId.thumbnail}
                                alt={cartItem.courseId.title}
                              />
                              <div
                                onClick={() =>
                                  handleRemoveCourseFromCart(
                                    cartItem.courseId._id
                                  )
                                }
                                className="absolute -top-2 -left-2 cursor-pointer bg-red-500 rounded-full w-[16px] h-[16px] flex items-center justify-center"
                              >
                                <p className="text-white">x</p>
                              </div>
                            </div>
                            <div>
                              <p className="mb-1 text-primary text-sm font-semibold line-clamp-2">
                                {cartItem.courseId.title}
                              </p>
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-gray-500 font-semibold line-through">
                                  {formatVND(cartItem.courseId.price)}
                                </p>
                                <p className="text-sm text-primary">
                                  {formatVND(
                                    cartItem.courseId.price -
                                      (cartItem.courseId.price *
                                        cartItem.courseId.discount) /
                                        100
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-[16px]">
                        <p className="text-base">Tổng tiền:</p>
                        <p className="text-base text-primary font-bold">
                          {formatVND(cartInfo.totalPrice)}
                        </p>
                      </div>
                      <Button
                        onClick={handlePayment}
                        variant="contained"
                        className="!w-full"
                        size="small"
                        loading={loadingPayment}
                      >
                        Thanh toán
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-5 text-primary">
                  <p className="italic">Vui lòng đăng nhập</p>
                </div>
              )}
            </Popover>
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
                    <MenuItem onClick={() => navigate("/admin")}>
                      <ListItemIcon>
                        <AdminPanelSettingsIcon fontSize="small" />
                      </ListItemIcon>
                      Trang quản trị
                    </MenuItem>
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
                <Button variant="contained">Đăng nhập</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
