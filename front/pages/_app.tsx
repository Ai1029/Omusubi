import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { ReactNode, createContext, useReducer, useState, useEffect } from "react";
import { RecoilRoot } from "recoil";
import axios from "axios";

// ユーザーコンテキストの作成
export const UserContext = createContext<{
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
	userID: number;
}>({
	isLoggedIn: false,
	setIsLoggedIn: () => {},
	userID: 0,
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false); // ユーザーのログイン状態を管理
	const [userID, setUserID] = useState(0); // ユーザーのログイン状態を管理
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	const ENDPINST_URL = apiUrl + "check-session";

	//　ユーザーがログインしているかサーバーで確認する
	useEffect(() => {
		const checkSession = async () => {
			try {
				const response = await axios.get(ENDPINST_URL, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setIsLoggedIn(true);
				}
				const userID = response.data.user_id;
				setUserID(userID);
			} catch (error) {
				console.error("Error checking session:", error);
			}
		};
		checkSession();
	}, []);

	return (
		<UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userID }}>
			<RecoilRoot>
				<Component {...pageProps} />
			</RecoilRoot>
		</UserContext.Provider>
	);
};

export default MyApp;
