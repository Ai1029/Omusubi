import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { ReactNode, createContext, useReducer, useState } from "react";
import { RecoilRoot } from "recoil";
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
const initialOrder: OrderItem = {
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
};

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
}>({
	cartState: [],
	order: initialOrder,
	addToCart: () => {},
	removeFromCart: () => {},
	clearCart: () => {},
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const [cartState, dispatch] = useReducer(cartReducer, initialCart);
	const [order, setOrder] = useState(initialOrder);

	const addToCart = (item: Plan) => {
		dispatch({ type: "ADD_TO_CART", payload: item });
	};

	const removeFromCart = (item: Plan) => {
		dispatch({ type: "REMOVE_FROM_CART", payload: item });
	};

	const clearCart = () => {
		dispatch({ type: "CLEAR_CART", payload: null });
	};
	const updateOrder = (newOrder: any) => {
		setOrder(newOrder);
	};

	return (
		<CartContext.Provider
			value={{
				cartState,
				addToCart,
				removeFromCart,
				clearCart,
				order,
			}}
		>
			<Component updateOrder={updateOrder} {...pageProps} />
		</CartContext.Provider>
	);
};

export default MyApp;
