import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { ReactNode, createContext, useReducer } from "react";
export const MyContext = React.createContext<any>(null);
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
	const contextValue = {
		plan: {
			id: 1,
			name: "プランA",
			explanation: "詳細テスト 筑前煮、肉じゃが等",
			price: 1000,
			image: "https://s3.ap-northeast-1.amazonaws.com/omusubi.inc/shop/1685521259743-w_A.jpg",
			stripe_price_id: "price_1NDZZSI8t6lPUIZhQOPQFe8D",
		},
		orderTotalPrice: 1000,
		orderQuantity: 1,
		paidUser: {
			id: 1,
			name: "てすと名前",
			email: "tetetete@mail.com",
			family_id: 1,
			phonetic: "ナマエ",
			postal_code: "123-4567",
			state: "東京都",
			city: "渋谷区",
			line1: "渋谷",
			line2: "1-1-1",
			apartment: "",
			phone_number: "09000000000",
			is_owner: true,
		},
		receivedUser: {
			id: 2,
			name: "てすと家族の名前",
			email: "",
			family_id: 1,
			phonetic: "オトドケサキナマエ",
			postal_code: "987-7654",
			state: "埼玉県",
			city: "さいたま市",
			line1: "さいたま",
			line2: "1-1-1",
			apartment: "",
			phone_number: "08099999999",
			is_owner: false,
		},
	};

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
		<CartContext.Provider value={{ length: cart.length, cart, addToCart, removeFromCart }}>
			<Component {...pageProps} />
		</CartContext.Provider>
		// <MyContext.Provider value={contextValue}>
		// <Component {...pageProps} />
		// </MyContext.Provider>
	);
};

export default MyApp;
