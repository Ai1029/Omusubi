import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { createContext, useState, useEffect } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import { isLoggedInState, userIDState } from "@/state/atom";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {


	return (
		<RecoilRoot>
			<Component {...pageProps} />
		</RecoilRoot>
	);
};

export default MyApp;
