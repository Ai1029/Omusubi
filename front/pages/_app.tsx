import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReactNode, createContext, useReducer } from "react";

type Plan = {
  id: number;
  name: string;
  explanation: string;
  price: string;
  image: string;
};

type CartState = {
  id: number;
  name: string;
  explanation: string;
  price: string;
  image: string;
};

type Action = {
  type: string;
  payload: any;
};

// カートの状態を他のコンポーネントと共有
export const CartContext = createContext<{
  length: number;
  cart: CartState[];
  addToCart: (product: Plan) => void;
  removeFromCart: (product: Plan) => void;
}>({
  length: 0,
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
});

// カートの初期状態
const initialCart: CartState[] = [];

const cartReducer = (state: CartState[], action: Action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const { id, name, explanation, price, image } = action.payload;
      const newItem = { id, name, explanation, price, image };
      return [...state, newItem];
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);
    default:
      return state;
  }
};

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  // カートに商品を追加
  const addToCart = (plan: Plan) => {
    dispatch({ type: "ADD_TO_CART", payload: plan });
  };

  // カートから商品を削除
  const removeFromCart = (plan: Plan) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: plan.id });
  };

  return (
    <CartContext.Provider
      value={{ length: cart.length, cart, addToCart, removeFromCart }}
    >
      <Component {...pageProps} />
    </CartContext.Provider>
  );
};

export default MyApp;
