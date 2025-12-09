import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { App, ConfigProvider } from "antd";
import { AuthWrapper } from "./contexts/auth.context.jsx";
import { CartWrapper } from "./contexts/cart.context.jsx";
import viVN from "antd/locale/vi_VN";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#512DA8",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      locale={viVN}
      theme={{ token: { colorPrimary: "#512DA8" } }}
    >
      <ThemeProvider theme={muiTheme}>
        <AuthWrapper>
          <CartWrapper>
            <App>
              <RouterProvider router={router} />
            </App>
          </CartWrapper>
        </AuthWrapper>
      </ThemeProvider>
    </ConfigProvider>
  </StrictMode>
);
