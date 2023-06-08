import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { parseCookies } from "nookies";
import axios from "axios";

import React, {
  ReactNode,
  createContext,
  useReducer,
  useState,
  useEffect,
} from "react";

export const MyContext = React.createContext<any>(null);

type Plan = {
  id: number;
  name: string;
  explanation: string;
  price: string;
  image: string;
  stripe_price_id: string;
};
type User = {
  id: number;
  name: string;
  email: string;
  family_id: number;
  phonetic: string;
  postal_code: string;
  state: string;
  city: string;
  line1: string;
  line2: string;
  apartment: string;
  phone_number: string;
  is_owner: boolean;
};

type OrderItem = {
  plan: Plan;
  paidUser: User;
  receivedUser: User;
};

type CartAction = {
  type: string;
  payload: any;
};

// カートの初期状態
const initialCart: Plan[] = [];

// カートのリデューサー関数
const cartReducer = (state: Plan[], action: CartAction): Plan[] => {
  switch (action.type) {
    case "ADD_TO_CART":
      return [...state, action.payload];
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload.id);
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

// カートコンテキストの作成
export const CartContext = createContext<{
  cartState: Plan[];
  order: OrderItem;
  addToCart: (item: Plan) => void;
  removeFromCart: (item: Plan) => void;
  clearCart: () => void;
  clientSecret: string;
  subscriptionId: string;
}>({
  cartState: [],
  order: {
    plan: {
      id: 0,
      name: "",
      explanation: "",
      price: "",
      image: "",
      stripe_price_id: "",
    },
    paidUser: {
      id: 0,
      name: "",
      email: "",
      family_id: 0,
      phonetic: "",
      postal_code: "",
      state: "",
      city: "",
      line1: "",
      line2: "",
      apartment: "",
      phone_number: "",
      is_owner: true,
    },
    receivedUser: {
      id: 0,
      name: "",
      email: "",
      family_id: 0,
      phonetic: "",
      postal_code: "",
      state: "",
      city: "",
      line1: "",
      line2: "",
      apartment: "",
      phone_number: "",
      is_owner: false,
    },
  },
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  clientSecret: "",
  subscriptionId: "",
});

// ユーザーコンテキストの作成
export const UserContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ユーザーのログイン状態を管理
  const [cartState, dispatch] = useReducer(cartReducer, initialCart);
  const [clientSecret, setClientSecret] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [order, setOrder] = useState({
    plan: {
      id: 0,
      name: "",
      explanation: "",
      price: "",
      image: "",
      stripe_price_id: "",
    },
    paidUser: {
      id: 0,
      name: "",
      email: "",
      family_id: 0,
      phonetic: "",
      postal_code: "",
      state: "",
      city: "",
      line1: "",
      line2: "",
      apartment: "",
      phone_number: "",
      is_owner: true,
    },
    receivedUser: {
      id: 0,
      name: "",
      email: "",
      family_id: 0,
      phonetic: "",
      postal_code: "",
      state: "",
      city: "",
      line1: "",
      line2: "",
      apartment: "",
      phone_number: "",
      is_owner: false,
    },
  });

  const addToCart = (item: Plan) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (item: Plan) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART", payload: null });
  };
  const updateClientSecret = (newClientSecret: string) => {
    setClientSecret(newClientSecret);
  };

  const updateSubscriptionId = (newSubscriptionId: string) => {
    setSubscriptionId(newSubscriptionId);
  };
  const updateOrder = (newOrder: any) => {
    setOrder(newOrder);
  };

  // クッキーからログイン状態を読み取る
  //   useEffect(() => {
  //     const cookies = parseCookies(null, {
  //       domain: "localhost",
  //       path: "/",
  //     }); // クッキーの取得
  //     console.log("cookies", cookies);
  //     const sessionID = cookies.sessionID; // セッションIDを取得
  //     console.log("sessionID", sessionID);
  //     // セッションIDが存在する場合はログイン状態を更新
  //     if (sessionID) {
  //       setIsLoggedIn(true);
  //     }
  //   }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/session")
      .then((response) => {
        const cookieValue = response.headers["x-cookie-value"];
        console.log("Cookie Value:", cookieValue);
        // Cookieがあれば、setIsLoggedInをtrueにする
        if (cookieValue) {
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching cookie value:", error);
      });
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <CartContext.Provider
        value={{
          cartState,
          addToCart,
          removeFromCart,
          clearCart,
          clientSecret,
          subscriptionId,
          order,
        }}
      >
        <Component
          updateClientSecret={updateClientSecret}
          updateSubscriptionId={updateSubscriptionId}
          updateOrder={updateOrder}
          {...pageProps}
        />
      </CartContext.Provider>
    </UserContext.Provider>
  );
};

export default MyApp;
