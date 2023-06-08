import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { ReactNode, createContext, useReducer, useState, useEffect } from "react";
import { RecoilRoot} from "recoil";
import { parseCookies } from "nookies";
import axios from "axios";

export const MyContext = React.createContext<any>(null);
// ユーザーコンテキストの作成
export const UserContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ユーザーのログイン状態を管理

  //　ユーザーがログインしているかサーバーで確認する
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/check-session",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    checkSession();
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </UserContext.Provider>
  );
};

export default MyApp;
