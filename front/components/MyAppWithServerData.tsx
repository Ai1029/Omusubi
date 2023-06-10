import { AppProps } from 'next/app';
import { GetServerSideProps } from "next";
import React, { ReactNode } from "react";
import { UserContextProvider } from "./UserContext";
import MyApp from '@/pages/_app';


const MyAppWithServerData: React.FC<AppProps & { apiURL: string }> = ({ Component, pageProps, apiURL, router }) => {
  return (
    <UserContextProvider apiURL={apiURL}>
      <MyApp Component={Component} pageProps={pageProps} router={router} />
    </UserContextProvider>
  );
};

export default MyAppWithServerData;

export const getServerSideProps: GetServerSideProps = async () => {
	const apiURL = process.env.API_URL;
	return {
		props: {
			apiURL: apiURL,
		},
	};
};
