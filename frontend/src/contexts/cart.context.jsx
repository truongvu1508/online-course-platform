import { createContext, useContext, useEffect, useState } from "react";
import { getCardOfStudentService } from "../services/student/cart.service";
import { AuthContext } from "./auth.context";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext({
  cartInfo: null,
  cartLoading: false,
  refreshCart: () => {},
});

export const CartWrapper = (props) => {
  const { user } = useContext(AuthContext);
  const [cartInfo, setCartInfo] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user?.id) {
      setCartInfo(null);
      return;
    }

    setCartLoading(true);
    try {
      const res = await getCardOfStudentService();
      if (res.success) {
        setCartInfo(res.data);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
      setCartInfo(null);
    } finally {
      setCartLoading(false);
    }
  };

  const refreshCart = () => {
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [user?.id]);

  return (
    <CartContext.Provider value={{ cartInfo, cartLoading, refreshCart }}>
      {props.children}
    </CartContext.Provider>
  );
};
