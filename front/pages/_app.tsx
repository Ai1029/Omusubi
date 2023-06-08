import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { ReactNode, createContext, useReducer, useState } from "react";
import { RecoilRoot } from "recoil";
export const MyContext = React.createContext<any>(null);

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<RecoilRoot>
			<Component {...pageProps} />
		</RecoilRoot>
	);
};

export default MyApp;
