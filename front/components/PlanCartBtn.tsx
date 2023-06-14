import React, { useContext, useState, useEffect } from "react";
import { NextPage } from "next";
import { useRecoilState } from "recoil";
import { cartState } from "@/state/atom";

type TypePlan = {
  id: number;
  name: string;
  explanation: string;
  price: string;
  image: string;
  stripe_price_id: string;
};
type TypeUser = {
  id: number;
  name: string;
  email: string;
  uid: string;
  family_id: number;
  phonetic: string;
  zipcode: string;
  prefecture: string;
  city: string;
  town: string;
  apartment: string | null;
  phone_number: string;
  is_owner: boolean;
  is_virtual_user: boolean;
};
type TypeOrder = {
  plan: TypePlan;
  paid_user: TypeUser;
  receiverd_user: TypeUser;
};
type Props = {
  plan: TypePlan;
  user: TypeUser;
  paidUser: TypeUser;
  registeredPlan: any;
};

interface Plan {
  received_user: {
    id: number;
  };
}

const PlanCartBtn: NextPage<Props> = ({ plan, user, paidUser, registeredPlan }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [cart, setCart] = useRecoilState(cartState);
  let isRegistered = false;
  if (registeredPlan.length > 0) {
    isRegistered = registeredPlan.some((item: any) => item.received_user.id === user.id);
    console.log(isRegistered);
  }

  useEffect(() => {
    setIsMounted(true);
  }, [cart]);

  const addToCart = (planId: number) => {
    setCart((prevCart: any) => {
      if (!Array.isArray(prevCart)) {
        prevCart = []; // 配列でない場合は空の配列を使用
      }
      if (prevCart.find((item: any) => item.plan.id === plan.id && item.receivedUser.id === user.id)) {
        return prevCart; // カートに既に同じ商品がある場合は変更せずにそのまま返す
      }
      const cartItem = {
        plan: plan,
        paidUser: paidUser,
        receivedUser: user,
      };
      const updatedCart = [...prevCart, cartItem];
      localStorage.setItem("cart-items", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (planId: number) => {
    setCart((prevCart: any) => {
      if (!Array.isArray(prevCart)) {
        prevCart = []; // 配列でない場合は空の配列を使用
      }
      const updatedCart = prevCart.filter((item: any) => item.plan.id !== planId || item.receivedUser.id !== user.id);
      localStorage.setItem("cart-items", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  if (!isMounted) {
    return null; // マウント前は何も表示せずにロード中とする
  }

  const isInCart = cart.find((item: any) => item.plan.id === plan.id && item.receivedUser.id === user.id);

  return (
    <div>
      {isRegistered ? (
        <p className="text-xs mt-2 mb-1 mx-4 text-gray-500">{user.name}さん は登録済みです</p>
      ) : (
      <div>
        <p className="text-xs mt-2 mb-1 mx-4 text-gray-500">{user.name}さん にお届け</p>
        <div>
          <div className="mb-4">
            {isInCart ? (
              <button onClick={() => removeFromCart(plan.id)} className="items-center block h-full px-2 py-2 text-sm font-medium text-center mx-4 text-blue-500 hover:text-blue-700 transition duration-500 ease-in-out transform border-2 border-blue-500 hover:border-blue-700 rounded-md">
                －カートから削除
              </button>
            ) : (
              <button onClick={() => addToCart(plan.id)} className="items-center block h-full px-2 py-2 text-sm font-medium text-center mx-4 text-blue-500 hover:text-blue-700 transition duration-500 ease-in-out transform border-2 border-blue-500 hover:border-blue-700 rounded-md">
                ＋カートに追加
              </button>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PlanCartBtn;
