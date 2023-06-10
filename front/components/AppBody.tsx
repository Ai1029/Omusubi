import React, { ReactNode, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { cartState, isLoggedInState, userIDState, familyState } from "@/state/atom";
import axios from "axios";

interface Props {
  children: ReactNode;
}

const AppBody = ({ children }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const ENDPINST_URL = apiUrl + "check-session";
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [userID, setUserID] = useRecoilState(userIDState);
  const [family, setFamily] = useRecoilState(familyState);
  const [cart, setCart] = useRecoilState(cartState);
  const [isMounted, setIsMounted] = useState(false);
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
        const familyData = response.data.family;
        setUserID(userID);
        setFamily(familyData);
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    checkSession();

    const storedValue = localStorage.getItem("cart-items");
    if (storedValue) {
      const parsedCart = JSON.parse(storedValue);
      setCart(parsedCart);
    }
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null; // マウント前は何も表示せずにロード中とする
  }

  return (
    <>
      <div>{children}</div>
    </>
  );
};

export default AppBody;
