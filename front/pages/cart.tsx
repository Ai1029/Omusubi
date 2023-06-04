import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import { CartContext } from "@/pages/_app";
import QuentityButton from "../components/QuentityButton";

// カートを見るページ
const CartPage: React.FC = () => {
  const { cart } = useContext(CartContext);
  console.log("cart", cart);

  const handleQuantityChange = (newQuantity: number, itemId: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
        };
      }
      return item;
    });
    // カートの更新処理
    // ...
  };

  return (
    <Layout>
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="mb-6 sm:mb-10 lg:mb-16">
            <p className="second-title">Cart</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:gap-6">
            {/* <!-- 商品 - start --> */}

            {cart.length === 0 ? (
              <p>カートは空です</p>
            ) : (
              <p>カートに以下の商品が入っています</p>
            )}
            {cart.map((item) => (
              <>
                <div className="flex flex-wrap gap-x-4 overflow-hidden rounded-lg border sm:gap-y-4 lg:gap-6">
                  <a
                    href="#"
                    className="group relative block h-48 w-32 overflow-hidden bg-gray-100 sm:h-56 sm:w-40"
                  >
                    <img
                      src={item.image}
                      loading="lazy"
                      alt="Photo by Thái An"
                      className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                    />
                  </a>

                  <div className="flex flex-1 flex-col justify-between py-4">
                    <div>
                      <p className="mb-1 inline-block text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl">
                        {item.name}
                      </p>

                      <span className="block text-gray-500">
                        {item.explanation}
                      </span>
                    </div>

                    <div>
                      <span className="mb-1 block font-bold text-gray-800 md:text-lg">
                        {item.price}円 / 1セット
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full justify-between border-t p-4 sm:w-auto sm:border-none sm:pl-0 lg:p-6 lg:pl-0">
                    <div className="flex flex-col items-start gap-2">
                      {cart.map((user) => (
                        <>
                          <p>{user.name}(ユーザー別にボタンをmap)宛の数量</p>
                          <QuentityButton
                            onQuantityChange={(newQuantity: number) =>
                              handleQuantityChange(newQuantity, item.id)
                            }
                          />
                        </>
                      ))}
                    </div>

                    <div className="ml-4 pt-3 md:ml-8 md:pt-2 lg:ml-16">
                      <span className="block font-bold text-gray-800 md:text-lg">
                        {item.price}円
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ))}
            {/* <!-- 商品 - end --> */}
          </div>

          {/* <!-- 支払い - start --> */}
          <div className="flex flex-col items-end gap-4">
            <div className="w-full rounded-lg bg-gray-100 p-4 sm:max-w-xs">
              <div className="space-y-1">
                <div className="flex justify-between gap-4 text-gray-500">
                  <span>小計</span>
                  <span>(商品の合計金額)円</span>
                </div>
                <div className="flex justify-between gap-4 text-gray-500">
                  <span>配送料</span>
                  <span>無料</span>
                </div>

                <div className="flex justify-between gap-4 text-gray-500">
                  <span>消費税</span>
                  <span>（小計の消費税を計算）円</span>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex items-start justify-between gap-4 text-gray-800">
                  <span className="text-lg font-bold">合計</span>

                  <span className="flex flex-col items-end">
                    <span className="text-lg font-bold">
                      (小計と消費税を足した金額)円
                    </span>
                  </span>
                </div>
                <span>
                  <span className="text-gray-500 text-sm">
                    ※お支払いは配送場所ごととなります
                  </span>
                </span>
              </div>
            </div>

            <button className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">
              注文
            </button>
          </div>
          {/* <!-- 支払い - end --> */}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
