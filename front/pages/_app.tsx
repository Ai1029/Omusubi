import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { ReactNode, createContext, useReducer, useState } from "react";
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

type CartItem = {
	plan: Plan;
	paidUser: User;
	receivedUser: User;
};

type CartAction = {
	type: string;
	payload: any;
};

// カートの初期状態
const initialCart: CartItem[] = [];

// カートのリデューサー関数
const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
	switch (action.type) {
		case "ADD_TO_CART":
			return [...state, action.payload];
		case "REMOVE_FROM_CART":
			return state.filter((item) => item.plan?.id !== action.payload);
		case "CLEAR_CART":
			return [];
		default:
			return state;
	}
};

// カートコンテキストの作成
export const CartContext = createContext<{
	cartState: CartItem[];
	order: CartItem;
	addToCart: (item: CartItem) => void;
	removeFromCart: (item: CartItem) => void;
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

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
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

	const addToCart = (item: CartItem) => {
		dispatch({ type: "ADD_TO_CART", payload: item });
	};

	const removeFromCart = (item: CartItem) => {
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

	return (
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
			<Component updateClientSecret={updateClientSecret} updateSubscriptionId={updateSubscriptionId} updateOrder={updateOrder} {...pageProps} />
		</CartContext.Provider>
	);
};

export default MyApp;
