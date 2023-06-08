import React, { useContext, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { cartState } from "@/state/atom";
// import { cartState } from "./Layout";

type Plan = {
	id: number;
	name: string;
	explanation: string;
	price: string;
	image: string;
	stripe_price_id: string;
};

type PlanProps = {
	data: Plan[];
};

// 商品一覧ページ
const Shop: React.FC<PlanProps> = ({ data }) => {
	return (
		<section>
			<h1>SHOP</h1>
			<div>{data ? data.map((product) => <ProductItem key={product.id} product={product} />) : <p>準備中...</p>}</div>
		</section>
	);
};

export default Shop;

// プラン一覧の各プランを表示するコンポーネント
export const ProductItem: React.FC<{ product: Plan }> = ({ product }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [cart, setCart] = useRecoilState(cartState);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const addToCart = () => {
		setCart((prevCart: any) => {
			if (!Array.isArray(prevCart)) {
				prevCart = []; // 配列でない場合は空の配列を使用
			}
			if (prevCart.find((item: Plan) => item.id === product.id)) {
				return prevCart; // カートに既に同じ商品がある場合は変更せずにそのまま返す
			}
			const updatedCart = [...prevCart, product];
			localStorage.setItem("recoil-persist", JSON.stringify(updatedCart));
			return updatedCart;
		});
	};

	const removeFromCart = (productId: number) => {
		setCart((prevCart: any) => {
			if (!Array.isArray(prevCart)) {
				prevCart = []; // 配列でない場合は空の配列を使用
			}
			const updatedCart = prevCart.filter((item: Plan) => item.id !== productId);
			localStorage.setItem("recoil-persist", JSON.stringify(updatedCart));
			return updatedCart;
		});
	};

	if (!isMounted) {
		return null; // マウント前は何も表示せずにロード中とする
	}

	const isInCart = Array.isArray(cart) && cart.find((item: Plan) => item.id === product.id);

	return (
		<div key={product.id}>
			<img src={product.image} alt={product.name} />
			<h1>{product.name}</h1>
			<p>{product.explanation}</p>
			<p>{product.price}円</p>
			<div>{isInCart ? <button onClick={() => removeFromCart(product.id)}>－カートから削除</button> : <button onClick={addToCart}>＋カートに追加</button>}</div>
		</div>
	);
};
