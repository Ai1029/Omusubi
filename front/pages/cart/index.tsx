import React, { useContext, useState, useEffect } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import QuantityButton from "@/components/QuantityButton";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import { cartState, orderState } from "@/state/atom";

// カートを見るページ
const CartPage: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useRecoilValue(cartState);
  const router = useRouter();
  const [order, setOrder] = useRecoilState(orderState);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePurchase = async (order: any) => {
    setOrder(order);
    router.push("/register");
  };
  if (!isMounted) {
    return null; // マウント前は何も表示せずにロード中とする
  }

  return (
    <Layout>
      <div className="container mt-10 flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <h2 className="second-title mr-4">Cart</h2>
        {cart.map((item, i) => (
          <div key={i}>
            {item.receivedUser.is_owner ? (
              <h2>自宅に配送</h2>
            ) : (
              <h2>{item.receivedUser.name}に配送</h2>
            )}
            <div>
              <h3>商品: {item.plan.name}</h3>
              <p>価格: {item.plan.price}</p>
              <p>詳細: {item.plan.explanation}</p>
              <div>
                <img src={item.plan.image} />
              </div>
            </div>
            <div>
              <h3>配送先</h3>
              <p>{item.receivedUser.name}</p>
              <p>{item.receivedUser.zipcode}</p>
              <p>{item.receivedUser.prefecture}</p>
              <p>{item.receivedUser.city}</p>
              <p>{item.receivedUser.town}</p>
              <p>{item.receivedUser.apartment}</p>
              <p>{item.receivedUser.phone_number}</p>
            </div>
            <button onClick={() => handlePurchase(item)}>購入する</button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default CartPage;
