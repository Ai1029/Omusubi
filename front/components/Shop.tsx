import React, { useContext, useState, useEffect } from "react";
import { GetServerSideProps, NextPage } from "next";
import { UserContext } from "@/pages/_app";
import { useRouter } from "next/router";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRecoilState } from "recoil";
import { cartState } from "@/state/atom";

type Plan = {
	id: number;
	name: string;
	explanation: string;
	price: string;
	image: string;
	stripe_price_id: string;
};
type User = {
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
type PlanProps = {
	data: Plan[];
	family: User[];
};

// 商品一覧ページ
const Shop: React.FC<PlanProps> = ({ data, family }) => {
	return (
		<section>
			<h1>SHOP</h1>
			<div>{data ? data.map((product) => <ProductItem key={product.id} product={product} family={family} />) : <p>準備中...</p>}</div>
		</section>
	);
};

export default Shop;

// プラン一覧の各プランを表示するコンポーネント

export const ProductItem: React.FC<{ product: Plan; family: User[] }> = ({ product, family }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [cart, setCart] = useRecoilState(cartState);
	const router = useRouter();
	const { isLoggedIn } = useContext(UserContext);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const addToCart = (productId: number) => {
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
			if (prevCart.find((item: any) => item.plan.id === product.id)) {
				return prevCart; // カートに既に同じ商品がある場合は変更せずにそのまま返す
			}
			const paidUser = family.find((e) => e.is_owner === true);
			console.log(paidUser);
			const cartItem = family.map((elm) => {
				return {
					plan: product,
					paidUser: paidUser,
					receivedUser: elm,
				};
			});
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

	const removeFromCart = (productId: number) => {
		setCart((prevCart: any) => {
			if (!Array.isArray(prevCart)) {
				prevCart = []; // 配列でない場合は空の配列を使用
			}
			const updatedCart = prevCart.filter((item: any) => item.plan.id !== productId);
			localStorage.setItem("cart-items", JSON.stringify(updatedCart));
			return updatedCart;
		});
	};

	if (!isMounted) {
		return null; // マウント前は何も表示せずにロード中とする
	}

	const isInCart = Array.isArray(cart) && cart.find((item: any) => item.plan.id === product.id);

	return (
		<div key={product.id}>
			<img src={product.image} alt={product.name} />
			<h1>{product.name}</h1>
			<p>{product.explanation}</p>
			<p>{product.price}円</p>
			<div>{isInCart ? <button onClick={() => removeFromCart(product.id)}>－カートから削除</button> : <button onClick={() => addToCart(product.id)}>＋カートに追加</button>}</div>
		</div>
	);
};
