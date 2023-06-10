import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { RecoilRoot } from "recoil";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<RecoilRoot>
			<Component {...pageProps} />
		</RecoilRoot>
	);
};

export default MyApp;
