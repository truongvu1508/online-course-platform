import { createContext, useEffect, useState } from "react";
import { getAccountService } from "../services/shared/auth.service";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({
  id: "",
  email: "",
  fullName: "",
  role: "",
  avatar: "",
});

export const AuthWrapper = (props) => {
  const [user, setUser] = useState({
    id: "",
    email: "",
    fullName: "",
    role: "",
    avatar: "",
  });

  const [appLoading, setAppLoading] = useState(true);

  const fetchAccountInfo = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setAppLoading(false);
      return;
    }
    try {
      const res = await getAccountService();
      console.log(res);

      if (res.data) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Fetch account error:", error);
      localStorage.removeItem("access_token");
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  return (
    <AuthContext value={{ user, setUser, appLoading, setAppLoading }}>
      {props.children}
    </AuthContext>
  );
};
