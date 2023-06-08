import React, { useContext, useEffect } from "react";
import { CartContext } from "@/pages/_app";
import { UserContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

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
  family_id: number;
  phonetic: string;
  postal_code: string;
  state: string;
  city: string;
  line1: string;
  line2: string;
  apartment: string;
  phone_number: string;
  is_owner: boolean;
};

type CartItem = {
  plan: Plan;
  paidUser: User;
  receivedUser: User;
};

type PlanProps = {
  data: Plan[];
};

// 商品一覧ページ
const Shop: React.FC<PlanProps> = ({ data }) => {
  const { cartState, addToCart, removeFromCart } = useContext(CartContext);

  return (
    <section>
      <h1>SHOP</h1>
      <div>
        {data ? (
          data.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              cart={cartState}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          ))
        ) : (
          <p>準備中...</p>
        )}
      </div>
    </section>
  );
};

export default Shop;

// プラン一覧の各プランを表示するコンポーネント
export const ProductItem: React.FC<{
  product: Plan;
  cart: Plan[];
  addToCart: (item: Plan) => void;
  removeFromCart: (item: Plan) => void;
}> = ({ product, cart, addToCart, removeFromCart }) => {
  const router = useRouter();
  const { isLoggedIn } = useContext(UserContext);
  const paidUser: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    family_id: 1234,
    phonetic: "ジョンドウ",
    postal_code: "123-4567",
    state: "Tokyo",
    city: "Shibuya",
    line1: "1-2-3",
    line2: "",
    apartment: "",
    phone_number: "123-456-7890",
    is_owner: true,
  };

  const receivedUser: User = {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    family_id: 5678,
    phonetic: "ジェーンスミス",
    postal_code: "987-6543",
    state: "Tokyo",
    city: "Minato",
    line1: "4-5-6",
    line2: "",
    apartment: "",
    phone_number: "987-654-3210",
    is_owner: false,
  };

  const handleAddToCart = () => {
    console.log("isLoggedIn", isLoggedIn);
    if (isLoggedIn === true) {
      addToCart(product);
    } else {
      addToCart(product);
      alert("商品をカートに追加するにはログインが必要です。"); // アラートメッセージの表示
      router.push("/login"); // ログインページへのリダイレクト
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product);
  };

  return (
    <div key={product.id}>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.explanation}</p>
      <p>{product.price}円</p>
      <div>
        {cart.some((item) => item?.id === product.id) ? (
          <div>
            <p className="text-xs mb-3">カートに商品が入っています</p>
            <button onClick={handleRemoveFromCart}>取り消し</button>
          </div>
        ) : (
          <button onClick={handleAddToCart}>＋カートに入れる</button>
        )}
      </div>
    </div>
  );
};
