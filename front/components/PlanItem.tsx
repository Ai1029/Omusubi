// プラン一覧の各プランを表示するコンポーネント
import React, { useContext, useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { parseCookies } from "nookies";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState, familyState, isLoggedInState } from "@/state/atom";
import PlanCartBtn from "./PlanCartBtn";
type TypePlan = {
  id: number;
  name: string;
  explanation: string;
  price: string;
  image: string;
  stripe_price_id: string;
};
type Props = {
  plan: TypePlan;
};

export const PlanItem: NextPage<Props> = ({ plan }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [cart, setCart] = useRecoilState(cartState);
  const family = useRecoilValue(familyState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToCart = (planId: number) => {
    setCart((prevCart: any) => {
      if (!Array.isArray(prevCart)) {
        prevCart = []; // 配列でない場合は空の配列を使用
      }
      const filteredFamilyIds = family
        .filter((familyItem) => {
          return cart.some((cartItem) => cartItem.plan.id === planId && cartItem.receivedUser.id === familyItem.id) === false;
        })
        .map((familyItem) => familyItem.id);

      if (!filteredFamilyIds) {
        return prevCart; // カートに既に同じ商品がある場合は変更せずにそのまま返す
      }
      const cartItem = family
        .map((elm) => {
          if (filteredFamilyIds.includes(elm.id)) {
            return {
              plan: plan,
              paidUser: paidUser,
              receivedUser: elm,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      const updatedCart = [...prevCart, ...cartItem];
      localStorage.setItem("cart-items", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (planId: number) => {
    setCart((prevCart: any) => {
      if (!Array.isArray(prevCart)) {
        prevCart = []; // 配列でない場合は空の配列を使用
      }
      const updatedCart = prevCart.filter((item: any) => item.plan.id !== planId);
      localStorage.setItem("cart-items", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  if (!isMounted) {
    return null; // マウント前は何も表示せずにロード中とする
  }

  const filteredCart = cart.filter((item) => {
    return item.plan.id === plan.id;
  });
  const receivedUserIds = filteredCart.map((item) => item.receivedUser.id);
  const familyIds = family.map((user) => user.id);
  const hasAllFamilyIds = familyIds.every((id) => receivedUserIds.includes(id));

  const paidUser = family.find((user) => user.is_owner === true);

  return (
    <>
      <div key={plan.id} className="flex mx-auto w-50 flex-col justify-center bg-white rounded-2xl shadow-xl shadow-gray-400/20">
        <img src={plan.image} alt={plan.name} className="aspect-video w-50 rounded-t-2xl object-cover object-center" />
        <div className="flex flex-col justify-between h-full p-6">
          <h3 className="text-xl font-semibold text-gray-600 pb-2">{plan.name}</h3>
          <p className="text text-gray-500 leading-6">{plan.explanation}</p>
          <p className="text text-gray-500 leading-6">{plan.price.toLocaleString()}円</p>
        </div>

        {!isLoggedIn ? (
          <div className="items-center block h-full px-2 py-2 text-sm font-medium text-center mx-4 my-4 text-blue-500  hover:text-blue-700 transition duration-500 ease-in-out transform border-2 border-blue-500 hover:border-blue-700 rounded-md">
            <Link href="/login">ログインしてカートに追加</Link>
          </div>
        ) : (
          <div>
            <ul>
              {family.map((user) => (
                <li key={user.id}>
                  <PlanCartBtn user={user} plan={plan} paidUser={paidUser!} />
                </li>
              ))}
            </ul>
            {family.length > 1 && (
              <div>
                {hasAllFamilyIds ? (
                  <button onClick={() => removeFromCart(plan.id)} className="items-center block h-full px-2 py-2 text-sm font-medium text-center mx-4 my-4 text-blue-500 hover:text-blue-700 transition duration-500 ease-in-out transform border-2 border-blue-500 hover:border-blue-700 rounded-md">
                    まとめてカートから削除
                  </button>
                ) : (
                  <button onClick={() => addToCart(plan.id)} className="items-center block h-full px-2 py-2 text-sm font-medium text-center mx-4 my-4 bg-blue-500 hover:bg-blue-700 text-white  transition duration-500 ease-in-out transform border-2 border-blue-500 hover:border-blue-700 rounded-md">
                    まとめてカートに追加
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PlanItem;
