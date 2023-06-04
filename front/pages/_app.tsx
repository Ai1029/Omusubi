import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
export const MyContext = React.createContext<any>(null);

export default function App({ Component, pageProps }: AppProps) {
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

	return (
		<MyContext.Provider value={contextValue}>
			<Component {...pageProps} />
		</MyContext.Provider>
	);
}
