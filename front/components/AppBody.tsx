import React, { ReactNode, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { cartState, isLoggedInState, userIDState, familyIDState, familyState, mySubState, familySubState, orderHistory } from "@/state/atom";
import axios from "axios";

interface Props {
  children: ReactNode;
}

const AppBody = ({ children }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const ENDPOINT_URL_SESSION = apiUrl + "check-session";
  const ENDPOINT_URL_MY_SUB = apiUrl + "subscriptions-receiveduser";
  const ENDPOINT_URL_FAMILY_SUB = apiUrl + "subscriptions-width-family";
  const ENDPOINT_URL_ORDERS = apiUrl + "orders";
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [userID, setUserID] = useRecoilState(userIDState);
  const [familyID, setFaimilyID] = useRecoilState(familyIDState);
  const [family, setFamily] = useRecoilState(familyState);
  const [cart, setCart] = useRecoilState(cartState);
  const [mySub, setMySub] = useRecoilState(mySubState);
  const [familySub, setFamilySub] = useRecoilState(familySubState);
  const [order, setOrderHistory] = useRecoilState(orderHistory);
  const [isMounted, setIsMounted] = useState(false);
  //　ユーザーがログインしているかサーバーで確認する
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(ENDPOINT_URL_SESSION, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
          const userID = response.data.user_id;
          const familyID = response.data.family_id;
          const familyData = response.data.family;
          setUserID(userID);
          setFaimilyID(familyID);
          setFamily(familyData);
          const resMySub = await axios.get(ENDPOINT_URL_MY_SUB + "/" + userID);
          const resFamilySub = await axios.get(ENDPOINT_URL_FAMILY_SUB + "/" + userID);
          const resOrderHistory = await axios.get(ENDPOINT_URL_ORDERS + "/" + userID);
          setMySub(resMySub.data);
          setFamilySub(resFamilySub.data);
          setOrderHistory(resOrderHistory.data);
        }
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
