import React, { useContext, useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useRecoilState } from "recoil";
import { cartState } from "@/state/atom";
// import { UserContext } from "@/pages/_app";

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
type Props = {
	plan: TypePlan;
	user: TypeUser;
	paidUser: TypeUser;
};

const PlanCartBtn: NextPage<Props> = ({ plan, user, paidUser }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [cart, setCart] = useRecoilState(cartState);
	const router = useRouter();
	// const { isLoggedIn } = useContext(UserContext);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const addToCart = (planId: number) => {
		setCart((prevCart: any) => {
			{
				/*
			 // 認証が実装できたらコメントアウトを外す
			if (isLoggedIn === true) {  
			*/
			}
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
			{
				/*
			 // 認証が実装できたらコメントアウトを外す
      } else {
				alert("商品をカートに追加するにはログインが必要です。"); // アラートメッセージの表示
				router.push("/login"); // ログインページへのリダイレクト
      }
			*/
			}
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
			<p>{user.name}</p>
			<div>
				<div>{isInCart ? <button onClick={() => removeFromCart(plan.id)}>－カートから削除</button> : <button onClick={() => addToCart(plan.id)}>＋カートに追加</button>}</div>
			</div>
		</div>
	);
};

export default PlanCartBtn;
