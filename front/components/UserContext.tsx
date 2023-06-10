import { GetServerSideProps } from "next";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

type ContextProps = {
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const UserContext = createContext<ContextProps>({
	isLoggedIn: false,
	setIsLoggedIn: () => {},
});

type Props = {
	apiURL: string;
	children: any;
};

export const UserContextProvider: React.FC<Props> = ({ children, apiURL }) => {
	const ENDPOINT_URL = `${apiURL}check-session`;
	const [isLoggedIn, setIsLoggedIn] = useState(false); // ユーザーのログイン状態を管理

	// ユーザーがログインしているかサーバーで確認する
	useEffect(() => {
		const checkSession = async () => {
			try {
				const response = await axios.get(ENDPOINT_URL, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setIsLoggedIn(true);
				}
			} catch (error) {
				console.error("Error checking session:", error);
			}
		};
		checkSession();
	}, []);

	return <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</UserContext.Provider>;
};
