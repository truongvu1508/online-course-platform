import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { App, ConfigProvider } from "antd";
import { AuthWrapper } from "./contexts/auth.context.jsx";
import viVN from "antd/locale/vi_VN";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      locale={viVN}
      theme={{ token: { colorPrimary: "#512DA8" } }}
    >
      <AuthWrapper>
        <App>
          <RouterProvider router={router} />
        </App>
      </AuthWrapper>
    </ConfigProvider>
  </StrictMode>
);
