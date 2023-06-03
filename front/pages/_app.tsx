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
		orderQuantity: 1,
		paidUser: {
			id: 1,
			name: "名前",
			email: "xxx@mail.com",
			family_id: 1,
			phonetic: "ナマエ",
			zipcode: "123-4567",
			prefecture: "東京都",
			city: "渋谷区",
			town: "渋谷1-1-1",
			apartment: "",
			phone_number: "090-0000-0000",
			is_owner: true,
		},
		receivedUser: {
			id: 2,
			name: "中村はなこ",
			email: "ppp@mail.com",
			family_id: 1,
			phonetic: "オトドケサキナマエ",
			zipcode: "987-7654",
			prefecture: "埼玉県",
			city: "さいたま市",
			town: "さいたま1-1-1",
			apartment: "",
			phone_number: "080-9999-9999",
			is_owner: false,
		},
	};

	return (
		<MyContext.Provider value={contextValue}>
			<Component {...pageProps} />
		</MyContext.Provider>
	);
}
