// プラン一覧の各プランを表示するコンポーネント
import React, { useContext, useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useRecoilState } from "recoil";
import { cartState } from "@/state/atom";
import { UserContext } from "@/pages/_app";
import PlanCartBtn from "./PlanCartBtn";
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
	postal_code: string;
	state: string;
	city: string;
	line1: string;
	line2: string;
	phone_number: string;
	is_owner: boolean;
	is_virtual_user: boolean;
};
type Props = {
	plan: TypePlan;
	family: TypeUser[];
};

export const PlanItem: NextPage<Props> = ({ plan, family }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [cart, setCart] = useRecoilState(cartState);
	const router = useRouter();
	const { isLoggedIn } = useContext(UserContext);

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
			const updatedCart = prevCart.filter((item: any) => item.plan.id !== planId);
			localStorage.setItem("cart-items", JSON.stringify(updatedCart));
			return updatedCart;
		});
	};

	if (!isMounted) {
		return null; // マウント前は何も表示せずにロード中とする
	}

	const filteredCart = cart.filter((item) => {
		return item.plan.id === 1;
	});
	const receivedUserIds = filteredCart.map((item) => item.receivedUser.id);
	const familyIds = family.map((user) => user.id);
	const hasAllFamilyIds = familyIds.every((id) => receivedUserIds.includes(id));

	const paidUser = family.find((user) => user.is_owner === true);

	if (!paidUser) {
		return null;
	}

	return (
		<div>
			<div>
				<img src={plan.image} alt={plan.name} />
			</div>
			<h3>{plan.name}</h3>
			<p>{plan.explanation}</p>
			<p>{plan.price}円</p>
			<div>
				<ul>
					{family.map((user) => (
						<li key={user.id}>
							<PlanCartBtn user={user} plan={plan} paidUser={paidUser} />
						</li>
					))}
				</ul>
				{family.length > 1 && <div>{hasAllFamilyIds ? <button onClick={() => removeFromCart(plan.id)}>まとめてカートから削除</button> : <button onClick={() => addToCart(plan.id)}>まとめてカートに追加</button>}</div>}
			</div>
		</div>
	);
};

export default PlanItem;
