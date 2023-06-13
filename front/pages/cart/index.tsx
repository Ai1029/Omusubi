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
  }, [cart]);

  const handlePurchase = async (order: any) => {
    setOrder(order);
    router.push("/register");
  };
  if (!isMounted) {
    return null; // マウント前は何も表示せずにロード中とする
  }

  return (
    <Layout>
      <div>
        <div className="container mt-10 flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
          <div className="py-6 sm:py-8 lg:py-12">
            <div className="mb-6 sm:mb-10 lg:mb-16">
              <h2 className="second-title mr-4">Cart</h2>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:gap-6">
              {cart.map((item, i) => (
                <div key={i} className="flex w-full border border-gray-100 overflow-hidden bg-white rounded-lg shadow-lg">
                  <div className="w-2/5 bg-gray-100 rounded-tl-xl py-3 px-4 md:py-4 md:px-5 dark:bg-gray-800 dark:border-gray-700">{item.receivedUser.is_owner ? <h2 className="mt-1 text-sm text-gray-500 dark:text-gray-500">自宅に配送</h2> : <h2 className="mt-1 text-sm text-gray-500 dark:text-gray-500">{item.receivedUser.name}様に配送</h2>}</div>
                  <div className="flex flex-col w-2/3">
                    <img src={item.plan.image} className="h-full w-full object-cover object-center transition duration-100 group-hover:scale-110" />
                  </div>
                  <div className="mt-4 w-full px-2 py-2 mx-4 my-4">
                    <h3 className="text-sm">商品: {item.plan.name}</h3>
                    <p className="text-sm">価格: {item.plan.price.toLocaleString()}円</p>
                    <p className="text-sm mb-5">詳細: {item.plan.explanation}</p>
                    <div>
                      <h3 className="text-sm font-bold mt-1 mb-1">配送先</h3>
                      <p className="text-basic">{item.receivedUser.name}</p>
                      <p>{item.receivedUser.zipcode}</p>
                      <p>{item.receivedUser.prefecture}</p>
                      <p>{item.receivedUser.city}</p>
                      <p>{item.receivedUser.town}</p>
                      <p>{item.receivedUser.apartment}</p>
                      <p>{item.receivedUser.phone_number}</p>
                    </div>
                  </div>
                  <button onClick={() => handlePurchase(item)} className="px-3 py-3 text-sm font-medium text-center mx-4 my-4 text-blue-500 hover:text-blue-700 transition duration-500 ease-in-out transform border-2 border-blue-500 hover:border-blue-700 rounded-md">
                    購入する
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
