import React, { useContext } from "react";
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
export const ProductItem: React.FC<{
	product: Plan;
}> = ({ product }) => {
	const [cart, setCart] = useRecoilState(cartState);
	const addToCart = () => {
		setCart([...cart, product]);
	};
	const removeFromCart = (productId:any) => {
		const updatedCart = cart.filter((item) => item.id !== productId);
		setCart(updatedCart);
	};
	return (
		<div key={product.id}>
			<img src={product.image} alt={product.name} />
			<h1>{product.name}</h1>
			<p>{product.explanation}</p>
			<p>{product.price}円</p>
			<div>
				{cart.find((item) => item.id === product.id) ? (
        <button onClick={() => removeFromCart(product.id)}>－カートから削除</button>
      ) : (
        <button onClick={addToCart}>＋カートに追加</button>
      )}
			</div>
		</div>
	);
};
