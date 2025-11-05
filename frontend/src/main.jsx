import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { App } from "antd";
import { AuthWrapper } from "./contexts/auth.context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrapper>
      <App>
        <RouterProvider router={router} />
      </App>
    </AuthWrapper>
  </StrictMode>
);
